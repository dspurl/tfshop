<?php

/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Exports\v1\GoodExport;
use App\Http\Requests\v1\SubmitGoodRequest;
use App\Models\v1\Freight;
use App\Models\v1\GoodCode;
use App\Models\v1\GoodSku;
use App\Models\v1\GoodSpecification;
use App\Models\v1\Resource;
use App\Models\v1\Specification;
use App\Models\v1\Category;
use App\Models\v1\Good;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\GoodCollection;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

/**
 * @group [ADMIN]Good(商品管理)
 * Class GoodController
 * @package App\Http\Controllers\v1\Admin
 */
class GoodController extends Controller
{
    /**
     * GoodList
     * 商品列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  title string 关键字
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     * @queryParam  notInId array 不包含的商品ID
     * @queryParam  ids array 商品ID组
     */
    public function list(Request $request)
    {
        Good::$withoutAppends = false;
        GoodSku::$withoutAppends = false;
        $q = Good::query();
        $limit = $request->limit;
        if ($request->has('keyword')) {
            $q->where(function ($q1) use ($request) {
                $q1->orWhere('name', 'like', "%$request->keyword%")
                    ->orWhere('number', 'like', "%$request->keyword%");
            });
        }
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $q->where('lang', App::getLocale());
        $q->with(['Language']);
        $paginate = $q->with(['Category' => function ($q) {
            $q->with(['fathers']);
        }, 'goodSku' => function ($q) {
            $q->select('good_id', 'price', 'inventory', 'cost_price');
        }])->paginate($limit);
        return resReturn(1, new GoodCollection($paginate));
    }

    /**
     * GoodCount
     * 商品统计
     */
    public function count()
    {
        $count = [
            'all' => Good::where('lang', App::getLocale())->count(), //全部
            'sell' => Good::where('lang', App::getLocale())->where('is_show', Good::GOOD_SHOW_PUTAWAY)->count(),    //出售
            'warehouse' => Good::where('lang', App::getLocale())->where('is_show', Good::GOOD_SHOW_ENTREPOT)->count(),   //仓库
            'lowInventory' => Good::where('lang', App::getLocale())->where('inventory', '<', config('tfshop.lowInventory'))
                ->where(function ($query) {
                    $query->whereHas('goodSku', function ($subquery) {
                        $subquery->where('inventory', '<', config('tfshop.lowInventory'));
                    })
                        ->orWhereDoesntHave('goodSku');
                })->count(),    //低库存
            'sellOut' => Good::where('lang', App::getLocale())->where('inventory', 0)
                ->where(function ($query) {
                    $query->whereHas('goodSku', function ($subquery) {
                        $subquery->where('inventory', 0);
                    })
                        ->orWhereDoesntHave('goodSku');
                })->count(), //已售完
        ];
        return resReturn(1, $count);
    }

