<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Observers\GoodIndent;


use App\Models\v1\GoodIndent;
use App\Models\v1\MoneyLog;
use Illuminate\Http\Request;

/**
 * finish payment money log
 * 完成付款资金记录
 * Class FinishPaymentMoneyLogObserver
 * @package App\Observers\GoodIndent
 */
class FinishPaymentMoneyLogObserver
{

    protected $request;
    protected $route = [
        'app/balancePay',
        'admin/indent/query',
        'app/refundNotify'
    ];
    protected $execute = false;

    public function __construct(Request $request)
    {
        if (!app()->runningInConsole()) {
            $this->request = $request;
            $path = explode("admin", $request->path());
            if (count($path) == 2) {
                $name = 'admin' . $path[1];
            } else {
                $path = explode("app", $request->path());
                $name = 'app' . $path[1];
            }
            if (collect($this->route)->contains($name)) {
                $this->execute = true;
            }
        }
    }

    public function updated(GoodIndent $goodIndent)
    {
        // 当状态为待发货时触发
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_DELIVER) {
            $Money = new MoneyLog();
            $Money->user_id = $goodIndent->user_id;
            $Money->type = MoneyLog::MONEY_LOG_TYPE_EXPEND;
            $Money->money = $goodIndent->total;
            $Money->remark = __('observer.good_indent.finish_payment_money_log.remark', ['id'=>$goodIndent->identification]);
            $Money->save();
        }
    }
}
