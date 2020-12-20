<?php
/**
 * 消息通知公共类
 * 所有消息通知通过此类实现
 */
namespace App\Notifications;

use App\Models\v1\User;
use Carbon\Carbon;

class Common
{
    /**
     * 验证
     * @param $parameter    //传过的参数
     * @param $array    //必需存在的参数
     * @return array    //返回值
     */
    protected function verification($parameter,$array){
        $return = [
            'result'=>'ok',
            'msg'=>'成功'
        ];
        foreach ($array as $p){
            if(!$parameter->has($p)){
                $return= [
                    'result'=>'error',
                    'msg'=>'未配置'.$p
                ];
                break;
            }
        }
        return $return;
    }

    /**
     * 发货通知
     * @param $parameter    //传入的参数
     * @return array
     */
    public function deliveryRelease($parameter){
        $return = [
            'result'=>'ok',
            'msg'=>'成功'
        ];
        $parameter = collect($parameter);
        $verification=$this->verification($parameter,['id','identification','dhl','odd','total','user_id','template']);
        if($verification['result'] == 'error'){
            return $verification;
        }
        $invoice=[
            'type'=> InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
            'title'=>'您购买的商品已发货，请到订单详情查看',
            'list'=>[
                [
                    'keyword'=>'订单编号',
                    'data'=>$parameter['identification']
                ],
                [
                    'keyword'=>'发货时间',
                    'data'=> $parameter['shipping_time']
                ],
                [
                    'keyword'=>'物流公司',
                    'data'=>$parameter['dhl']
                ],
                [
                    'keyword'=>'快递单号',
                    'data'=>$parameter['odd']
                ],
                [
                    'keyword'=>'收件信息',
                    'data'=>$parameter['location']->name.' '.$parameter['location']->cellphone.' '.$parameter['location']->location.$parameter['location']->house
                ],
            ],
            'remark'=>'请保持收件手机畅通！',
            'url'=>'/pages/order/showOrder?id='.$parameter['id'],
            'parameter'=>$parameter,
            'prefers'=>['database','miniweixin','mail','wechat']
        ];
        $user = User::find($parameter['user_id']);
        $user->notify(new InvoicePaid($invoice));
        return $return;
    }

    /**
     * 确认收货通知
     * @param $parameter    //传入的参数
     * @return array
     */
    public function orderConfirmReceipt($parameter){
        $return = [
            'result'=>'ok',
            'msg'=>'成功'
        ];
        $parameter = collect($parameter);
        $verification=$this->verification($parameter,['id','identification','name','created_at','shipping_time','confirm_time','template','user_id']);
        if($verification['result'] == 'error'){
            return $verification;
        }
        $invoice=[
            'type'=> InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
            'title'=>'亲：您在我们商城买的宝贝已经确认收货。',
            'list'=>[
                [
                    'keyword'=>'订单编号',
                    'data'=>$parameter['identification']
                ],
                [
                    'keyword'=>'商品名称',
                    'data'=>$parameter['name']
                ],
                [
                    'keyword'=>'下单时间',
                    'data'=>$parameter['created_at']
                ],
                [
                    'keyword'=>'发货时间',
                    'data'=>$parameter['shipping_time']
                ],
                [
                    'keyword'=>'确认收货时间',
                    'data'=>$parameter['confirm_time']
                ]
            ],
            'remark'=>'感谢您的支持与厚爱。',
            'url'=>'/pages/order/showOrder?id='.$parameter['id'],
            'parameter'=>$parameter,
            'prefers'=>['database','wechat','mail']
        ];
        $user = User::find($parameter['user_id']);
        $user->notify(new InvoicePaid($invoice));
        return $return;
    }

    /**
     * 订单完成通知
     * @param $parameter    //传入的参数
     * @return array
     */
    public function adminOrderCompletion($parameter){
        $return = [
            'result'=>'ok',
            'msg'=>'成功'
        ];
        $parameter = collect($parameter);
        $verification=$this->verification($parameter,['id','identification','name','confirm_time','template']);
        if($verification['result'] == 'error'){
            return $verification;
        }
        $invoice=[
            'type'=> InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
            'title'=>'订单完成通知',
            'list'=>[
                [
                    'keyword'=>'订单编号',
                    'data'=>$parameter['identification']
                ],
                [
                    'keyword'=>'商品名称',
                    'data'=>$parameter['name']
                ],
                [
                    'keyword'=>'完成时间',
                    'data'=>$parameter['confirm_time']
                ]
            ],
            'remark'=>'客户已确认收货，订单已完成',
            'url'=>'/Indent/shipment?id='.$parameter['id'],
            'parameter'=>$parameter,
            'admin'=>true,
            'prefers'=>['wechat','mail']
        ];
        if(config('notification.account')){
            $account=explode(',',config('notification.account'));
            foreach ($account as $uid) {
                $user = User::find($uid);
                $invoice['parameter']['user_id']=$uid;
                $user->notify(new InvoicePaid($invoice)); // 发送通知
            }
        }
        return $return;
    }

