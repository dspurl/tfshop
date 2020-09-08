<?php

namespace App\Http\Controllers\v1\Plugin;

use App\Code;
use App\Http\Requests\v1\SubmitBannerRequest;
use App\Http\Requests\v1\SubmitCouponRequest;
use App\Models\v1\ApplyUser;
use App\Models\v1\Banner;
use App\Models\v1\Coupon;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Coupon::$withoutAppends = false;
        $q = Coupon::query();
        if($request->name){
            $q->where('name',$request->name);
        }
        if($request->type){
            $q->where('type',$request->type);
        }
        $limit=$request->limit;
        if($request->order){
            $q->orderBy('created_at','desc');
            $q->orderBy('id','desc');
        }
        $paginate=$q->paginate($limit);
        return resReturn(1,$paginate);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitCouponRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubmitCouponRequest $request)
    {
        $return=DB::transaction(function ()use($request){
            $Coupon=new Coupon();
            $Coupon->name = $request->name;
            $Coupon->cost = $request->cost;
            $Coupon->type = $request->type;
            $Coupon->amount = $request->amount;
            $Coupon->residue = $Coupon->amount;
            $Coupon->sill = $request->sill;
            $Coupon->limit_get= $request->limit_get;

            if(count($request->time) == 2){
                $Coupon->starttime = $request->time[0];
                $Coupon->endtime = $request->time[1];
                if($Coupon->starttime == date('Y-m-d')){
                    $Coupon->state = Coupon::COUPON_STATE_SHOW;
                }else{
                    $Coupon->state = Coupon::COUPON_STATE_NO;
                }
            }else{
                return resReturn(0,'请选择领取时间',Code::CODE_WRONG);
            }
            $Coupon->save();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'添加成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $return=DB::transaction(function ()use($request,$id){
            $Coupon=Coupon::find($id);
            switch ($request->action){
                case 1: //提前结束
                    $Coupon->state = Coupon::COUPON_STATE_HIDE;
                    $Coupon->endtime = date('Y-m-d 00:00:00');
                    break;
                case 2: //提前开始
                    $Coupon->starttime = date('Y-m-d 00:00:00');
                    $Coupon->state = Coupon::COUPON_STATE_SHOW;
                    break;
            }
            $Coupon->save();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'操作成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        $return=DB::transaction(function ()use($request,$id){
            Coupon::where('id',$id)->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }
}
