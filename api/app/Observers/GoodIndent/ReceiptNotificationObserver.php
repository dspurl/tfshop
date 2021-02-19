<?php

namespace App\Observers\GoodIndent;

use App\Models\v1\GoodIndent;
use App\Notifications\Common;

/**
 * receipt
 * 确认收货通知
 * Class ReceiptNotificationObserver
 * @package App\Observers\GoodIndent
 */
class ReceiptNotificationObserver
{
    public function updated(GoodIndent $goodIndent)
    {
        // 当状态为已完成时触发
        if($goodIndent->state == GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH){
            (new Common)->orderConfirmReceipt([
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'name' => $goodIndent->goodsList[0]->name . (count($goodIndent->goodsList) > 1 ? '等多件' : ''),    //商品名称
                'created_at' => date("Y-m-d H:i:s", strtotime($goodIndent->created_at)),   // 下单时间
                'shipping_time' => $goodIndent->shipping_time,    //发货时间
                'confirm_time' => $goodIndent->confirm_time,    //确认收货时间
                'template' => 'order_confirm_receipt',   //通知模板标识
                'user_id' => $goodIndent->user_id    //用户ID
            ]);
            (new Common)->adminOrderCompletion([
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'name' => $goodIndent->goodsList[0]->name . (count($goodIndent->goodsList) > 1 ? '等多件' : ''),    //商品名称
                'confirm_time' => $goodIndent->confirm_time,    //确认收货时间
                'template' => 'admin_order_completion',   //通知模板标识
            ]);
        }
    }
}
