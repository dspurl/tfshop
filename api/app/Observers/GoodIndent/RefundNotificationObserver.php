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
use App\Models\v1\User;
use App\Notifications\InvoicePaid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

/**
 * finish payment
 * 退款通知
 * Class RefundNotificationObserver
 * @package App\Observers\GoodIndent
 */
class RefundNotificationObserver
{
    protected $request;
    protected $route = [
        'admin/indent/refund',
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
        // 当状态为已退款时触发
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_REFUND) {
            $Money = new MoneyLog();
            $Money->lang = $goodIndent->lang;
            $Money->user_id = $goodIndent->user_id;
            $Money->type = MoneyLog::MONEY_LOG_TYPE_INCOME;
            $Money->money = $goodIndent->refund_money;
            if ($goodIndent->refund_way == GoodIndent::GOOD_INDENT_REFUND_WAY_BALANCE) {
                $Money->remark = __('observer.good_indent.refund_notification.balance.remark', ['id'=>$goodIndent->identification]);
            } else {
                $Money->remark = __('observer.good_indent.refund_notification.remark', ['id'=>$goodIndent->identification]);
            }
            $Money->save();
            $parameter = [
                'money_id' => $Money->id,  //资金记录ID
                'identification' => $goodIndent->identification,  //订单号
                'total' => $goodIndent->refund_money,    //退款金额
                'type' => $goodIndent->refund_way == GoodIndent::GOOD_INDENT_REFUND_WAY_BALANCE ? __('good_indent.refund_way.balance') : __('good_indent.refund_way.back'), //退款方式
                'refund_reason' => $goodIndent->refund_reason,    //退款理由
                'template' => 'refund_success',   //通知模板标识
                'user_id' => $goodIndent->user_id   //用户ID
            ];
            $invoice = [
                'type' => InvoicePaid::NOTIFICATION_TYPE_DEAL,
                'title' => __('observer.good_indent.refund_notification.invoice.title', ['type'=>$parameter['type']]),
                'list' => [
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.identification'),
                        'data' => $parameter['identification']
                    ],
                    [
                        'keyword' => __('good_indent.refund_way'),
                        'data' => $parameter['type']
                    ]
                ],
                'price' => $parameter['total'],
                'remark' => $parameter['refund_reason'],
                'url' => '/pages/finance/bill_show?id=' . $parameter['money_id'],
                'parameter' => $parameter,
                'prefers' => ['database', 'wechat', 'mail']
            ];
            $user = User::find($parameter['user_id']);
            $user->notify(new InvoicePaid($invoice));
        }
    }
}
