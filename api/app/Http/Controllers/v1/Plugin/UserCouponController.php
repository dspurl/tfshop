<?php

namespace App\Http\Controllers\v1\Plugin;

use App\Code;
use App\Models\v1\Coupon;
use App\Models\v1\UserCoupon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class UserCouponController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = UserCoupon::query();
        if($request->index){
            switch ($request->index){
                case 1:
                    $q->where('state',UserCoupon::USER_COUPON_STATE_UNUSED);
                    break;
                case 2:
                    $q->where('state',UserCoupon::USER_COUPON_STATE_USED);
                    break;
                case 3:
                    $q->where('state',UserCoupon::USER_COUPON_STATE_XSE);
                    break;
            }
        }
        if($request->money){
            $q->where('state',UserCoupon::USER_COUPON_STATE_UNUSED);
            $q->whereHas('Coupon', function($query) use ($request){
                $query->where(function($q1) use($request){    //无门槛或当前购买金额大于门槛金额
                    $q1->orWhere('sill',0)
                        ->orWhere('sill','<=',$request->money*100);
                });
            });
        }else{
            $q->whereHas('Coupon', function($query) use ($request){
                $query->where('id','>',0);
            });
        }
        $limit=$request->limit;
        $q->where('user_id',auth('web')->user()->id);
        $q->orderBy('state','ASC');
        $q->orderBy('id','desc');
        $paginate=$q->with(['Coupon'])->paginate($limit);
        return resReturn(1,$paginate);
    }

    /**
     * 优惠券数
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function count(Request $request)
    {
        $count = UserCoupon::where('user_id',auth('web')->user()->id)->where('state',UserCoupon::USER_COUPON_STATE_UNUSED)->count();
        return resReturn(1,$count);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $Coupon=Coupon::find($request->id);
        if($Coupon->residue == 0){
            return resReturn(0,'优惠券已领完',Code::CODE_WRONG);
        }
        if($Coupon->limit_get>0){
            $count=UserCoupon::where('user_id',auth('web')->user()->id)->where('coupon_id',$request->id)->count();
            if($count>=$Coupon->limit_get){
                return resReturn(0,'您已领取过优惠券，无法再次领取',Code::CODE_WRONG);
            }
        }
        $return=DB::transaction(function ()use($request){
            $UserCoupon=new UserCoupon();
            $UserCoupon->user_id = auth('web')->user()->id;
            $UserCoupon->coupon_id = $request->id;
            $UserCoupon->ticket = orderNumber();
            $UserCoupon->save();
            Coupon::where('id',$request->id)->decrement('residue');
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'添加成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }
}
