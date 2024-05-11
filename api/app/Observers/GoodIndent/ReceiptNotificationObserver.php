<?php
/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Observers\GoodIndent;

use App\Models\v1\GoodIndent;
use App\Models\v1\User;
use App\Notifications\InvoicePaid;
use Illuminate\Http\Request;

/**
 * receipt
 * 确认收货通知
 * Class ReceiptNotificationObserver
 * @package App\Observers\GoodIndent
 */
class ReceiptNotificationObserver
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
            $parameter = [
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'name' => $goodIndent->goodsList[0]->name . (count($goodIndent->goodsList) > 1 ? __('observer.good_indent.finish_payment_notification.excessive_parts') : ''),    //商品名称
                'created_at' => date("Y-m-d H:i:s", strtotime($goodIndent->created_at)),   // 下单时间
                'shipping_time' => $goodIndent->shipping_time,    //发货时间
                'confirm_time' => $goodIndent->confirm_time,    //确认收货时间
                'template' => 'order_confirm_receipt',   //通知模板标识
                'user_id' => $goodIndent->user_id    //用户ID
            ];
            $name = $goodIndent->is_automatic_receiving == GoodIndent::GOOD_INDENT_IS_AUTOMATIC_RECEIVING_YES ? __('observer.good_indent.receipt_notification_voluntarily') : '';
            $invoice = [
                'type' => InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
                'title' => __('observer.good_indent.receipt_notification.title', ['name'=>$name ]),
                'list' => [
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.identification'),
                        'data' => $parameter['identification']
                    ],
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.name'),
                        'data' => $parameter['name']
                    ],
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.time'),
                        'data' => $parameter['created_at']
                    ],
                    [
                        'keyword' => __('observer.good_indent.receipt_notification.shipping_time'),
                        'data' => $parameter['shipping_time']
                    ],
                    [
                        'keyword' => __('observer.good_indent.receipt_notification.confirm_time'),
                        'data' => $parameter['confirm_time']
                    ]
                ],
                'remark' => __('wechat_channel.order_confirm_receipt.remark'),
                'url' => '/pages/indent/detail?id=' . $parameter['id'],
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
                'title' => __('wechat_channel.admin_order_completion.first'),
                'list' => [
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.identification'),
                        'data' => $parameter['identification']
                    ],
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.name'),
                        'data' => $parameter['name']
                    ],
                    [
                        'keyword' => __('observer.good_indent.receipt_notification.completion_time'),
                        'data' => $parameter['confirm_time']
                    ]
                ],
                'remark' => __('observer.good_indent.receipt_notification.remark', ['name'=>$name]),
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
