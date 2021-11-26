<?php


namespace App\Observers\GoodIndent;


use App\Models\v1\GoodIndent;
use App\Models\v1\GoodIndentCommodity;
use Illuminate\Http\Request;

/**
 * create indent commodity
 * 创建订单商品
 * Class CreateIndentCommodityObserver
 * @package App\Observers\GoodIndent
 */
class CreateIndentCommodityObserver
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
        // 当状态为待付款时触发
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_PAY) {
            foreach ($this->request->indentCommodity as $id => $indentCommodity) {
                $GoodIndentCommodity = new GoodIndentCommodity();
                $GoodIndentCommodity->good_indent_id = $goodIndent->id;
                $GoodIndentCommodity->good_id = $indentCommodity['good_id'];
                $GoodIndentCommodity->good_sku_id = $indentCommodity['good_sku_id'];
                $GoodIndentCommodity->img = $indentCommodity['img'];
                $GoodIndentCommodity->name = $indentCommodity['name'];
                $GoodIndentCommodity->price = $indentCommodity['price'];
                $GoodIndentCommodity->number = $indentCommodity['number'];
                $GoodIndentCommodity->save();
            }
        }
    }
}
