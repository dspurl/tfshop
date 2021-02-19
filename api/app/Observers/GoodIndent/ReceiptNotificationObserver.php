<?php

namespace App\Observers\GoodIndent;

use App\Models\v1\GoodIndent;
use App\Models\v1\User;
use App\Notifications\InvoicePaid;

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
        if ($goodIndent->state == GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH) {
            $parameter = [
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'name' => $goodIndent->goodsList[0]->name . (count($goodIndent->goodsList) > 1 ? '等多件' : ''),    //商品名称
                'created_at' => date("Y-m-d H:i:s", strtotime($goodIndent->created_at)),   // 下单时间
                'shipping_time' => $goodIndent->shipping_time,    //发货时间
                'confirm_time' => $goodIndent->confirm_time,    //确认收货时间
                'template' => 'order_confirm_receipt',   //通知模板标识
                'user_id' => $goodIndent->user_id    //用户ID
            ];
            $invoice = [
                'type' => InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
                'title' => '亲：您在我们商城买的宝贝已经确认收货。',
                'list' => [
                    [
                        'keyword' => '订单编号',
                        'data' => $parameter['identification']
                    ],
                    [
                        'keyword' => '商品名称',
                        'data' => $parameter['name']
                    ],
                    [
                        'keyword' => '下单时间',
                        'data' => $parameter['created_at']
                    ],
                    [
                        'keyword' => '发货时间',
                        'data' => $parameter['shipping_time']
                    ],
                    [
                        'keyword' => '确认收货时间',
                        'data' => $parameter['confirm_time']
                    ]
                ],
                'remark' => '感谢您的支持与厚爱。',
                'url' => '/pages/order/showOrder?id=' . $parameter['id'],
                'parameter' => $parameter,
                'prefers' => ['database', 'wechat', 'mail']
            ];
            $user = User::find($parameter['user_id']);
            $user->notify(new InvoicePaid($invoice));

            $parameter = [
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'name' => $goodIndent->goodsList[0]->name . (count($goodIndent->goodsList) > 1 ? '等多件' : ''),    //商品名称
                'confirm_time' => $goodIndent->confirm_time,    //确认收货时间
                'template' => 'admin_order_completion',   //通知模板标识
            ];
            $invoice = [
                'type' => InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
                'title' => '订单完成通知',
                'list' => [
                    [
                        'keyword' => '订单编号',
                        'data' => $parameter['identification']
                    ],
                    [
                        'keyword' => '商品名称',
                        'data' => $parameter['name']
                    ],
                    [
                        'keyword' => '完成时间',
                        'data' => $parameter['confirm_time']
                    ]
                ],
                'remark' => '客户已确认收货，订单已完成',
                'url' => '/Indent/shipment?id=' . $parameter['id'],
                'parameter' => $parameter,
                'admin' => true,
                'prefers' => ['wechat', 'mail']
            ];
            if (config('notification.account')) {
                $account = explode(',', config('notification.account'));
                foreach ($account as $uid) {
                    $user = User::find($uid);
                    if ($user) {
                        $invoice['parameter']['user_id'] = $uid;
                        $user->notify(new InvoicePaid($invoice)); // 发送通知
                    }
                }
            }
        }
    }
}
