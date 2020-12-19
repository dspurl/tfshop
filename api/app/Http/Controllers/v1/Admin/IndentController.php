<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\common\RedisService;
use App\Models\v1\Dhl;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodIndentCommodity;
use App\Models\v1\MiniProgram;
use App\Models\v1\MoneyLog;
use App\Models\v1\PaymentLog;
use App\Models\v1\User;
use App\Notifications\Common;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
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
        if($request->activeIndex){
            $q->where('state',$request->activeIndex);
        }
        if($request->title){
            $q->where('identification',$request->title);
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
        },'GoodLocation','Dhl','PaymentLogAll'=>function($q){
            $q->select('id','type','name','money','number','platform','state','pay_id','pay_type','created_at','transaction_id');
        }])->find($id);
        return resReturn(1,$GoodIndent);
    }

    /**
     * 查询订单状态
     * @param Request $request
     * @return string
     */
    public function query(Request $request){
        if(!$request->has('id')){
            return resReturn(0,'参数有误',Code::CODE_PARAMETER_WRONG);
        }
        $PaymentLog=PaymentLog::find($request->id);
        $MiniProgram = new MiniProgram();
        $queryNumber=$MiniProgram->queryNumber($PaymentLog->platform,$PaymentLog->number,$PaymentLog->type);
        if($queryNumber['result']== 'error'){
            return resReturn(0,$queryNumber['msg'],Code::CODE_MISUSE);
        }else if($queryNumber['result']== 'ok' && $PaymentLog->state == PaymentLog::PAYMENT_LOG_STATE_CREATE){  //需要同步时
            switch($PaymentLog->type){
                case PaymentLog::PAYMENT_LOG_TYPE_GOODS_INDENT:
                    (new GoodIndent())->goodIndentNotify($PaymentLog['pay_id']);
                    break;
                case PaymentLog::PAYMENT_LOG_TYPE_REFUND:
                    (new GoodIndent())->goodIndentRefundNotify($PaymentLog['pay_id']);
                    break;
            }
            $PaymentLog->state = PaymentLog::PAYMENT_LOG_STATE_COMPLETE;
            $PaymentLog->transaction_id = $queryNumber['transaction_id'];
            $PaymentLog->save();
        }
        return resReturn(1,'同步成功');
    }

    // 发货
    public function shipment(Request $request){
        $return=DB::transaction(function ()use($request){
            $GoodIndent=GoodIndent::with(['User','GoodLocation'])->find($request->id);
            $GoodIndent->dhl_id = $request->dhl_id;
            $GoodIndent->odd = $request->odd;
            $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_TAKE;
            $GoodIndent->shipping_time = Carbon::now()->toDateTimeString();
            $GoodIndent->save();
            $Dhl=Dhl::find($request->dhl_id);
            $Common=(new Common)->deliveryRelease([
                'id'=>$GoodIndent->id,  //订单ID
                'identification'=>$GoodIndent->identification,  //订单号
                'dhl'=>$Dhl->name,  //快递公司
                'odd'=>$request->odd,   // 快递单号
                'total'=>$GoodIndent->total,    //订单金额
                'shipping_time'=>$GoodIndent->shipping_time,    //发货时间
                'location'=>$GoodIndent->GoodLocation,    //收货地址
                'user_id'=>$GoodIndent->User->id    //用户ID
            ]);
            if($Common['result']== 'ok'){
                return array(1,'发货成功');
            }else{
                return array($Common['msg'],Code::CODE_PARAMETER_WRONG);
            }
        });
        if($return[0] == 1){
            return resReturn(1,$return[1]);
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
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
        $redis = new RedisService();
        $lock=RedisLock::lock($redis,'goodRefund');
        if($lock){
            $return=DB::transaction(function ()use($request,$id){
                $GoodIndent=GoodIndent::with(['PaymentLog'=>function($q){
                    $q->where('state',PaymentLog::PAYMENT_LOG_STATE_COMPLETE)->where('type',PaymentLog::PAYMENT_LOG_TYPE_GOODS_INDENT);
                }])->find($id);
                if($request->refund_way == GoodIndent::GOOD_INDENT_REFUND_WAY_BALANCE){
                    $GoodIndent->refund_money = $request->refund_money;
                    $GoodIndent->refund_way = $request->refund_way;
                    $GoodIndent->refund_reason = $request->refund_reason;
                    $GoodIndent->refund_time = Carbon::now()->toDateTimeString();
                    $GoodIndent->state =GoodIndent::GOOD_INDENT_STATE_REFUND;
                    $GoodIndent->save();
                    User::where('id',$GoodIndent->user_id)->increment('money',$request->refund_money*100);
                    $Money=new MoneyLog();
                    $Money->user_id = $GoodIndent->user_id;
                    $Money->type = MoneyLog::MONEY_LOG_TYPE_INCOME;
                    $Money->money = $request->refund_money*100;
                    $Money->remark = '订单：'.$GoodIndent->identification.'的退款';
                    $Money->save();
                    return (new Common)->refund([
                        'money_id'=>$Money->id,  //资金记录ID
                        'identification'=>$GoodIndent->identification,  //订单号
                        'total'=>$request->refund_money*100,    //退款金额
                        'type'=>'退到余额', //退款方式
                        'user_id'=>$GoodIndent->user_id   //用户ID
                    ]);
                }else if($request->refund_way == GoodIndent::GOOD_INDENT_REFUND_WAY_BACK){
                    $GoodIndent->refund_money = $request->refund_money;
                    $GoodIndent->refund_way = $request->refund_way;
                    $GoodIndent->refund_reason = $request->refund_reason;
                    $GoodIndent->refund_time = Carbon::now()->toDateTimeString();
                    $GoodIndent->state =GoodIndent::GOOD_INDENT_STATE_REFUND_PROCESSING;
                    $GoodIndent->save();
                    //第三方支付统一退款入口
                    $MiniProgram = new MiniProgram();
                    $refund=$MiniProgram->refund($GoodIndent->PaymentLog->platform,$GoodIndent->PaymentLog->number,$GoodIndent->PaymentLog->money,$request->refund_money*100,$request->refund_reason);
                    if($refund['result']== 'error'){
                        return $refund;
                    }
                    $PaymentLog = new PaymentLog();
                    $PaymentLog->name = '对订单：'.$GoodIndent->identification.'的退款';
                    $PaymentLog->number = $refund['number'];
                    $PaymentLog->money = $request->refund_money*100;
                    $PaymentLog->pay_id = $GoodIndent->id; //订单ID
                    $PaymentLog->type = PaymentLog::PAYMENT_LOG_TYPE_REFUND;
                    $PaymentLog->platform= $GoodIndent->PaymentLog->platform;
                    $PaymentLog->pay_type = 'App\Models\v1\GoodIndent';
                    $PaymentLog->state = PaymentLog::PAYMENT_LOG_STATE_CREATE;
                    $PaymentLog->save();
                    return $refund;
                }
            });
            RedisLock::unlock($redis,'goodRefund');
            if($return['result'] == 'ok'){
                return resReturn(1,'退款成功');
            }else{
                return resReturn(0,$return['msg'],Code::CODE_PARAMETER_WRONG);
            }
        }else{
            return resReturn(0,'业务繁忙，请稍后再试',Code::CODE_SYSTEM_BUSY);
        }
    }
}
