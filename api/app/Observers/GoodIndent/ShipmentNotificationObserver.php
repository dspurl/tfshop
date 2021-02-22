<?php

namespace App\Observers\GoodIndent;

use App\Models\v1\Dhl;
use App\Models\v1\GoodIndent;
use App\Models\v1\User;
use App\Notifications\InvoicePaid;

/**
 * finish payment
 * 发货通知
 * Class ShipmentNotificationObserver
 * @package App\Observers\GoodIndent
 */
class ShipmentNotificationObserver
{
    public function updated(GoodIndent $goodIndent)
    {
        // 当状态为待收货时触发
        if ($goodIndent->state == GoodIndent::GOOD_INDENT_STATE_TAKE) {
            $Dhl = Dhl::find($goodIndent->dhl_id);
            $parameter = [
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'dhl' => $Dhl->name,  //快递公司
                'odd' => $goodIndent->odd,   // 快递单号
                'total' => $goodIndent->total,    //订单金额
                'shipping_time' => $goodIndent->shipping_time,    //发货时间
                'location' => $goodIndent->GoodLocation,    //收货地址
                'template' => 'delivery_release',   //通知模板标识
                'user_id' => $goodIndent->User->id    //用户ID
            ];
            $invoice = [
                'type' => InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
                'title' => '您购买的商品已发货，请到订单详情查看',
                'list' => [
                    [
                        'keyword' => '订单编号',
                        'data' => $parameter['identification']
                    ],
                    [
                        'keyword' => '发货时间',
                        'data' => $parameter['shipping_time']
                    ],
                    [
                        'keyword' => '物流公司',
                        'data' => $parameter['dhl']
                    ],
                    [
                        'keyword' => '快递单号',
                        'data' => $parameter['odd']
                    ],
                    [
                        'keyword' => '收件信息',
                        'data' => $parameter['location']->name . ' ' . $parameter['location']->cellphone . ' ' . $parameter['location']->location . $parameter['location']->house
                    ],
                ],
                'remark' => '请保持收件手机畅通！',
                'url' => '/pages/order/showOrder?id=' . $parameter['id'],
                'parameter' => $parameter,
                'prefers' => ['database', 'miniweixin', 'mail', 'wechat']
            ];
            $user = User::find($parameter['user_id']);
            $user->notify(new InvoicePaid($invoice));
        }
    }
}
