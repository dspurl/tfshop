<?php

namespace App\Observers\GoodIndent;

use Illuminate\Http\Request;
use App\Models\v1\GoodIndent;
use App\Models\v1\Integral;
use App\Models\v1\IntegralConfiguration;
use App\Models\v1\IntegralLog;

/**
 * shop integral
 * 确认收货后获得一定比例积分
 * Class ShopIntegralObserver
 * @package App\Observers\GoodIndent
 */
class ShopIntegralObserver
{
    protected $request;
    protected $route = [
        // 这里配置需要执行该观察者的路由
        'app/goodIndent/receipt',
    ];
    protected $execute = false;
    public function __construct(Request $request)
    {
        // 是否执行观察者，默认为不执行，只有路由存在于$route时才会触发,并且在非http请求时不会触发
        if (!app()->runningInConsole()) {
            $this->request = $request;
            $path = explode("admin", $request->path());
            $path = explode("app", $request->path());
            if (count($path) == 2) {
                $name = 'app' . preg_replace("/\/\\d+/", '', $path[1]);
                if (collect($this->route)->contains($name)) {
                    $this->execute = true;
                }
            }
        }
    }
    public function updated(GoodIndent $goodIndent)
    {
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH) {
            $IntegralConfiguration = IntegralConfiguration::where('system', 'sys_shop')->where('is_hidden', IntegralConfiguration::INTEGRAL_CONFIGURATION_IS_HIDDEN_NO)->first();
            if ($IntegralConfiguration) {
                $operation = round($IntegralConfiguration->value / 100 * (($goodIndent->total - $goodIndent->carriage) / 100));
                $IntegralLog = new IntegralLog();
                $IntegralLog->user_id = $goodIndent->user_id;
                $IntegralLog->type = IntegralLog::INTEGRAL_LOG_TYPE_INCOME;
                $IntegralLog->operation = $operation;
                $IntegralLog->remark = "订单：$goodIndent->identification 购物返 $IntegralLog->operation 积分";
                $IntegralLog->integralable_id = $goodIndent->id;
                $IntegralLog->integralable_type = "/api/app/Models/v" . config('dsshop.versions') . "/GoodIndent";
                $IntegralLog->integralable_identification = GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH;
                $IntegralLog->save();
                Integral::where('user_id', $goodIndent->user_id)->increment('total', $IntegralLog->operation);
                Integral::where('user_id', $goodIndent->user_id)->increment('available', $IntegralLog->operation);
            }
        }
    }
}
