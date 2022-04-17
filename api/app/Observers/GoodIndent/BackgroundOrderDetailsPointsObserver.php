<?php
namespace App\Observers\GoodIndent;
use Illuminate\Http\Request;
use App\Models\v1\GoodIndent;
use App\Models\v1\IntegralLog;

/**
 * Background order details points
 * 后台订单详情积分
 * Class BackgroundOrderDetailsPointsObserver
 * @package App\Observers\GoodIndent
 */
class BackgroundOrderDetailsPointsObserver
{
    protected $request;
    protected $route = [
        // 这里配置需要执行该观察者的路由
        'admin/indent',
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
    public function retrieved(GoodIndent $goodIndent)
    {
        if (($this->execute || app()->runningInConsole())) {
            $IntegralLog = IntegralLog::where("integralable_id", $goodIndent->id)->where('type', IntegralLog::INTEGRAL_LOG_TYPE_EXPEND)->where('integralable_identification', GoodIndent::GOOD_INDENT_STATE_PAY)->where("integralable_type", "/api/app/Models/v" . config('dsshop.versions') . "/GoodIndent")->first();
            if ($IntegralLog) {
                $goodIndent->integralDeduction = $IntegralLog->operation;
                $goodIndent->integralPrice = $IntegralLog->operation * config('integral.parities');
            }
        }
    }
}