    /**
     * GoodCreate
     * 创建商品
     * @param SubmitGoodRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 商品名称
     * @queryParam  img array 图片
     * @queryParam  video_img string 视频缩略图
     * @queryParam  video string 视频
     * @queryParam  download string 下载内容
     * @queryParam  number string 货号
     * @queryParam  category_id int 分类ID
     * @queryParam  is_inventory int 减库存方式
     * @queryParam  keywords string 关键字
     * @queryParam  short_description string 短描述
     * @queryParam  details string 详情
     * @queryParam  market_price string 市场价
     * @queryParam  cost_price string 成本价
     * @queryParam  price string 销售价
     * @queryParam  is_show int 是否上架
     * @queryParam  is_recommend int 是否推荐
     * @queryParam  type int 类型:0=普通商品-common,1虚拟商品,2卡密/网盘,3下载商品
     * @queryParam  is_new int 是否新品
     * @queryParam  is_hot int 是否热销
     * @queryParam  sort int 排序
     * @queryParam  time string 上架时间
     * @queryParam  timing string 定时上架时间
     * @queryParam  good_specification array 商品规格
     * @queryParam  good_sku array 商品SKU
     * @queryParam  freight_id int    运费模板ID
     * @queryParam  freight_type int 运费方式:0固定邮费,1运费模板
     * @queryParam  freight int 运费
     */
    public function create(SubmitGoodRequest $request)
    {
        if ($request->is_show == Good::GOOD_SHOW_TIMING && !$request->timing) {
            return resReturn(0, __('good.error.time'), Code::CODE_PARAMETER_WRONG);
        }
        if ($request->timing) {
            if (strtotime($request->timing) <= time()) {
                return resReturn(0, __('good.error.timing'), Code::CODE_PARAMETER_WRONG);
            }
        }
        if ($request->video) {
            if (!$request->video_img) {
                return resReturn(0, '请上传商品视频缩略图', Code::CODE_PARAMETER_WRONG);
            }
        }
        DB::transaction(function () use ($request) {
            $Good = new Good();
            $Good->identification = orderNumber();
            $Good->name = $request->name;
            if (is_array($request->category_id)) {
                $category_id = $request->category_id;
                $Good->category_id = end($category_id);
            } else {
                $Good->category_id = $request->category_id;
            }
            $Good->number = $request->number ?? '';
            $Good->type = $request->type;
            if ($Good->type == Good::GOOD_TYPE_COMMON) {
                $Good->freight_id = $request->freight_type === Good::GOOD_FREIGHT_TYPE_TEMPLATE ? $request->freight_id : 0;
            }
            $Good->lang = $request->lang ?? App::getLocale();
            $Good->lang_parent_id = $request->lang_parent_id ?? 0;
            $Good->is_inventory = $request->is_inventory;
            $Good->inventory = $request->inventory ? $request->inventory : 0;
            $Good->keywords = $request->keywords;
            $Good->short_description = $request->short_description;
            $Good->details = $request->details ? $request->details : "";
            $Good->is_show = $request->is_show;
            $Good->is_recommend = $request->is_recommend;
            $Good->sort = $request->sort;
            $Good->time = $request->is_show == Good::GOOD_SHOW_PUTAWAY ? Carbon::now()->toDateTimeString() : null;
            $Good->timing = $request->is_show == Good::GOOD_SHOW_TIMING ? $request->timing : null;
            $Good->freight_type = $request->freight_type;
            $Good->freight = $request->freight_type === Good::GOOD_FREIGHT_TYPE_FIXED ? $request->freight : 0;
            $Good->video_img = $request->video_img;
            $Good->video = $request->video;
            $Good->img = $request->img;
            if (count($request->good_sku) == 0) {
                $Good->price = $request->price;
                $Good->market_price = $request->market_price;
                $Good->cost_price = $request->cost_price;
                $Good->code_type = $request->code_type;
                $Good->is_fixed = $request->is_fixed;
                $Good->download = $request->download;
            }
            $Good->save();
            // sku处理
            $inventory = 0;
            if (count($request->good_sku) > 0) {
                foreach ($request->good_sku as $id => $good_sku) {
                    $GoodSku = new GoodSku();
                    $GoodSku->good_id = $Good->id;
                    $GoodSku->market_price = $good_sku['market_price'];
                    $GoodSku->cost_price = $good_sku['cost_price'];
                    $GoodSku->price = $good_sku['price'];
                    $GoodSku->inventory = $good_sku['inventory'];
                    $GoodSku->product_sku = $good_sku['product_sku'];
                    $GoodSku->img = $good_sku['img'];
                    $inventory += $good_sku['inventory'];
                    // 卡密
                    if ($Good->type == Good::GOOD_TYPE_KEYS) {
                        if (!array_key_exists("good_code", $good_sku)) {
                            throw new \Exception(__('good.error.good_code'), Code::CODE_WRONG);
                        }
                        if (!array_key_exists("code_type", $good_sku)) {
                            throw new \Exception(__('good.error.code_type'), Code::CODE_WRONG);
                        }
                        if (count($good_sku['good_code']) > 1 && $good_sku['inventory'] > count($good_sku['good_code'])) {
                            throw new \Exception(__('good.error.inventory'), Code::CODE_WRONG);
                        }
                        $GoodSku->code_type = $good_sku['code_type'];
                        $GoodSku->is_fixed = $good_sku['is_fixed'];
                    }
                    $GoodSku->save();
                    if ($Good->type == Good::GOOD_TYPE_KEYS) {
                        foreach ($good_sku['good_code'] as $g) {
                            $GoodCode = new GoodCode();
                            $GoodCode->good_sku_id = $GoodSku->id;
                            $GoodCode->name = $g['name'];
                            $GoodCode->code = $g['code'];
                            $GoodCode->save();
                        }
                    }
                }
                $Good->inventory = $inventory;
                $Good->save();
            }
        }, 5);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.add')]));
    }

