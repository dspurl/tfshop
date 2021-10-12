<?php


namespace App\Observers\PaymentLog;


use App\Code;
use App\Models\v1\Good;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodSku;
use App\Models\v1\MiniProgram;
use App\Models\v1\PaymentLog;
use Illuminate\Http\Request;

/**
 * good indent payment create
 * 商品订单支付生成
 * Class GoodIndentPaymentCreateObserver
 * @package App\Observers\GoodIndent
 */
class GoodIndentPaymentCreateObserver
{
    protected $request;
    protected $route = [
        'app/unifiedPayment'
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

    public function creating(PaymentLog $paymentLog)
    {
        if (($this->execute || app()->runningInConsole())) {
            if ($this->request->type == PaymentLog::PAYMENT_LOG_TYPE_GOODS_INDENT && $paymentLog->state == PaymentLog::PAYMENT_LOG_STATE_CREATE) {
                $GoodIndent = GoodIndent::with(['goodsList'])->find($this->request->id);
                //库存判断
                foreach ($GoodIndent->goodsList as $indentCommodity) {
                    $Good = Good::select('id', 'is_inventory', 'inventory')->find($indentCommodity['good_id']);
                    if ($Good && $Good->is_inventory == Good::GOOD_IS_INVENTORY_FILM) { //付款减库存
                        if (!$indentCommodity['good_sku_id']) { //非SKU商品
                            if ($Good->inventory - $indentCommodity['number'] < 0) {
                                throw new \Exception('存在库存不足的商品，请重新购买', Code::CODE_WRONG);
                            }
                            $Good->inventory = $Good->inventory - $indentCommodity['number'];
                            $Good->save();
                        } else {
                            $GoodSku = GoodSku::find($indentCommodity['good_sku_id']);
                            if ($GoodSku->inventory - $indentCommodity['number'] < 0) {
                                throw new \Exception('存在库存不足的SKU商品，请重新购买', Code::CODE_WRONG);
                            }
                            $GoodSku->inventory = $GoodSku->inventory - $indentCommodity['number'];
                            $GoodSku->save();
                        }
                    }
                }
                $fee = $GoodIndent->total;
                $openid = $this->request->header('openid');
                $body = '对订单：' . $GoodIndent->identification . '的付款';
                $payment = (new MiniProgram())->payment($this->request->platform, $body, $fee, $openid, $this->request->trade_type);
                $paymentLog->user_id = auth('web')->user()->id;
                $paymentLog->number = $payment['number'];
                $paymentLog->money = $fee;
                $paymentLog->name = $body;
                $paymentLog->type = 'goodsIndent';
                $paymentLog->pay_type = 'App\Models\v1\GoodIndent';
                $paymentLog->pay_id = $this->request->id;
                $paymentLog->data = json_encode($payment);
            }
        }
    }
}
