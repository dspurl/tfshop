<?php


namespace App\Observers\PaymentLog;


use App\common\RedisService;
use App\Models\v1\Good;
use App\Models\v1\GoodIndent;
use App\Models\v1\PaymentLog;
use Carbon\Carbon;
use Illuminate\Http\Request;

/**
 * good indent payment succeed
 * 商品订单支付完成
 * Class GoodIndentPaymentSucceedObserver
 * @package App\Observers\GoodIndent
 */
class GoodIndentPaymentSucceedObserver
{
    protected $request;
    protected $route = [
        'app/paymentNotify'
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
            if ($paymentLog->type == PaymentLog::PAYMENT_LOG_TYPE_GOODS_INDENT && $paymentLog->state == PaymentLog::PAYMENT_LOG_STATE_COMPLETE) {
                $GoodIndent = GoodIndent::with(['goodsList' => function ($q) {
                    $q->select('good_id', 'good_indent_id')->with(['good' => function ($q) {
                        $q->select('name', 'id', 'type');
                    }]);
                }, 'User'])->find($paymentLog->pay_id);
                $type = 0;
                foreach ($GoodIndent->goodsList as $indentCommodity) {
                    $type = $indentCommodity->Good->type;
                }
                $redis = new RedisService();
                $redis->setex('goodIndent.pay.type.' . $GoodIndent->id, 5, $paymentLog->platform_show);
                if ($type === Good::GOOD_TYPE_KEYS || $type === Good::GOOD_TYPE_DOWNLOAD) {
                    // 卡密和下载商品直接完成
                    $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH;
                    $GoodIndent->confirm_time = Carbon::now()->toDateTimeString();
                } else {
                    $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_DELIVER;
                }
                $GoodIndent->pay_time = Carbon::now()->toDateTimeString();
                $GoodIndent->save();
            }
        }
    }
}
