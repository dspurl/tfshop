<?php

namespace App\Observers\GoodIndent;

use App\Models\v1\IntegralDrawLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\v1\GoodIndent;

/**
 * Winning order processing
 * 中奖订单处理
 * Class WinningOrderProcessingObserver
 * @package App\Observers\GoodIndent
 */
class WinningOrderProcessingObserver
{
    protected $request;
    protected $route = [
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
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_PAY && $this->request->integral_draw_log_id) {
            $goodIndent->total = 0;
            $goodIndent->state = GoodIndent::GOOD_INDENT_STATE_DELIVER;
            $goodIndent->pay_time = Carbon::now()->toDateTimeString();
            $goodIndent->save();
            $IntegralDrawLog = IntegralDrawLog::find($this->request->integral_draw_log_id);
            $IntegralDrawLog->state = IntegralDrawLog::INTEGRAL_DRAW_LOG_PROCESSED;
            $IntegralDrawLog->model_id = $goodIndent->id;
            $IntegralDrawLog->model_type = 'App\Models\v1\GoodIndent';
            $IntegralDrawLog->save();
        }
    }
}
