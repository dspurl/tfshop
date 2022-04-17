<?php

namespace App\Observers\GoodIndent;

use App\Models\v1\IntegralDrawLog;
use Illuminate\Http\Request;
use App\Models\v1\GoodIndent;

/**
 * Order increases winning information
 * 订单增加中奖信息
 * Class OrderIncreasesWinningInformationObserver
 * @package App\Observers\GoodIndent
 */
class OrderIncreasesWinningInformationObserver
{
    protected $request;
    protected $route = [
        'app/goodIndent/detail',
        'admin/indent'
    ];
    protected $execute = false;

    public function __construct(Request $request)
    {
        if (!app()->runningInConsole()) {
            $this->request = $request;
            $path = explode("admin", $request->path());
            if (count($path) == 2) {
                $name = 'admin' . preg_replace("/\/\\d+/", '', $path[1]);
            } else {
                $path = explode("app", $request->path());
                $name = 'app' . preg_replace("/\/\\d+/", '', $path[1]);
            }
            if (collect($this->route)->contains($name)) {
                $this->execute = true;
            }
        }
    }

    public function retrieved(GoodIndent $goodIndent)
    {
        if (($this->execute || app()->runningInConsole())) {
            $goodIndent->integral_draw_log = IntegralDrawLog::where('model_id', $goodIndent->id)->where('model_type', 'App\Models\v1\GoodIndent')
                ->with(['IntegralDraw', 'IntegralPrize'])
                ->first();
        }
    }
}
