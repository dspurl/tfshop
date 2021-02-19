<?php

namespace App\Observers\GoodIndent;

use App\common\RedisService;
use App\Models\v1\GoodIndent;
use App\Models\v1\MoneyLog;
use App\Notifications\Common;

/**
 * finish payment
 * 退款通知
 * Class RefundNotificationObserver
 * @package App\Observers\GoodIndent
 */
class RefundNotificationObserver
{
    public function updated(GoodIndent $goodIndent)
    {
        // 当状态为已退款时触发
        if ($goodIndent->state == GoodIndent::GOOD_INDENT_STATE_REFUND) {
            $Money = new MoneyLog();
            $Money->user_id = $goodIndent->user_id;
            $Money->type = MoneyLog::MONEY_LOG_TYPE_INCOME;
            $Money->money = $goodIndent->refund_money;
            if ($goodIndent->refund_way == GoodIndent::GOOD_INDENT_REFUND_WAY_BALANCE) {
                $Money->remark = '订单：' . $goodIndent->identification . '的退款';
            } else {
                $Money->remark = '订单：' . $goodIndent->identification . '的退款，已退回到您的充值账号中';
            }
            $Money->save();
            return (new Common)->refund([
                'money_id' => $Money->id,  //资金记录ID
                'identification' => $goodIndent->identification,  //订单号
                'total' => $goodIndent->refund_money,    //退款金额
                'type' => $goodIndent->refund_way == GoodIndent::GOOD_INDENT_REFUND_WAY_BALANCE ? '退到余额' : '原路退还', //退款方式
                'refund_reason' => $goodIndent->refund_reason,    //退款理由
                'template' => 'refund_success',   //通知模板标识
                'user_id' => $goodIndent->user_id   //用户ID
            ]);
        }
    }
}
