<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitGoodRequest;
use App\Models\v1\Brand;
use App\Models\v1\Freight;
use App\Models\v1\GoodSku;
use App\Models\v1\GoodSpecification;
use App\Models\v1\Resource;
use App\Models\v1\Specification;
use App\Models\v1\Category;
use App\Models\v1\Good;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * @group good
 * 商品管理
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
     */
    public function list(Request $request)
    {
        Good::$withoutAppends = false;
        GoodSku::$withoutAppends = false;
        $q = Good::query();
        $limit = $request->limit;
        if ($request->activeIndex == 2) {
            $q->where('is_show', Good::GOOD_SHOW_PUTAWAY);
        } else if ($request->activeIndex == 3) {
            $q->where('is_show', Good::GOOD_SHOW_ENTREPOT);
        }
        if ($request->title) {
            /*
            MySQL<5.7并且商品不多时可用模糊搜索方式
            $q->where(function($q1) use($request){
                $q1->where('name','like','%'.$request->title.'%')
                    ->orWhere('number',$request->title);
            });
            */
            $q->where(function ($q1) use ($request) {
                $q1->orWhereRaw('MATCH (name,keywords,number) AGAINST (\'' . $request->title . '\' IN NATURAL LANGUAGE MODE)')
                    ->orWhere('number', $request->title);
            });

        }
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $paginate = $q->with(['resources' => function ($q) {
            $q->where('depict', 'like', '%_zimg');
        }, 'goodSku' => function ($q) {
            $q->select('good_id', 'price', 'inventory');
        }, 'category'])->paginate($limit);
        if ($paginate) {
            foreach ($paginate as $id => $p) {
                $paginate[$id]['price_show'] = (new Good())->getPriceShow($p);
                $paginate[$id]['inventory_show'] = (new Good())->getInventoryShow($p);
                $paginate[$id]['putaway'] = false;
                $paginate[$id]['entrepot'] = false;
                $paginate[$id]['delete'] = false;
            }
        }
        return resReturn(1, $paginate);
    }

    /**
     * GoodCreate
     * 创建商品
     * @param SubmitGoodRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 商品名称
     * @queryParam  number string 货号
     * @queryParam  freight_id int    运费模板ID
     * @queryParam  category_id int 分类ID
     * @queryParam  brand_id int 品牌ID
     * @queryParam  is_inventory int 减库存方式
     * @queryParam  keywords string 关键字
     * @queryParam  short_description string 短描述
     * @queryParam  details string 详情
     * @queryParam  is_show int 是否上架
     * @queryParam  is_recommend int 是否推荐
     * @queryParam  is_new int 是否新品
     * @queryParam  is_hot int 是否热销
     * @queryParam  sort int 排序
     * @queryParam  time string 上架时间
     * @queryParam  timing string 定时上架时间
     * @queryParam  good_specification array 商品规格
     * @queryParam  good_sku array 商品SKU
     */
    public function create(SubmitGoodRequest $request)
    {
        if (count($request->good_sku) == 0) {
            return resReturn(0, '请设置产品规格', Code::CODE_PARAMETER_WRONG);
        }
        if ($request->is_show == Good::GOOD_SHOW_TIMING && !$request->timing) {
            return resReturn(0, '请选择上架时间', Code::CODE_PARAMETER_WRONG);
        }
        if ($request->timing) {
            if (strtotime($request->timing) <= time()) {
                return resReturn(0, '上架时间必须大于当前时间', Code::CODE_PARAMETER_WRONG);
            }
        }
        $return = DB::transaction(function () use ($request) {
            $Good = new Good();
            $Good->identification = orderNumber();
            $Good->name = $request->name;
            if (is_array($request->category_id)) {
                $category_id = $request->category_id;
                $Good->category_id = end($category_id);
            } else {
                $Good->category_id = $request->category_id;
            }
            $Good->number = $request->number;
            $Good->freight_id = $request->freight_id;
            $Good->brand_id = $request->brand_id ? $request->brand_id : 0;
            $Good->is_inventory = $request->is_inventory;
            $Good->keywords = $request->keywords;
            $Good->short_description = $request->short_description;
            $Good->details = imgFindReplaceUpdate($request->details, 'good_details');
            $Good->is_show = $request->is_show;
            $Good->is_recommend = $request->is_recommend;
            $Good->is_new = $request->is_new;
            $Good->is_hot = $request->is_hot;
            $Good->sort = $request->sort;
            $Good->time = $request->is_show == 1 ? Carbon::now()->toDateTimeString() : null;
            $Good->timing = $request->timing;
            $Good->order_price = $request->price;
            $Good->save();
            // 商品规格处理
            if (count($request->good_specification) > 0) {

                foreach ($request->good_specification as $id => $specification) {
                    $GoodSpecification = new GoodSpecification();
                    $GoodSpecification->good_id = $Good->id;
                    $GoodSpecification->specification_id = $specification['specification_id'];
                    $GoodSpecification->data = $specification['data'];
                    $GoodSpecification->save();
                }
            }
            // 商品主图处理
            if ($request->img) {
                $Resource = new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'goods_' . $Good->id . '_zimg';
                $Resource->image_id = $Good->id;
                $Resource->image_type = 'App\Models\v1\Good';
                $Resource->img = imgPathShift('good', $request->img);
                $Resource->save();
            }
            // 视频处理
            if ($request->video) {
                $Resource = new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_VIDEO;
                $Resource->depict = 'goods_' . $Good->id . '_video';
                $Resource->image_id = $Good->id;
                $Resource->image_type = 'App\Models\v1\Good';
                $Resource->img = $request->video;
                $Resource->save();
            }
            // 视频封面处理
            if ($request->poster) {
                $Resource = new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'goods_' . $Good->id . '_poster';
                $Resource->image_id = $Good->id;
                $Resource->image_type = 'App\Models\v1\Good';
                $Resource->img = $request->poster;
                $Resource->save();
            }
            // 图片列表处理
            if ($request->imgList > 0) {
                foreach ($request->imgList as $id => $imgList) {
                    $Resource = new Resource();
                    $Resource->type = Resource::RESOURCE_TYPE_IMG;
                    $Resource->depict = 'goods_' . $Good->id;
                    $Resource->image_id = $Good->id;
                    $Resource->image_type = 'App\Models\v1\Good';
                    $Resource->img = imgPathShift('good', $imgList['response']);
                    $Resource->save();
                }
            }
            // sku处理
            $order_price = 0;
            if (count($request->good_sku) > 0) {
                foreach ($request->good_sku as $id => $good_sku) {
                    //获取最低售价
                    if ($order_price == 0 || $order_price > $good_sku['price']) {
                        $order_price = $good_sku['price'];
                    }
                    $GoodSku = new GoodSku();
                    $GoodSku->good_id = $Good->id;
                    $GoodSku->market_price = $good_sku['market_price'];
                    $GoodSku->cost_price = $good_sku['cost_price'];
                    $GoodSku->price = $good_sku['price'];
                    $GoodSku->inventory = $good_sku['inventory'];
                    $GoodSku->product_sku = $good_sku['product_sku'];
                    $GoodSku->save();
                    if (array_key_exists("img", $good_sku)) {
                        $Resource = new Resource();
                        $Resource->type = Resource::RESOURCE_TYPE_IMG;
                        $Resource->depict = 'product_sku_' . $GoodSku->id;
                        $Resource->image_id = $GoodSku->id;
                        $Resource->image_type = 'App\Models\v1\GoodSku';
                        $Resource->img = imgPathShift('product_sku', $good_sku['img']);
                        $Resource->save();
                    }
                }
                $Good->order_price = $order_price;
                $Good->save();
            }
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '添加成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }

    /**
     * GoodEdit
     * 保存商品
     * @param SubmitGoodRequest $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 商品ID
     * @queryParam  name string 商品名称
     * @queryParam  number string 货号
     * @queryParam  freight_id int    运费模板ID
     * @queryParam  category_id int 分类ID
     * @queryParam  brand_id int 品牌ID
     * @queryParam  is_inventory int 减库存方式
     * @queryParam  keywords string 关键字
     * @queryParam  short_description string 短描述
     * @queryParam  details string 详情
     * @queryParam  is_show int 是否上架
     * @queryParam  is_recommend int 是否推荐
     * @queryParam  is_new int 是否新品
     * @queryParam  is_hot int 是否热销
     * @queryParam  sort int 排序
     * @queryParam  time string 上架时间
     * @queryParam  timing string 定时上架时间
     * @queryParam  good_specification array 商品规格
     * @queryParam  good_sku array 商品SKU
     */
    public function edit(SubmitGoodRequest $request, $id)
    {
        if (count($request->good_sku) == 0) {
            return resReturn(0, '请设置产品规格', Code::CODE_PARAMETER_WRONG);
        }
        if ($request->is_show == Good::GOOD_SHOW_TIMING && !$request->timing) {
            return resReturn(0, '请选择上架时间', Code::CODE_PARAMETER_WRONG);
        }
        if ($request->timing) {
            if (strtotime($request->timing) <= time()) {
                return resReturn(0, '上架时间必须大于当前时间', Code::CODE_PARAMETER_WRONG);
            }
        }
        $Good = Good::find($id);
        $return = DB::transaction(function () use ($request, $Good) {
            if (is_array($request->category_id)) {
                $category_id = $request->category_id;
                $Good->category_id = end($category_id);
            } else {
                $Good->category_id = $request->category_id;
            }
            $Good->name = $request->name;
            $Good->number = $request->number;
            $Good->freight_id = $request->freight_id;
            $Good->brand_id = $request->brand_id ? $request->brand_id : 0;
            $Good->is_inventory = $request->is_inventory;
            $Good->keywords = $request->keywords;
            $Good->short_description = $request->short_description;
            $Good->details = imgFindReplaceUpdate($request->details, 'good_details');
            $Good->is_show = $request->is_show;
            $Good->is_recommend = $request->is_recommend;
            $Good->is_new = $request->is_new;
            $Good->is_hot = $request->is_hot;
            $Good->sort = $request->sort;
            $Good->time = $request->is_show == 1 ? Carbon::now()->toDateTimeString() : null;
            $Good->timing = $request->timing;
            $Good->order_price = $request->price;
            $Good->save();
            // 商品规格处理
            if (count($request->good_specification) > 0) {
                foreach ($request->good_specification as $id => $specification) {
                    if (array_key_exists("id", $specification)) {
                        $GoodSpecification = GoodSpecification::find($specification['id']);
                    } else {
                        $GoodSpecification = new GoodSpecification();
                        $GoodSpecification->good_id = $Good->id;
                        $GoodSpecification->specification_id = $specification['specification_id'];
                    }
                    $GoodSpecification->data = $specification['data'];
                    $GoodSpecification->save();
                }
            }
            // 商品主图处理
            if ($request->imgArr && $request->img) {
                $Resource = Resource::find($request->imgArr['id']);
                if ($request->img != $Resource->img) {
                    imgPathDelete('good', $Resource->img);
                }
                $Resource->img = imgPathShift('good', $request->img);
                $Resource->save();

            }
            // 视频处理
            if ($request->videoArr && $request->video) {
                $Resource = Resource::find($request->videoArr['id']);
                $Resource->img = $request->video;
                $Resource->save();
            } else if ($request->video) {
                $Resource = new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_VIDEO;
                $Resource->depict = 'goods_' . $Good->id . '_video';
                $Resource->image_id = $Good->id;
                $Resource->image_type = 'App\Models\v1\Good';
                $Resource->img = $request->video;
                $Resource->save();
            }
            // 视频封面处理
            if ($request->posterArr && $request->poster) {
                $Resource = Resource::find($request->posterArr['id']);
                $Resource->img = $request->poster;
                $Resource->save();
            } else if ($request->poster) {
                $Resource = new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'goods_' . $Good->id . '_poster';
                $Resource->image_id = $Good->id;
                $Resource->image_type = 'App\Models\v1\Good';
                $Resource->img = $request->poster;
                $Resource->save();
            }
            // 图片列表处理
            if ($request->imgList > 0) {
                $ResourceAll = [];
                foreach ($request->imgList as $id => $imgList) {
                    if (array_key_exists("id", $imgList)) {
                        $Resource = Resource::find($imgList['id']);
                        if ($imgList['response'] != $Resource->img) {
                            imgPathDelete('good', $Resource->img);
                        }
                    } else {
                        $Resource = new Resource();
                        $Resource->type = Resource::RESOURCE_TYPE_IMG;
                        $Resource->depict = 'goods_' . $Good->id;
                        $Resource->image_id = $Good->id;
                        $Resource->image_type = 'App\Models\v1\Good';
                    }
                    $Resource->img = imgPathShift('good', $imgList['response']);
                    $Resource->save();
                    $ResourceAll[] = $Resource->id;
                }
                //删除去除的资源
                $ResourceDelete = Resource::where('image_id', $Good->id)->where('image_type', 'App\Models\v1\Good')->where('depict', 'not like', '%_zimg')->where('depict', 'not like', '%_video')->where('depict', 'not like', '%_poster')->whereNotIn('id', $ResourceAll)->get();
                if ($ResourceDelete) {
                    foreach ($ResourceDelete as $r) {
                        imgPathDelete('good', $r->img);
                    }
                }
                Resource::where('image_id', $Good->id)->where('image_type', 'App\Models\v1\Good')->where('depict', 'not like', '%_zimg')->where('depict', 'not like', '%_video')->where('depict', 'not like', '%_poster')->whereNotIn('id', $ResourceAll)->delete();
            }
            // sku处理
            if (count($request->good_sku) > 0) {
                $GoodSkuAll = [];
                $ResourceAll = [];
                $order_price = 0;
                foreach ($request->good_sku as $id => $good_sku) {
                    //获取最低售价
                    if ($order_price == 0 || $order_price > $good_sku['price']) {
                        $order_price = $good_sku['price'];
                    }
                    if (array_key_exists("id", $good_sku)) {
                        $GoodSku = GoodSku::find($good_sku['id']);
                    } else {
                        $GoodSku = new GoodSku();
                        $GoodSku->good_id = $Good->id;
                    }
                    $GoodSku->market_price = $good_sku['market_price'];
                    $GoodSku->cost_price = $good_sku['cost_price'];
                    $GoodSku->price = $good_sku['price'];
                    $GoodSku->inventory = $good_sku['inventory'];
                    $GoodSku->product_sku = $good_sku['product_sku'];
                    $GoodSku->save();
                    $GoodSkuAll[] = $GoodSku->id;
                    if (array_key_exists("img", $good_sku) && $good_sku['img']) {
                        if (array_key_exists("resources", $good_sku)) {
                            $Resource = Resource::find($good_sku['resources']['id']);
                            if ($good_sku['img'] != $Resource->img) {
                                imgPathDelete('good', $Resource->img);
                            }
                        } else {
                            $Resource = new Resource();
                            $Resource->type = Resource::RESOURCE_TYPE_IMG;
                            $Resource->depict = 'product_sku_' . $GoodSku->id;
                            $Resource->image_id = $GoodSku->id;
                            $Resource->image_type = 'App\Models\v1\GoodSku';
                        }
                        $Resource->img = imgPathShift('product_sku', $good_sku['img']);
                        $Resource->save();
                        $ResourceAll[] = $Resource->id;
                    }
                }
                $Good->order_price = $order_price;
                $Good->save();
                //删除去除的SKU
                GoodSku::where('good_id', $Good->id)->whereNotIn('id', $GoodSkuAll)->update(['deleted_at' =>Carbon::now()->toDateTimeString()]);
            }
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '更新成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }

    /**
     * GoodDetail
     * 商品详情
     * @param  int $id
     * @return \Illuminate\Http\Response
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
                $q->with('resources');
            }])->find($id);
            if ($Good->goodSku) {
                foreach ($Good->goodSku as $id => $goodSku) {
                    $Good->goodSku[$id]->img = '';
                    if ($goodSku->resources) {
                        $Good->goodSku[$id]->img = $goodSku->resources->img;
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
     * @param  int $id
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
     * @param  int $id
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
                    return resReturn(0, '请选择内容', Code::CODE_WRONG);
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
            return resReturn(1, '变更成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }

    /**
     * GoodDestroy
     * 删除商品
     * @param  int $id
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
                    return resReturn(0, '请选择内容', Code::CODE_WRONG);
                }
                $idData = collect($request->all())->pluck('id');
                Good::whereIn('id', $idData)->update(['deleted_at' =>Carbon::now()->toDateTimeString()]);
            }
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '删除成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }
}
