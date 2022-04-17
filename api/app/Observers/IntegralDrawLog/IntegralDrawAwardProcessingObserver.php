<?php

namespace App\Observers\IntegralDrawLog;

use App\Models\v1\Integral;
use App\Models\v1\IntegralLog;
use App\Models\v1\IntegralPrize;
use Illuminate\Http\Request;
use App\Models\v1\IntegralDrawLog;

/**
 * Integral draw award processing
 * 积分抽奖奖励发放处理
 * Class IntegralDrawAwardProcessingObserver
 * @package App\Observers\IntegralDrawLog
 */
class IntegralDrawAwardProcessingObserver
{
    protected $request;
    protected $route = [
        // 这里配置需要执行该观察者的路由
        'app/integralWinning',
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

    public function created(IntegralDrawLog $integralDrawLog)
    {
        if (($this->execute || app()->runningInConsole())) {
            if($integralDrawLog->integral_prize_id > 0){
                $IntegralPrize = IntegralPrize::find($integralDrawLog->integral_prize_id);
                switch ($IntegralPrize->model_type) {
                    case 'App\Models\v1\IntegralConfiguration':
                        // 积分
                        $IntegralLog = new IntegralLog();
                        $IntegralLog->user_id = auth('web')->user()->id;
                        $IntegralLog->type = IntegralLog::INTEGRAL_LOG_TYPE_INCOME;
                        $IntegralLog->operation = $IntegralPrize->value;
                        $IntegralLog->remark = "获得 $IntegralPrize->name 奖励";
                        $IntegralLog->integralable_id = $IntegralPrize->id;
                        $IntegralLog->integralable_type = "/api/app/Models/v1/IntegralPrize";
                        $IntegralLog->integralable_identification = 0;
                        $IntegralLog->save();
                        Integral::where('user_id', $IntegralLog->user_id)->increment('available', $IntegralLog->operation);
                        Integral::where('user_id', $IntegralLog->user_id)->increment('total', $IntegralLog->operation);
                        $integralDrawLog->state = IntegralDrawLog::INTEGRAL_DRAW_LOG_PROCESSED;
                        break;
                }
                $integralDrawLog->save();
            }
        }
    }
}
