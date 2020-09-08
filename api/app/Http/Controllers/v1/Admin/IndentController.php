<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Models\v1\Dhl;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodIndentCommodity;
use App\Models\v1\MoneyLog;
use App\Models\v1\User;
use App\Models\v1\UserCoupon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use EasyWeChat\Factory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use App\common\RedisLock;

class IndentController extends Controller
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
        if($request->state){
            $q->where('state',$request->state);
        }
        $limit=$request->limit;
        $q->orderBy('updated_at','DESC');
        $paginate=$q->with(['goodsList'=>function($q){
            $q->with(['goodSku']);
        }])->paginate($limit);
        return resReturn(1,$paginate);
    }

    public function show($id){
        GoodIndent::$withoutAppends = false;
        GoodIndentCommodity::$withoutAppends = false;
        $GoodIndent=GoodIndent::with(['goodsList'=>function($q){
            $q->with(['goodSku']);
        },'GoodLocation','Dhl'])->find($id);
        return resReturn(1,$GoodIndent);
    }

    // 发货
    public function shipment(Request $request){
        $GoodIndent=GoodIndent::with(['User'])->find($request->id);
        $GoodIndent->dhl_id = $request->dhl_id;
        $GoodIndent->odd = $request->odd;
        $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_TAKE;
        $GoodIndent->shipping_time = Carbon::now()->toDateTimeString();
        $GoodIndent->save();
        $Dhl=Dhl::find($request->dhl_id);
        //通知
        $config = config('wechat.mini_program.default');
        $delivery_release = config('wechat.subscription_information.delivery_release');
        $app = Factory::miniProgram($config); // 小程序
        $data = [
            'template_id' => $delivery_release,
            'touser' => $GoodIndent->User->wechat_applet_openid,
            'page' => 'pages/order/showOrder?id='.$GoodIndent->id,
            'data' => [
                'character_string1' => [
                    'value' => $GoodIndent->identification,
                ],
                'thing3' => [
                    'value' => $Dhl->name,
                ],
                'character_string4' => [
                    'value' => $request->odd,
                ],
                'amount9' => [
                    'value' => $GoodIndent->total/100,
                ],
                'date6' => [
                    'value' => Carbon::now()->toDateTimeString(),
                ]
            ],
        ];
        $app->subscribe_message->send($data);
        return resReturn(1,'发货成功');
    }
    // 退款
    public function refund($id,Request $request){
        if(!$id){
            return resReturn(0,'参数有误',Code::CODE_PARAMETER_WRONG);
        }
        if(!$request->has('refund_money')){
            return resReturn(0,'退款金额有误',Code::CODE_PARAMETER_WRONG);
        }
        if(!$request->has('refund_way')){
            return resReturn(0,'退款方式有误',Code::CODE_PARAMETER_WRONG);
        }
        if(!$request->has('refund_reason')){
            return resReturn(0,'退款原因有误',Code::CODE_PARAMETER_WRONG);
        }
        $redis = Redis::connection('default');
        $lock=RedisLock::lock($redis,'goodRefund');
        if($lock){
            $return=DB::transaction(function ()use($request,$id){
                $GoodIndent=GoodIndent::with(['GoodIndentUser'])->find($id);
                $GoodIndent->refund_money = $request->refund_money;
                $GoodIndent->refund_way = $request->refund_way;
                $GoodIndent->refund_reason = $request->refund_reason;
                $GoodIndent->refund_time = Carbon::now()->toDateTimeString();
                $GoodIndent->state =GoodIndent::GOOD_INDENT_STATE_REFUND;
                $GoodIndent->save();
                if($request->refund_way == GoodIndent::GOOD_INDENT_REFUND_WAY_BALANCE){
                    User::where('id',$GoodIndent->user_id)->increment('money',$GoodIndent->refund_money);
                    $Money=new MoneyLog();
                    $Money->user_id = $GoodIndent->user_id;
                    $Money->type = MoneyLog::MONEY_LOG_TYPE_INCOME;
                    $Money->money = $GoodIndent->refund_money;
                    $Money->remark = '订单：'.$GoodIndent->identification.'的退款';
                    $Money->save();
                }
                //优惠券退还
                if($GoodIndent->GoodIndentUser){
                    UserCoupon::where('id',$GoodIndent->GoodIndentUser->user_coupon_id)->update(['state'=>UserCoupon::USER_COUPON_STATE_UNUSED]);
                }
                return array(1,'退款成功');
            });
            RedisLock::unlock($redis,'goodRefund');
            if($return[0] == 1){
                return resReturn(1,$return[1]);
            }else{
                return resReturn(0,$return[0],$return[1]);
            }
        }else{
            return resReturn(0,'业务繁忙，请稍后再试',Code::CODE_SYSTEM_BUSY);
        }
    }
}
