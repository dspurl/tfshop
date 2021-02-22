<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Requests\v1\SubmitFreightRequest;
use App\Models\v1\Freight;
use App\Models\v1\FreightWay;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * @group freight
 * 运费模板管理
 * Class FreightController
 * @package App\Http\Controllers\v1\Admin
 */
class FreightController extends Controller
{
    /**
     * FreightList
     * 运费模板列表
     * @queryParam  title string 模板名称
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function list(Request $request)
    {
        FreightWay::$withoutAppends = false;
        $q = Freight::query();
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->title) {
            $q->where('name', 'like', '%' . $request->title . '%');
        }
        $q->with(['FreightWay']);
        $limit = $request->limit;
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * FreightCreate
     * 创建运费模板
     * @param SubmitFreightRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 模板名称
     * @queryParam  location array 宝贝地址
     * @queryParam  pinkage array 包邮地区
     * @queryParam  valuation string 计价方式
     * @queryParam  freight_way array 运费方式
     * @queryParam  freight_way.first_piece int 首件
     * @queryParam  freight_way.first_cost int 首费
     * @queryParam  freight_way.add_piece int 续件
     * @queryParam  freight_way.add_cost int 续费
     * @queryParam  freight_way.location array 送货到
     */
    public function create(SubmitFreightRequest $request)
    {
        $return = DB::transaction(function () use ($request) {
            $Freight = new Freight();
            $Freight->name = $request->name;
            $Freight->location = $request->location;
            $Freight->pinkage = $request->pinkage;
            $Freight->valuation = $request->valuation;
            $Freight->save();
            if (count($request->freight_way) > 0) {
                foreach ($request->freight_way as $freight_way) {
                    $FreightWay = new FreightWay();
                    $FreightWay->freight_id = $Freight->id;
                    $FreightWay->first_piece = $freight_way['first_piece'];
                    $FreightWay->first_cost = $freight_way['first_cost'];
                    $FreightWay->add_piece = $freight_way['add_piece'];
                    $FreightWay->add_cost = $freight_way['add_cost'];
                    $FreightWay->location = $freight_way['location'];
                    $FreightWay->save();
                }
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
     * FreightDetail
     * 运费模板详情
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 模板ID
     */
    public function detail($id)
    {
        Freight::$withoutAppends = false;
        FreightWay::$withoutAppends = false;
        $Freight = Freight::with(['FreightWay'])->find($id);
        return resReturn(1, $Freight);
    }

    /**
     * FreightEdit
     * 保存运费模板
     * @param SubmitFreightRequest $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  name string 模板名称
     * @queryParam  location array 宝贝地址
     * @queryParam  pinkage array 包邮地区
     * @queryParam  valuation string 计价方式
     * @queryParam  freight_way array 运费方式
     * @queryParam  freight_way.first_piece int 首件
     * @queryParam  freight_way.first_cost int 首费
     * @queryParam  freight_way.add_piece int 续件
     * @queryParam  freight_way.add_cost int 续费
     * @queryParam  freight_way.location array 送货到
     */
    public function edit(SubmitFreightRequest $request, $id)
    {
        $return = DB::transaction(function () use ($request, $id) {
            $Freight = Freight::find($id);
            $Freight->name = $request->name;
            $Freight->location = $request->location;
            $Freight->pinkage = $request->pinkage;
            $Freight->valuation = $request->valuation;
            $Freight->save();
            if (count($request->freight_way) > 0) {
                $idDelete = [];
                foreach ($request->freight_way as $freight_way) {
                    if (array_key_exists('id', $freight_way)) {
                        $FreightWay = FreightWay::find($freight_way['id']);
                    } else {
                        $FreightWay = new FreightWay();
                    }
                    $FreightWay->freight_id = $Freight->id;
                    $FreightWay->first_piece = $freight_way['first_piece'];
                    $FreightWay->first_cost = $freight_way['first_cost'];
                    $FreightWay->add_piece = $freight_way['add_piece'];
                    $FreightWay->add_cost = $freight_way['add_cost'];
                    $FreightWay->location = $freight_way['location'];
                    $FreightWay->save();
                    $idDelete[] = $FreightWay->id;
                }
                //删除去掉的不包邮配送区域
                FreightWay::where('freight_id', $Freight->id)->whereNotIn('id', $idDelete)->delete();
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
     * FreightDestroy
     * 删除运费模板
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 模板ID
     */
    public function destroy($id)
    {
        $return = DB::transaction(function () use ($id) {
            Freight::where('id', $id)->delete();
            FreightWay::where('freight_id', $id)->delete();
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '删除成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }
}
