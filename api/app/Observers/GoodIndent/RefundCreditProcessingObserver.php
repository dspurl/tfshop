<?php

namespace App\Observers\GoodIndent;

use Illuminate\Http\Request;
use App\Models\v1\GoodIndent;
use App\Models\v1\Integral;
use App\Models\v1\IntegralLog;

/**
 * refund credit processing
 * 退款积分处理
 * Class RefundCreditProcessingObserver
 * @package App\Observers\GoodIndent
 */
class RefundCreditProcessingObserver
{
    protected $request;
    protected $route = [
        // 这里配置需要执行该观察者的路由
        'admin/indent/refund',
    ];
    protected $execute = false;
    public function __construct(Request $request)
    {
        // 是否执行观察者，默认为不执行，只有路由存在于$route时才会触发,并且在非http请求时不会触发
        if (!app()->runningInConsole()) {
            $this->request = $request;
            $path = explode("admin", $request->path());
            if (count($path) == 2) {
                $name = 'admin' . preg_replace("/\/\\d+/", '', $path[1]);
                if (collect($this->route)->contains($name)) {
                    $this->execute = true;
                }
            }
        }
    }
    public function updated(GoodIndent $goodIndent)
    {
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_REFUND) {
            if ($this->request->refund_integral > 0) {
                $IntegralLog = new IntegralLog();
                $IntegralLog->user_id = $goodIndent->user_id;
                $IntegralLog->type = IntegralLog::INTEGRAL_LOG_TYPE_EXPEND;
                $IntegralLog->operation = $this->request->refund_integral;
                $IntegralLog->remark = "订单：$goodIndent->identification 退款扣除" . $this->request->refund_integral . "积分";
                $IntegralLog->integralable_id = $goodIndent->id;
                $IntegralLog->integralable_type = "/api/app/Models/v" . config('dsshop.versions') . "/GoodIndent";
                $IntegralLog->integralable_identification = GoodIndent::GOOD_INDENT_STATE_REFUND;
                $IntegralLog->save();
                Integral::where('user_id', $goodIndent->user_id)->decrement('total', $IntegralLog->operation);
                Integral::where('user_id', $goodIndent->user_id)->decrement('available', $IntegralLog->operation);
            }
        }
    }
}
