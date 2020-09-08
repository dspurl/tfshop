<?php

namespace App\Http\Controllers\v1\Element;

use App\Code;
use App\Http\Requests\v1\SubmitGoodIndentRequest;
use App\Models\v1\Coupon;
use App\Models\v1\Good;
use App\Models\v1\GoodLocation;
use App\Models\v1\GoodIndentUserCoupon;
use App\Models\v1\User;
use App\Models\v1\UserCoupon;
use Illuminate\Support\Facades\Redis;
use App\common\RedisLock;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodIndentCommodity;
use App\Models\v1\GoodSku;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GoodIndentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        GoodIndent::$withoutAppends = false;
        GoodIndentCommodity::$withoutAppends = false;
        $q = GoodIndent::query();
        $q->where('user_id',auth('web')->user()->id);
        if($request->index){
            $q->where('state',$request->index);
        }
        if($request->search == 1){
            $q->where('created_at','>=',date("Y-m-d 00:00:00",strtotime($request->startTime)))->where('created_at','<=',date("Y-m-d 23:59:59",strtotime($request->endTime)));
        }
        $limit=$request->limit;
        $q->orderBy('state','ASC')->orderBy('updated_at','DESC');
        $paginate=$q->with(['goodsList'=>function($q){
            $q->with(['goodSku']);
        }])->paginate($limit);
        return resReturn(1,$paginate);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitGoodIndentRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubmitGoodIndentRequest $request)
    {
        $redis = Redis::connection('default');
        $lock=RedisLock::lock($redis,'goodIndent');
        if($lock){
            $return=DB::transaction(function ()use($request){
                $GoodIndent=new GoodIndent();
                $GoodIndent->user_id=auth('web')->user()->id;
                $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_PAY;
                $GoodIndent->carriage = $request->carriage;
                $total = 0;
                foreach ($request->indentCommodity as $indentCommodity){
                    $Good=Good::select('id','is_inventory','inventory')->find($indentCommodity['good_id']);
                    if($Good && $Good->is_inventory == Good::GOOD_IS_INVENTORY_NO){ //拍下减库存
                        if(!$indentCommodity['good_sku_id']){ //非SKU商品
                            if($Good->inventory-$indentCommodity['number']<0){
                                return array('存在库存不足的商品，请重新获取购物车',Code::CODE_PARAMETER_WRONG);
                            }
                            $Good->inventory = $Good->inventory-$indentCommodity['number'];
                            $Good->save();
                        }else{
                            $GoodSku=GoodSku::find($indentCommodity['good_sku_id']);
                            if($GoodSku->inventory-$indentCommodity['number']<0){
                                return array('存在库存不足的SKU商品，请重新获取购物车',Code::CODE_PARAMETER_WRONG);
                            }
                            $GoodSku->inventory = $GoodSku->inventory-$indentCommodity['number'];
                            $GoodSku->save();
                        }
                    }
                    $total+=$indentCommodity['number']*$indentCommodity['price'];
                }
                $GoodIndent->identification = orderNumber();

                $GoodIndent->remark = $request->remark;
                $couponMoney=0;
                if($request->user_coupon_id){   //使用了优惠券
                    $UserCoupon=UserCoupon::with(['Coupon'])->find($request->user_coupon_id);
                    if($UserCoupon){
                        switch ($UserCoupon->Coupon->type){
                            case Coupon::COUPON_TYPE_FULL_REDUCTION:
                            case Coupon::COUPON_TYPE_RANDOM:
                                $couponMoney = $UserCoupon->Coupon->cost/100;
                                break;
                            case Coupon::COUPON_TYPE_DISCOUNT:  //折扣：商品总额*优惠券折扣/100
                                $couponMoney = $total* ($UserCoupon->Coupon->cost/10000);
                                break;
                        }
                        $UserCoupon->state = UserCoupon::USER_COUPON_STATE_USED;
                        $UserCoupon->save();
                    }
                    $GoodIndent->coupon_money=$couponMoney;
                }
                $GoodIndent->total = $total + $request->carriage - $couponMoney;
                $GoodIndent->save();
                if($request->user_coupon_id){
                    $GoodIndentUserCoupon=new GoodIndentUserCoupon();
                    $GoodIndentUserCoupon->good_indent_id = $GoodIndent->id;
                    $GoodIndentUserCoupon->user_coupon_id = $request->user_coupon_id;
                    $GoodIndentUserCoupon->save();
                }
                foreach ($request->indentCommodity as $id=>$indentCommodity){
                    $GoodIndentCommodity=new GoodIndentCommodity();
                    $GoodIndentCommodity->good_indent_id = $GoodIndent->id;
                    $GoodIndentCommodity->good_id = $indentCommodity['good_id'];
                    $GoodIndentCommodity->good_sku_id = $indentCommodity['good_sku_id'];
                    $GoodIndentCommodity->img = $indentCommodity['img'];
                    $GoodIndentCommodity->name = $indentCommodity['name'];
                    $GoodIndentCommodity->price = $indentCommodity['price'];
                    $GoodIndentCommodity->number = $indentCommodity['number'];
                    $GoodIndentCommodity->save();
                }
                $GoodLocation=new GoodLocation();
                $GoodLocation->good_indent_id = $GoodIndent->id;
                $GoodLocation->cellphone = $request->address['cellphone'];
                $GoodLocation->name = $request->address['name'];
                $GoodLocation->location = $request->address['location'];
                $GoodLocation->address = $request->address['address'];
                $GoodLocation->latitude = $request->address['latitude'];
                $GoodLocation->longitude = $request->address['longitude'];
                $GoodLocation->house = $request->address['house'];
                $GoodLocation->save();

                return array(1,$GoodIndent->id);
            }, 5);
            RedisLock::unlock($redis,'goodIndent');
            if($return[0] == 1){
                return resReturn(1,$return[1]);
            }else{
                return resReturn(0,$return[0],$return[1]);
            }
        }else{
            return resReturn(0,'业务繁忙，请稍后再试',Code::CODE_SYSTEM_BUSY);
        }
    }

    // 更新商品库存
    public function gcount(Request $request){
        $return = $request->all();
        foreach ($request->all() as $id=> $all){
            if($all['good_sku_id']){ //sku商品
                $GoodSku=GoodSku::find($all['good_sku_id']);
                if($GoodSku->inventory<$all['number']){ //库存不足时
                    $return[$id]['invalid']= true;  //标记为失效
                }else{
                    $return[$id]['invalid']= false;
                }
            }else{
                $Good=Good::find($all['good_id']);
                if($Good->inventory<$all['number']){
                    $return[$id]['invalid']= true;  //标记为失效
                }else{
                    $return[$id]['invalid']= false;
                }
            }
        }
        return resReturn(1,$return);
    }

    // 订单支付详情
    public function pay($id,Request $request)
    {

        GoodIndentCommodity::$withoutAppends = false;
        GoodIndent::$withoutAppends=false;
        User::$withoutAppends=false;
        $GoodIndent=GoodIndent::with(['goodsList'=>function($q){
            $q->select('good_id','good_indent_id')->with(['good'=>function($q){
                $q->select('name','id');
            }]);
        },'User'=>function($q){
            $q->select('id','money');
        }])->select('id','total','user_id')->find($id);
        return resReturn(1,$GoodIndent);
    }

    // 取消订单
    public function cancel($id)
    {
        $GoodIndent=GoodIndent::with(['goodsList','GoodIndentUser'])->find($id);
        $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_CANCEL;
        $GoodIndent->save();
        //库存处理
        foreach ($GoodIndent->goodsList as $indentCommodity){
            $Good=Good::select('id','is_inventory','inventory')->find($indentCommodity['good_id']);
            if($Good && $Good->is_inventory == Good::GOOD_IS_INVENTORY_NO){ //拍下减库存
                if(!$indentCommodity['good_sku_id']){ //非SKU商品
                    $Good->inventory = $Good->inventory+$indentCommodity['number'];
                    $Good->save();
                }else{
                    $GoodSku=GoodSku::find($indentCommodity['good_sku_id']);
                    $GoodSku->inventory = $GoodSku->inventory+$indentCommodity['number'];
                    $GoodSku->save();
                }
            }
        }
        //优惠券退还
        if($GoodIndent->GoodIndentUser){
            UserCoupon::where('id',$GoodIndent->GoodIndentUser->user_coupon_id)->update(['state'=>UserCoupon::USER_COUPON_STATE_UNUSED]);
        }
        return resReturn(1,'成功');
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function show($id,Request $request)
    {
        GoodIndentCommodity::$withoutAppends = false;
        GoodSku::$withoutAppends=false;
        GoodIndent::$withoutAppends=false;
        $GoodIndent=GoodIndent::with(['goodsList'=>function($q){
            $q->with(['good'=>function($q){
                $q->with(['resourcesMany','goodSku'=>function($q){
                    $q->with('resources')->where('inventory','>',0);
                }]);
            },'goodSku']);
        },'GoodLocation'])->find($id);
        return resReturn(1,$GoodIndent);
    }

    /**
     * @param $id
     * @return string
     */
    public function receipt($id){
        $GoodIndent=GoodIndent::find($id);
        $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH;
        $GoodIndent->confirm_time = Carbon::now()->toDateTimeString();
        $GoodIndent->save();
        return resReturn(1,'收货成功');
    }

    public function destroy($id){
        GoodIndent::where('id',$id)->delete();
        return resReturn(1,'删除成功');
    }
}
