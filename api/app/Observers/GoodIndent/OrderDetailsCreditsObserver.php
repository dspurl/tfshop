<?php

namespace App\Observers\GoodIndent;

use Illuminate\Http\Request;
use App\Models\v1\GoodIndent;
use App\Models\v1\IntegralLog;

/**
 * Order Details Credits
 * 订单详情积分
 * Class OrderDetailsCreditsObserver
 * @package App\Observers\GoodIndent
 */
class OrderDetailsCreditsObserver
{
    protected $request;
    protected $route = [
        // 这里配置需要执行该观察者的路由
        'app/goodIndent/detail',
    ];
    protected $execute = false;
    public function __construct(Request $request)
    {
        if (!app()->runningInConsole()) {
            $this->request = $request;
            $path = explode("app", $request->path());
            if (count($path) == 2) {
                $name = 'app' . preg_replace("/\/\\d+/", '', $path[1]);
                if (collect($this->route)->contains($name)) {
                    $this->execute = true;
                }
            }
        }
    }
    public function retrieved(GoodIndent $goodIndent)
    {
        if (($this->execute || app()->runningInConsole())) {
            $IntegralLog = IntegralLog::where("integralable_id", $goodIndent->id)->where('type', IntegralLog::INTEGRAL_LOG_TYPE_EXPEND)->where('integralable_identification', GoodIndent::GOOD_INDENT_STATE_PAY)->where("integralable_type", "/api/app/Models/v" . config('dsshop.versions') . "/GoodIndent")->first();
            if ($IntegralLog) {
                $goodIndent->integralPrice = $IntegralLog->operation * config('integral.parities');
            }
        }
    }
}
