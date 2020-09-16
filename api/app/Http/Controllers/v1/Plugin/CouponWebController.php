<?php

namespace App\Http\Controllers\v1\Plugin;

use App\Models\v1\Coupon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CouponWebController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Coupon::query();
        $limit=$request->limit;
        $q->where('state',Coupon::COUPON_STATE_SHOW)->where('residue','>',0);
        $q->where(function($q1) use($request){    //不包括随机优惠券
            $q1->orWhere('type',Coupon::COUPON_TYPE_FULL_REDUCTION)
                ->orWhere('type',Coupon::COUPON_TYPE_DISCOUNT);
        });
        $q->orderBy('cost','desc');
        $q->orderBy('id','desc');
        $q->select('id','cost','type','amount','residue','sill','starttime','endtime','limit_get','state');
        $paginate=$q->withCount(['UserCoupon'=>function($q){
            $q->where('user_id',auth('web')->user()->id);
        }])->paginate($limit);
        return resReturn(1,$paginate);
    }
}
