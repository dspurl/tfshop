<?php


namespace App\Observers\GoodIndent;


use App\Models\v1\GoodIndent;
use App\Models\v1\MoneyLog;

/**
 * finish payment money log
 * 完成付款资金记录
 * Class FinishPaymentMoneyLogObserver
 * @package App\Observers\GoodIndent
 */
class FinishPaymentMoneyLogObserver
{

    public function updated(GoodIndent $goodIndent)
    {
        // 当状态为待发货时触发
        if ($goodIndent->state == GoodIndent::GOOD_INDENT_STATE_DELIVER) {
            $Money = new MoneyLog();
            $Money->user_id = $goodIndent->user_id;
            $Money->type = MoneyLog::MONEY_LOG_TYPE_EXPEND;
            $Money->money = $goodIndent->total;
            $Money->remark = '对订单：' . $goodIndent->identification . '的付款';
            $Money->save();
        }
    }
}