    /**
     * GoodEdit
     * 保存商品
     * @param SubmitGoodRequest $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 商品ID
     * @queryParam  name string 商品名称
     * @queryParam  img array 图片
     * @queryParam  video_img string 视频缩略图
     * @queryParam  video string 视频
     * @queryParam  download string 下载内容
     * @queryParam  number string 货号
     * @queryParam  category_id int 分类ID
     * @queryParam  is_inventory int 减库存方式
     * @queryParam  keywords string 关键字
     * @queryParam  short_description string 短描述
     * @queryParam  details string 详情
     * @queryParam  market_price string 市场价
     * @queryParam  cost_price string 成本价
     * @queryParam  price string 销售价
     * @queryParam  is_show int 是否上架
     * @queryParam  is_recommend int 是否推荐
     * @queryParam  type int 类型:0=普通商品-common,1虚拟商品,2卡密/网盘,3下载商品
     * @queryParam  is_new int 是否新品
     * @queryParam  is_hot int 是否热销
     * @queryParam  sort int 排序
     * @queryParam  time string 上架时间
     * @queryParam  timing string 定时上架时间
     * @queryParam  good_specification array 商品规格
     * @queryParam  good_sku array 商品SKU
     * @queryParam  freight_id int    运费模板ID
     * @queryParam  freight_type int 运费方式:0固定邮费,1运费模板
     * @queryParam  freight int 运费
     */
    public function edit(SubmitGoodRequest $request, $id)
    {
        if ($request->is_show == Good::GOOD_SHOW_TIMING && !$request->timing) {
            return resReturn(0, __('good.error.time'), Code::CODE_PARAMETER_WRONG);
        }
        if ($request->timing) {
            if (strtotime($request->timing) <= time()) {
                return resReturn(0, __('good.error.timing'), Code::CODE_PARAMETER_WRONG);
            }
        }
        if ($request->video) {
            if (!$request->video_img) {
                return resReturn(0, '请上传商品视频缩略图', Code::CODE_PARAMETER_WRONG);
            }
        }
        $Good = Good::find($id);
        DB::transaction(function () use ($request, $Good) {
            if (is_array($request->category_id)) {
                $category_id = $request->category_id;
                $Good->category_id = end($category_id);
            } else {
                $Good->category_id = $request->category_id;
            }
            $Good->name = $request->name;
            $Good->number = $request->number ?? '';
            $Good->type = $request->type;
            if ($Good->type == Good::GOOD_TYPE_COMMON) {
                $Good->freight_id = $request->freight_type === Good::GOOD_FREIGHT_TYPE_TEMPLATE ? $request->freight_id : 0;
            }
            $Good->is_inventory = $request->is_inventory;
            $Good->inventory = $request->inventory ? $request->inventory : 0;
            $Good->keywords = $request->keywords;
            $Good->short_description = $request->short_description;
            $Good->details = $request->details ? $request->details : "";
            $Good->is_show = $request->is_show;
            $Good->is_recommend = $request->is_recommend;
            $Good->sort = $request->sort;
            $Good->time = $request->is_show == Good::GOOD_SHOW_PUTAWAY ? Carbon::now()->toDateTimeString() : null;
            $Good->timing = $request->is_show == Good::GOOD_SHOW_TIMING ? $request->timing : null;
            $Good->freight_type = $request->freight_type;
            $Good->freight = $request->freight_type === Good::GOOD_FREIGHT_TYPE_FIXED ? $request->freight : 0;
            $Good->video_img = $request->video_img;
            $Good->video = $request->video;
            $Good->img = $request->img;
            if (count($request->good_sku) == 0) {
                $Good->price = $request->price;
                $Good->market_price = $request->market_price;
                $Good->cost_price = $request->cost_price;
                $Good->code_type = $request->code_type;
                $Good->is_fixed = $request->is_fixed;
                $Good->download = $request->download;
            }
            $Good->save();
            // sku处理
            $inventory = 0;
            $GoodSkuAll = [];
            if (count($request->good_sku) > 0) {
                foreach ($request->good_sku as $good_sku) {
                    if (array_key_exists("id", $good_sku)) {
                        $GoodSku = GoodSku::find($good_sku['id']);
                    } else {
                        $GoodSku = new GoodSku();
                        $GoodSku->good_id = $Good->id;
                    }
                    $GoodSkuAll[] = $GoodSku->id;
                    $GoodSku->market_price = $good_sku['market_price'];
                    $GoodSku->cost_price = $good_sku['cost_price'];
                    $GoodSku->price = $good_sku['price'];
                    $GoodSku->inventory = $good_sku['inventory'];
                    $GoodSku->product_sku = $good_sku['product_sku'];
                    $GoodSku->img = $good_sku['img'];
                    $inventory += $good_sku['inventory'];
                    // 卡密
                    if ($Good->type == Good::GOOD_TYPE_KEYS) {
                        if (!array_key_exists("good_code", $good_sku)) {
                            throw new \Exception(__('good.error.good_code'), Code::CODE_WRONG);
                        }
                        if (!array_key_exists("code_type", $good_sku)) {
                            throw new \Exception(__('good.error.code_type'), Code::CODE_WRONG);
                        }
                        if (count($good_sku['good_code']) > 1 && $good_sku['inventory'] > count($good_sku['good_code'])) {
                            throw new \Exception(__('good.error.inventory'), Code::CODE_WRONG);
                        }
                        $GoodSku->code_type = $good_sku['code_type'];
                        $GoodSku->is_fixed = $good_sku['is_fixed'];
                    }
                    $GoodSku->save();
                    if ($Good->type == Good::GOOD_TYPE_KEYS) {
                        foreach ($good_sku['good_code'] as $g) {
                            $GoodCode = new GoodCode();
                            $GoodCode->good_sku_id = $GoodSku->id;
                            $GoodCode->name = $g['name'];
                            $GoodCode->code = $g['code'];
                            $GoodCode->save();
                        }
                    }
                }
                $Good->inventory = $inventory;
                $Good->save();
                //删除去除的SKU
                GoodSku::where('good_id', $Good->id)->whereNotIn('id', $GoodSkuAll)->update(['deleted_at' => Carbon::now()->toDateTimeString()]);
            }
        }, 5);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.update')]));
    }

