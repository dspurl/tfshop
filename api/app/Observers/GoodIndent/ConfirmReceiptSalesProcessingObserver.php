<?php

namespace App\Observers\GoodIndent;

use App\Models\v1\Good;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodIndentCommodity;
use Illuminate\Http\Request;

/**
 * receipt
 * 确认收货销售处理
 * Class ReceiptNotificationObserver
 * @package App\Observers\GoodIndent
 */
class ConfirmReceiptSalesProcessingObserver
{
    protected $request;
    protected $route = [
        'app/goodIndent/receipt',
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

    public function updated(GoodIndent $goodIndent)
    {
        // 当状态为已完成时触发
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH) {
            $GoodIndentCommodity = GoodIndentCommodity::where('good_indent_id', $goodIndent->id)->get();
            foreach ($GoodIndentCommodity as $g) {
                // 销售处理
                Good::where('id', $g->good_id)->increment('sales');
            }
        }
    }
}
