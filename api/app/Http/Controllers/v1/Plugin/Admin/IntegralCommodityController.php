<?php

namespace App\Http\Controllers\v1\Plugin\Admin;

use App\Code;
use App\Models\v1\IntegralCommodity;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\v1\Good;
use Illuminate\Support\Facades\DB;

/**
 * IntegralCommodity
 * 积分商品
 * Class IntegralCommodityController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class IntegralCommodityController extends Controller
{
    /**
     * IntegralCommodityList
     * 积分商品列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = IntegralCommodity::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $q->with(['Good' => function ($q) {
            $q->select('id', 'name', 'category_id', 'number', 'is_show', 'sort')->with(['resources' => function ($q) {
                $q->where('depict', 'like', '%_zimg');
            }, 'goodSku' => function ($q) {
                $q->select('good_id', 'price', 'inventory');
            }, 'category']);
        }]);
        $paginate = $q->paginate($limit);
        if ($paginate) {
            foreach ($paginate as $id => $p) {
                if ($p->Good) {
                    $paginate[$id]->Good->price_show = (new Good())->getPriceShow($p->Good);
                    $paginate[$id]->Good->inventory_show = (new Good())->getInventoryShow($p->Good);
                }
            }
        }
        $return = [
            'all' => IntegralCommodity::select('good_id')->get()->pluck('good_id'),
            'paginate' => $paginate
        ];
        return resReturn(1, $return);
    }
    /**
     * IntegralCommodityCreate
     * 创建积分商品
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  request array 选中的商品
     */
    public function create(Request $request)
    {
        DB::transaction(function () use ($request) {
            foreach ($request->all() as $all) {
                $IntegralCommodity = new IntegralCommodity();
                $IntegralCommodity->good_id = $all;
                $IntegralCommodity->is_hidden = IntegralCommodity::INTEGRAL_MALL_IS_HIDDEN_YES;
                $IntegralCommodity->save();
            }
        }, 5);
        return resReturn(1, '操作成功');
    }
    /**
     * IntegralCommodityEdit
     * 积分商品更新
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 积分商品商品ID
     * @queryParam  request array 选中的商品
     */
    public function edit(Request $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            if ($id) {
                $IntegralCommodity = IntegralCommodity::find($id);
                $IntegralCommodity->type = $request->type;
                $IntegralCommodity->value = $request->value;
                $IntegralCommodity->is_hidden = $request->is_hidden;
                $IntegralCommodity->save();
            } else {
                
                foreach ($request->all() as $all) {
                    $IntegralCommodity = IntegralCommodity::find($all['id']);
                    $IntegralCommodity->type = $all['type'];
                    $IntegralCommodity->value = $all['value'];
                    $IntegralCommodity->is_hidden = $all['is_hidden'];
                    $IntegralCommodity->save();
                }
            }
        }, 5);
        return resReturn(1, '操作成功');
    }
    /**
     * IntegralCommodityDestroy
     * 积分商品删除
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 积分商品ID
     */
    public function destroy($id, Request $request)
    {
        DB::transaction(function () use ($request, $id) {
            if ($id > 0) {
                IntegralCommodity::destroy($id);
            } else {
                if (!$request->all()) {
                    throw new \Exception('请选择内容', Code::CODE_WRONG);
                }
                $idData = collect($request->all())->pluck('id');
                IntegralCommodity::destroy($idData);
            }
        }, 5);
        return resReturn(1, '删除成功');
    }
}
