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
use App\Models\v1\MiniProgram;
use App\Models\v1\PaymentLog;
use Illuminate\Http\Request;

/**
 * good indent escrow refund
 * 商品订单第三方支付退款
 * Class RefundNotificationObserver
 * @package App\Observers\GoodIndent
 */
class EscrowRefundObserver
{
    protected $request;
    protected $route = [
        'admin/indent/refund',
    ];
    protected $execute = false;

    public function __construct(Request $request)
    {
        if (!app()->runningInConsole()) {
            $this->request = $request;
            $path = explode("admin", $request->path());
            if (count($path) == 2) {
                $name = 'admin' . preg_replace("/\/\\d+/", '', $path[1]);
            } else {
                $path = explode("app", $request->path());
                $name = 'app' . preg_replace("/\/\\d+/", '', $path[1]);
            }
            if (collect($this->route)->contains($name)) {
                $this->execute = true;
            }
        }
    }

    public function updated(GoodIndent $goodIndent)
    {
        // 当状态为退款处理中触发
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_REFUND_PROCESSING) {
            //第三方支付统一退款入口
            $MiniProgram = new MiniProgram();
            $refund = $MiniProgram->refund($goodIndent->PaymentLog->platform, $goodIndent->PaymentLog->number, $goodIndent->PaymentLog->money, $this->request->refund_money * 100, $this->request->refund_reason);
            if ($refund['result'] == 'ok') {
                $PaymentLog = new PaymentLog();
                $PaymentLog->user_id = $goodIndent->user_id;
                $PaymentLog->name = __('observer.good_indent.escrow_refund_payment_log.name', ['id'=>$goodIndent->identification]);
                $PaymentLog->number = $refund['number'];
                $PaymentLog->money = $this->request->refund_money * 100;
                $PaymentLog->pay_id = $goodIndent->id; //订单ID
                $PaymentLog->type = PaymentLog::PAYMENT_LOG_TYPE_GOODS_INDENT_REFUND;
                $PaymentLog->platform = $goodIndent->PaymentLog->platform;
                $PaymentLog->pay_type = 'App\Models\v'.config('dsshop.versions').'\GoodIndent';
                $PaymentLog->state = PaymentLog::PAYMENT_LOG_STATE_CREATE;
                $PaymentLog->save();
            }
        }
    }
}
