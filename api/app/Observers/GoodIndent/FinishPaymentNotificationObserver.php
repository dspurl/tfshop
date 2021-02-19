<?php

namespace App\Observers\GoodIndent;

use App\common\RedisService;
use App\Models\v1\GoodIndent;
use App\Notifications\Common;

/**
 * finish payment
 * 完成付款通知
 * Class FinishPaymentNotificationObserver
 * @package App\Observers\GoodIndent
 */
class FinishPaymentNotificationObserver
{
    public function updated(GoodIndent $goodIndent)
    {
        // 当状态为待发货时触发
        if($goodIndent->state == GoodIndent::GOOD_INDENT_STATE_DELIVER){
            $redis = new RedisService();
            $type = $redis->get('goodIndent.pay.type.' . $goodIndent->id);
            (new Common)->finishPayment([
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'name' => $goodIndent->goodsList[0]->name . (count($goodIndent->goodsList) > 1 ? '等多件' : ''),    //商品名称
                'total' => $goodIndent->total,    //订单金额
                'type' => $type,
                'template' => 'finish_payment',   //通知模板标识
                'time' => $goodIndent->pay_time,  //下单时间(付款时间)
                'user_id' => $goodIndent->user_id    //用户ID
            ]);
            (new Common)->adminOrderSendGood([
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'cellphone' => $goodIndent->User->cellphone,    //用户手机
                'total' => $goodIndent->total,    //订单金额
                'type' => $type,
                'template' => 'admin_order_send_good',   //通知模板标识
                'time' => $goodIndent->pay_time,  //下单时间(付款时间)
            ]);
        }
    }
}
