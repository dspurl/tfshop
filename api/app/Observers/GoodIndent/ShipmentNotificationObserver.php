<?php

namespace App\Observers\GoodIndent;

use App\common\RedisService;
use App\Models\v1\Dhl;
use App\Models\v1\GoodIndent;
use App\Notifications\Common;
use Illuminate\Http\Request;

/**
 * finish payment
 * 发货通知
 * Class ShipmentNotificationObserver
 * @package App\Observers\GoodIndent
 */
class ShipmentNotificationObserver
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function updated(GoodIndent $goodIndent)
    {
        // 当状态为待收货时触发
        if ($goodIndent->state == GoodIndent::GOOD_INDENT_STATE_TAKE) {
            $Dhl = Dhl::find($this->request->dhl_id);
            (new Common)->deliveryRelease([
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'dhl' => $Dhl->name,  //快递公司
                'odd' => $this->request->odd,   // 快递单号
                'total' => $goodIndent->total,    //订单金额
                'shipping_time' => $goodIndent->shipping_time,    //发货时间
                'location' => $goodIndent->GoodLocation,    //收货地址
                'template' => 'delivery_release',   //通知模板标识
                'user_id' => $goodIndent->User->id    //用户ID
            ]);
        }
    }
}
