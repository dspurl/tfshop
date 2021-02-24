<?php


namespace App\Observers\GoodIndent;


use App\Models\v1\Good;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodSku;
use Illuminate\Http\Request;

/**
 * indent failure stock processing
 * 订单失效库存操作
 * Class IndentFailureStockProcessingObserver
 * @package App\Observers\GoodIndent
 */
class IndentFailureStockProcessingObserver
{
    protected $request;
    protected $route = [];
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

    public function updated(GoodIndent $goodIndent)
    {
        // 当状态为失效时触发
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_FAILURE) {
            foreach ($goodIndent->goodsList as $indentCommodity) {
                $Good = Good::select('id', 'is_inventory', 'inventory')->find($indentCommodity['good_id']);
                if ($Good && $Good->is_inventory == Good::GOOD_IS_INVENTORY_NO) { //拍下减库存
                    if (!$indentCommodity['good_sku_id']) { //非SKU商品
                        $Good->inventory = $Good->inventory + $indentCommodity['number'];
                        $Good->save();
                    } else {
                        $GoodSku = GoodSku::find($indentCommodity['good_sku_id']);
                        $GoodSku->inventory = $GoodSku->inventory + $indentCommodity['number'];
                        $GoodSku->save();
                    }
                }
            }
        }
    }
}
