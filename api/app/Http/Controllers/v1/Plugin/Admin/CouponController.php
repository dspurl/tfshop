<?php

namespace App\Http\Controllers\v1\Plugin\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitCouponRequest;
use App\Models\v1\Coupon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * Coupon
 * 优惠券
 * Class CouponController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class CouponController extends Controller
{
    /**
     * CouponList
     * 优惠券列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 优惠券名称
     * @queryParam  type int 优惠券类型
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        Coupon::$withoutAppends = false;
        $q = Coupon::query();
        if ($request->name) {
            $q->where('name', $request->name);
        }
        if ($request->type) {
            $q->where('type', $request->type);
        }
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * CouponCreate
     * 优惠券添加
     * @param SubmitCouponRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 优惠券名称
     * @queryParam  cost int 优惠券价值
     * @queryParam  type int 优惠券类型:1=满减-full_reduction,2=随机-random,3=折扣-discount
     * @queryParam  amount int 数量
     * @queryParam  residue int 剩余数量
     * @queryParam  sill int 门槛
     * @queryParam  start_time string 优惠券领取开始时间
     * @queryParam  end_time string 优惠券领取结束时间
     * @queryParam  limit_get int 每人限领数量
     * @queryParam  state int 状态:0=未开始-not_start,1=进行中-underway,2=已结束-finished
     */
    public function create(SubmitCouponRequest $request)
    {
        DB::transaction(function () use ($request) {
            $Coupon = new Coupon();
            $Coupon->name = $request->name;
            $Coupon->cost = $request->cost;
            $Coupon->type = $request->type;
            $Coupon->amount = $request->amount ?? 0;
            $Coupon->residue = $Coupon->amount;
            $Coupon->sill = $request->sill;
            $Coupon->limit_get = $request->limit_get ?? 0;
            if (count($request->time) == 2) {
                $Coupon->start_time = $request->time[0];
                $Coupon->end_time = $request->time[1];
                if ($Coupon->start_time == date('Y-m-d')) {
                    $Coupon->state = Coupon::COUPON_STATE_UNDERWAY;
                } else {
                    $Coupon->state = Coupon::COUPON_STATE_NOT_START;
                }
            } else {
                throw new \Exception('请选择领取时间', Code::CODE_WRONG);
            }
            $Coupon->save();
        }, 5);
        return resReturn(1, '添加成功');
    }

    /**
     * CouponEdit
     * 优惠券更新
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 优惠券ID
     * @queryParam  name string 优惠券名称
     * @queryParam  cost int 优惠券价值
     * @queryParam  type int 优惠券类型:1=满减-full_reduction,2=随机-random,3=折扣-discount
     * @queryParam  amount int 数量
     * @queryParam  residue int 剩余数量
     * @queryParam  sill int 门槛
     * @queryParam  start_time string 优惠券领取开始时间
     * @queryParam  end_time string 优惠券领取结束时间
     * @queryParam  limit_get int 每人限领数量
     * @queryParam  state int 状态:0=未开始-not_start,1=进行中-underway,2=已结束-finished
     */
    public function edit(Request $request, $id)
    {
        $Coupon = Coupon::find($id);
        switch ($request->action) {
            case 1: //提前结束
                $Coupon->state = Coupon::COUPON_STATE_FINISHED;
                $Coupon->end_time = date('Y-m-d 00:00:00');
                break;
            case 2: //提前开始
                $Coupon->start_time = date('Y-m-d 00:00:00');
                $Coupon->state = Coupon::COUPON_STATE_UNDERWAY;
                break;
        }
        $Coupon->save();
        return resReturn(1, '操作成功');
    }

    /**
     * CouponDestroy
     * 优惠券删除
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 优惠券ID
     */
    public function destroy($id, Request $request)
    {
        DB::transaction(function () use ($request, $id) {
            if ($id > 0) {
                Coupon::destroy($id);
            } else {
                if (!$request->all()) {
                    throw new \Exception('请选择内容', Code::CODE_WRONG);
                }
                $idData = collect($request->all())->pluck('id');
                Coupon::destroy($idData);
            }
        }, 5);
        return resReturn(1, '删除成功');
    }
}
