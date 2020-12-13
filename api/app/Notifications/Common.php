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
        $verification=$this->verification($parameter,['id','identification','dhl','odd','total','user_id']);
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
                    'keyword'=>'物流公司',
                    'data'=>$parameter['dhl']
                ],
                [
                    'keyword'=>'快递单号',
                    'data'=>$parameter['odd']
                ],
                [
                    'keyword'=>'发货时间',
                    'data'=> Carbon::now()->toDateTimeString()
                ]
            ],
            'remark'=>'感谢您的支持。',
            'url'=>'/pages/order/showOrder?id='.$parameter['id'],
            'identification'=>'delivery_release',
            'parameter'=>$parameter,
            'prefers'=>['database','miniweixin','mail']
        ];
        $user = User::find($parameter['user_id']);
        $user->notify(new InvoicePaid($invoice));
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
        $verification=$this->verification($parameter,['identification','money_id','total','user_id']);
        if($verification['result'] == 'error'){
            return $verification;
        }
        $invoice=[
            'type'=> InvoicePaid::NOTIFICATION_TYPE_DEAL,
            'title'=>'对订单：'.$parameter['identification'].'的付款',
            'list'=>[
                [
                    'keyword'=>'支付方式',
                    'data'=>$parameter['type']
                ]
            ],
            'price'=>$parameter['total'],
            'url'=>'/pages/finance/bill_show?id='.$parameter['money_id'],
            'prefers'=>['database','mail']
        ];
        $user = User::find($parameter['user_id']);
        $user->notify(new InvoicePaid($invoice));
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
        $verification=$this->verification($parameter,['identification','money_id','total','user_id','type']);
        if($verification['result'] == 'error'){
            return $verification;
        }
        $invoice=[
            'type'=> InvoicePaid::NOTIFICATION_TYPE_DEAL,
            'title'=>'对订单：'.$parameter['identification'].'的退款',
            'list'=>[
                [
                    'keyword'=>'退款方式',
                    'data'=>$parameter['type']
                ]
            ],
            'price'=>$parameter['total'],
            'url'=>'/pages/finance/bill_show?id='.$parameter['money_id'],
            'prefers'=>['database','mail']
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
        $verification=$this->verification($parameter,['phoneNumber','password','user_id']);
        if($verification['result'] == 'error'){
            return $verification;
        }
        $invoice=[
            'type'=> InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
            'title'=>'会员注册成功',
            'list'=>[
                [
                    'keyword'=>'手机',
                    'data'=>$parameter['phoneNumber']
                ],
                [
                    'keyword'=>'初始密码',
                    'data'=>$parameter['password'],
                    'copy'=>true
                ]
            ],
            'remark'=>'您第一次授权登录我们平台，我们将为您生成初始密码，请妥善保管',
            'prefers'=>['database']
        ];
        $user = User::find($parameter['user_id']);
        $user->notify(new InvoicePaid($invoice));
        return $return;
    }
}
