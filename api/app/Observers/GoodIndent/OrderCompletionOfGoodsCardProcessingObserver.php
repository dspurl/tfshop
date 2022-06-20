<?php

namespace App\Observers\GoodIndent;

use App\Code;
use App\Models\v1\Good;
use App\Models\v1\GoodCode;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodIndentGoodCode;
use App\Models\v1\GoodSku;
use Illuminate\Http\Request;

/**
 * receipt
 * 订单完成商品卡密处理
 * Class OrderCompletionOfGoodsCardProcessingObserver
 * @package App\Observers\GoodIndent
 */
class OrderCompletionOfGoodsCardProcessingObserver
{
    protected $request;
    protected $route = [
        'app/paymentNotify',
        'app/balancePay'
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

    public function updated(GoodIndent $goodIndent)
    {
        // 当状态为已完成时触发
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH) {
            $GoodIndent = GoodIndent::with(['goodsList' => function ($q) {
                $q->with(['good' => function ($q) {
                    $q->select('name', 'id', 'type');
                }, 'goodSku']);
            }])->find($goodIndent->id);
            foreach ($GoodIndent->goodsList as $indentCommodity) {
                if ($indentCommodity->good->type === Good::GOOD_TYPE_KEYS) {
                    // 卡密才处理
                    if ($indentCommodity->goodSku->is_fixed === GoodSku::GOOD_SKU_IS_FIXED_YES) {
                        // 固定卡密
                        $GoodCode = GoodCode::where('good_sku_id', $indentCommodity->goodSku->id)->first();
                        $GoodIndentGoodCode = new GoodIndentGoodCode();
                        $GoodIndentGoodCode->good_indent_id = $GoodIndent->id;
                        $GoodIndentGoodCode->good_code_id = $GoodCode->id;
                        $GoodIndentGoodCode->save();
                    } else {
                        // 唯一卡密
                        $GoodCode = GoodCode::where('good_sku_id', $indentCommodity->goodSku->id)->where('state', GoodCode::GOOD_CODE_STATE_NO)->limit($indentCommodity->number)->get();
                        if ($GoodCode->count() != $indentCommodity->number) {
                            throw new \Exception('卡密不足', Code::CODE_WRONG);
                        }
                        foreach ($GoodCode as $g) {
                            // 设置为已兑换
                            GoodCode::where('id', $g->id)->update(['state' => GoodCode::GOOD_CODE_STATE_YES]);
                            $GoodIndentGoodCode = new GoodIndentGoodCode();
                            $GoodIndentGoodCode->good_indent_id = $GoodIndent->id;
                            $GoodIndentGoodCode->good_code_id = $g->id;
                            $GoodIndentGoodCode->save();
                        }
                    }
                }
            }

        }
    }
}