    /**
     * GoodDetail
     * 商品详情
     * @param int $id
     * @return string
     * @queryParam  id int 商品ID
     */
    public function detail($id)
    {
        Good::$withoutAppends = false;
        GoodSku::$withoutAppends = false;

        $return = [];
        $return['goods'] = [];
        if ($id) {
            $Good = Good::with(['resourcesMany', 'goodSpecificationOld', 'brand', 'goodSku' => function ($q) {
                $q->with('resourcesMany', 'GoodCode');
            }])->find($id);
            if ($Good->goodSku) {
                foreach ($Good->goodSku as $id => $goodSku) {
                    $Good->goodSku[$id]->img = '';
                    if ($goodSku->resourcesMany) {
                        foreach ($goodSku->resourcesMany as $resourcesMany) {
                            if ($resourcesMany->depict == 'product_sku_file') {
                                $Good->goodSku[$id]->file = $resourcesMany->img;
                                $Good->goodSku[$id]->file_id = $resourcesMany->id;
                                $Good->goodSku[$id]->file_name = $resourcesMany->name;
                            } else {
                                $Good->goodSku[$id]->img = $resourcesMany->img;
                            }
                        }
                    }
                }
            }
            $return['goods'] = collect($Good)->merge((new Good())->getImg($Good->resourcesMany));
        }
        //展示应用所在分类下的子类目
        $Category = Category::orderBy('sort', 'ASC')->orderBy('id', 'ASC')->get();

        foreach ($Category as $id => $c) {
            $Category[$id]->label = $c->name;
            $Category[$id]->value = $c->id;
        }
        $return['category'] = genTree($Category->toArray(), 'pid');
        $return['freight'] = Freight::get();
        return resReturn(1, $return);
    }

    /**
     * GoodSpecification
     * 商品规格
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 商品ID
     */
    public function specification($id)
    {
        Specification::$withoutAppends = false;
        $Category = Category::where('state', Category::CATEGORY_STATE_YES)->with(['SpecificationOn' => function ($q) {
            $q->orderBy('sort', 'ASC');
        }, 'BrandOn' => function ($q) {
            $q->orderBy('sort', 'ASC');
        }])->find($id);
        return resReturn(1, $Category);
    }

