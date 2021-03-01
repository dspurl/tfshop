<?php


namespace App\Observers\PaymentLog;


use App\Models\v1\GoodIndent;
use App\Models\v1\PaymentLog;
use Illuminate\Http\Request;

/**
 * good indent payment refund
 * 商品订单退款
 * Class GoodIndentRefundObserver
 * @package App\Observers\GoodIndent
 */
class GoodIndentRefundObserver
{
    protected $request;
    protected $route = [
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

    public function updated(PaymentLog $paymentLog)
    {
        if (($this->execute || app()->runningInConsole())) {
            // 状态为已完成
            if ($paymentLog->type == PaymentLog::PAYMENT_LOG_TYPE_GOODS_INDENT_REFUND && $paymentLog->state == PaymentLog::PAYMENT_LOG_STATE_COMPLETE) {
                $GoodIndent = GoodIndent::find($paymentLog->pay_id);
                $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_REFUND;
                $GoodIndent->save();
            }
        }
    }
}
