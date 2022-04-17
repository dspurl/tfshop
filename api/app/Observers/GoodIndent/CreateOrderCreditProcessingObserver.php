<?php

namespace App\Observers\GoodIndent;

use App\Code;
use Illuminate\Http\Request;
use App\Models\v1\GoodIndent;
use App\Models\v1\Integral;
use App\Models\v1\IntegralLog;
use App\Models\v1\IntegralCommodity;

/**
 * create order credit processing
 * 创建订单积分处理
 * Class CreateOrderCreditProcessingObserver
 * @package App\Observers\GoodIndent
 */
class CreateOrderCreditProcessingObserver
{
    protected $request;
    protected $route = [
        // 这里配置需要执行该观察者的路由
        'app/goodIndent',
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
    public function created(GoodIndent $goodIndent)
    {
        // 当状态为待付款时触发
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_PAY) {
            $Integral = Integral::select('available')->where('user_id', auth('web')->user()->id)->first();
            // 验证使用的积分是否大于用户可用积分
            if ($this->request->integral > $Integral->available) {
                throw new \Exception('非法操作-使用扣分大于用户可用积分', Code::CODE_WRONG);
            }
            $list = [];
            foreach ($this->request->indentCommodity as $indentCommodity) {
                $list[] = [
                    'ids' => $indentCommodity['good_id'],
                    'price' => $indentCommodity['price'],
                ];
            }
            $IntegralCommodity = IntegralCommodity::whereIn('good_id', collect($list)->pluck('ids'))->get();
            $deductible = 0;
            if ($IntegralCommodity) {
                foreach ($IntegralCommodity as $i) {
                    $data = collect($list)->firstWhere('ids', $i->good_id);
                    if ($i->type === IntegralCommodity::INTEGRAL_MALL_TYPE_FIXED) {
                        $deductible += $i->value;
                    } else {
                        $deductible += $data['price'] * $i->value / 100;
                    }
                }
            }
            $deductible = $deductible / config('integral.parities');
            if ($this->request->integral > $deductible) {
                throw new \Exception('非法操作-使用扣分大于订单可抵扣积分', Code::CODE_WRONG);
            }
            $integralPrice = $this->request->integral * config('integral.parities');
            $total = $goodIndent->total - $integralPrice * 100;
            $goodIndent->total = $total / 100;
            $goodIndent->save();
            $IntegralLog = new IntegralLog();
            $IntegralLog->user_id = $goodIndent->user_id;
            $IntegralLog->type = IntegralLog::INTEGRAL_LOG_TYPE_EXPEND;
            $IntegralLog->operation = $this->request->integral;
            $IntegralLog->remark = "订单：$goodIndent->identification 积分抵扣" . $integralPrice . "元";
            $IntegralLog->integralable_id = $goodIndent->id;
            $IntegralLog->integralable_type = "/api/app/Models/v" . config('dsshop.versions') . "/GoodIndent";
            $IntegralLog->integralable_identification = GoodIndent::GOOD_INDENT_STATE_PAY;
            $IntegralLog->save();
            Integral::where('user_id', $goodIndent->user_id)->decrement('total', $IntegralLog->operation);
            Integral::where('user_id', $goodIndent->user_id)->decrement('available', $IntegralLog->operation);
        }
    }
}