    /**
     * GoodState
     * 变更商品状态
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 商品ID
     */
    public function state($id, Request $request)
    {
        $return = DB::transaction(function () use ($request, $id) {
            if ($id > 0) {
                $Good = Good::find($id);
                if ($Good->is_show == Good::GOOD_SHOW_PUTAWAY) {
                    $Good->is_show = Good::GOOD_SHOW_ENTREPOT;
                } else {
                    $Good->is_show = Good::GOOD_SHOW_PUTAWAY;
                }
                $Good->save();
            } else {
                if (!$request->all()) {
                    return resReturn(0, __('good.error.content'), Code::CODE_WRONG);
                }
                $all = $request->all();
                if ($all[0]['is_show'] == Good::GOOD_SHOW_PUTAWAY) {
                    $is_show = Good::GOOD_SHOW_ENTREPOT;
                } else {
                    $is_show = Good::GOOD_SHOW_PUTAWAY;
                }
                $idData = collect($request->all())->pluck('id');
                Good::whereIn('id', $idData)->update(['is_show' => $is_show, 'time' => null]);
            }

            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.update')]));
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }

    /**
     * GoodDestroy
     * 删除商品
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 商品ID
     */
    public function destroy($id, Request $request)
    {
        $return = DB::transaction(function () use ($request, $id) {
            if ($id > 0) {
                Good::destroy($id);
            } else {
                if (!$request->all()) {
                    return resReturn(0, __('good.error.content'), Code::CODE_WRONG);
                }
                $idData = collect($request->all())->pluck('id');
                Good::destroy($idData);
            }
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }

    /**
     * GoodExport
     * 商品导出
     * @param Request $request
     * @return string
     */
    public function export(Request $request)
    {
        $date = date('Ymd');
        $title = __('good.list');
        $name = "temporary/$title$date.xlsx";
        $list = [];
        Good::$withoutAppends = false;
        GoodSku::$withoutAppends = false;
        $q = Good::query();
        if ($request->activeIndex != 1) {
            if ($request->activeIndex == 2) {
                $q->where('is_show', Good::GOOD_SHOW_PUTAWAY);
            } else if ($request->activeIndex == 3) {
                $q->where('is_show', Good::GOOD_SHOW_ENTREPOT);
            } else if ($request->activeIndex == 4) {
                $q->whereHas('goodSku', function ($query) {
                    $query->groupBy('id')->having('inventory', '<', 10);
                });
            } else if ($request->activeIndex == 5) {
                $q->whereHas('goodSku', function ($query) {
                    $query->groupBy('id')->having('inventory', 0);
                });
            }
        }
        if ($request->title) {
            $q->where(function ($q1) use ($request) {
                $q1->where('name', 'like', '%' . $request->title . '%')
                    ->orWhere('number', $request->title);
            });
        }
        if ($request->cateId) {
            $q->where('category_id', collect($request->cateId)->last());
        }
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $paginate = $q->with(['resources' => function ($q) {
            $q->where('depict', 'like', '%_zimg');
        }, 'goodSku' => function ($q) {
            $q->select('good_id', 'price', 'inventory', 'cost_price');
        }, 'category'])->get();
        foreach ($paginate as $p) {
            $priceShow = (new Good())->getPriceShow($p);
            $config[$p->type][] = '';
            $list[$p->type][] = [
                'id' => $p->id,
                'type' => $p->type,
                'name' => $p->name,
                'price' => $priceShow[0],
                'category' => $p->category ? $p->category->name : __('common.nothing'),
                'number' => $p->number,
                'inventory' => (new Good())->getInventoryShow($p),
                'sales' => $p->sales,
                'state' => $p->putaway_show,
                'is_inventory' => $p->is_inventory_show,
                'is_recommend' => $p->is_recommend ? __('common.yes') : __('common.yes'),
                'time' => $p->time,
                'updated_at' => $p->updated_at,
            ];
        }
        Excel::store(new GoodExport($list, $config, $title), "public/" . $name);
        return resReturn(1, request()->root() . '/storage/' . $name);
    }
}