    /**
     * 完成付款通知
     * @param $parameter    //传入的参数
     * @return array
     */
    public function finishPayment($parameter){
        $return = [
            'result'=>'ok',
            'msg'=>'成功'
        ];
        $parameter = collect($parameter);
        $verification=$this->verification($parameter,['identification','id','name','total','user_id','type','time','template']);
        if($verification['result'] == 'error'){
            return $verification;
        }
        $invoice=[
            'type'=> InvoicePaid::NOTIFICATION_TYPE_DEAL,
            'title'=>'恭喜您！购买的商品已支付成功，我们会尽快安排发货哦！么么哒！~~',
            'list'=>[
                [
                    'keyword'=>'订单编号',
                    'data'=>$parameter['identification']
                ],
                [
                    'keyword'=>'商品名称',
                    'data'=>$parameter['name']
                ],
                [
                    'keyword'=>'订单总额',
                    'data'=>sprintf("%01.2f",$parameter['total']/100),
                ],
                [
                    'keyword'=>'支付方式',
                    'data'=>$parameter['type']
                ],
                [
                    'keyword'=>'订单状态',
                    'data'=>'已支付'
                ],
                [
                    'keyword'=>'下单时间',
                    'data'=>$parameter['time']
                ]
            ],
            'price'=>$parameter['total'],
            'url'=>'/pages/order/showOrder?id='.$parameter['id'],
            'parameter'=>$parameter,
            'prefers'=>['database','mail','wechat']
        ];
        $user = User::find($parameter['user_id']);
        $user->notify(new InvoicePaid($invoice));
        return $return;
    }

    /**
     * 订单待发货提醒
     * @param $parameter    //传入的参数
     * @return array
     */
    public function adminOrderSendGood($parameter){
        $return = [
            'result'=>'ok',
            'msg'=>'成功'
        ];
        $parameter = collect($parameter);
        $verification=$this->verification($parameter,['id','identification','cellphone','total','type','template','time']);
        if($verification['result'] == 'error'){
            return $verification;
        }
        $invoice=[
            'type'=> InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
            'title'=>'您有一个新的待发货订单',
            'list'=>[
                [
                    'keyword'=>'订单编号',
                    'data'=>$parameter['identification']
                ],
                [
                    'keyword'=>'订单总额',
                    'data'=>sprintf("%01.2f",$parameter['total']/100),
                ],
                [
                    'keyword'=>'买家',
                    'data'=>$parameter['cellphone']
                ],
                [
                    'keyword'=>'支付方式',
                    'data'=>$parameter['type']
                ],
                [
                    'keyword'=>'订单状态',
                    'data'=>'已支付'
                ],
                [
                    'keyword'=>'付款时间',
                    'data'=>$parameter['time']
                ]
            ],
            'remark'=>'客户已付款，尽快发货吧',
            'price'=>$parameter['total'],
            'url'=>'/Indent/shipment?id='.$parameter['id'],
            'admin'=>true,
            'parameter'=>$parameter,
            'prefers'=>['mail','wechat']
        ];
        if(config('notification.account')){
            $account=explode(',',config('notification.account'));
            foreach ($account as $uid) {
                $user = User::find($uid);
                $invoice['parameter']['user_id']=$uid;
                $user->notify(new InvoicePaid($invoice)); // 发送通知
            }
        }
        return $return;
    }

    /**
     * 退款通知
     * @param $parameter    //传入的参数
     * @return array
     */
    public function refund($parameter){
        $return = [
            'result'=>'ok',
            'msg'=>'成功'
        ];
        $parameter = collect($parameter);
        $verification=$this->verification($parameter,['identification','money_id','total','user_id','type','template','refund_reason']);
        if($verification['result'] == 'error'){
            return $verification;
        }
        $invoice=[
            'type'=> InvoicePaid::NOTIFICATION_TYPE_DEAL,
            'title'=>'您有一笔退款成功，退款方式：'.$parameter['type'].'，请留意。',
            'list'=>[
                [
                    'keyword'=>'订单编号',
                    'data'=>$parameter['identification']
                ],
                [
                    'keyword'=>'退款方式',
                    'data'=>$parameter['type']
                ]
            ],
            'price'=>$parameter['total'],
            'remark'=>$parameter['refund_reason'],
            'url'=>'/pages/finance/bill_show?id='.$parameter['money_id'],
            'parameter'=>$parameter,
            'prefers'=>['database','wechat','mail']
        ];
        $user = User::find($parameter['user_id']);
        $user->notify(new InvoicePaid($invoice));
        return $return;
    }

    /**
     * 注册通知
     * @param $parameter    //传入的参数
     * @return array
     */
    public function register($parameter){
        $return = [
            'result'=>'ok',
            'msg'=>'成功'
        ];
        $parameter = collect($parameter);
        $verification=$this->verification($parameter,['phoneNumber','password','user_id','template']);
        if($verification['result'] == 'error'){
            return $verification;
        }
        $invoice=[
            'type'=> InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
            'title'=>'您好，恭喜您成功注帐号。',
            'list'=>[
                [
                    'keyword'=>'账号',
                    'data'=>$parameter['phoneNumber']
                ],
                [
                    'keyword'=>'初始密码',
                    'data'=>$parameter['password'],
                    'copy'=>true
                ],
                [
                    'keyword'=>'手机',
                    'data'=>$parameter['phoneNumber']
                ]
            ],
            'remark'=>'您第一次授权登录我们平台，我们将为您生成初始密码，请妥善保管',
            'parameter'=>$parameter,
            'prefers'=>['database']
        ];
        $user = User::find($parameter['user_id']);
        $user->notify(new InvoicePaid($invoice));
        return $return;
    }
}
