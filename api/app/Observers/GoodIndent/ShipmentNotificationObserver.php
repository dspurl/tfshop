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

use App\Models\v1\Dhl;
use App\Models\v1\GoodIndent;
use App\Models\v1\User;
use App\Notifications\InvoicePaid;
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
    protected $route = [
        'admin/indent/shipment'
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
        // 当状态为待收货时触发
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_TAKE) {
            $Dhl = Dhl::find($goodIndent->dhl_id);
            $parameter = [
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'dhl' => $Dhl ? $Dhl->name : __('common.nothing'),  //快递公司
                'odd' => $goodIndent->odd,   // 快递单号
                'total' => $goodIndent->total,    //订单金额
                'shipping_time' => $goodIndent->shipping_time,    //发货时间
                'location' => $goodIndent->GoodLocation,    //收货地址
                'template' => 'delivery_release',   //通知模板标识
                'user_id' => $goodIndent->User->id    //用户ID
            ];
            $invoice = [
                'type' => InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
                'title' => __('observer.good_indent.shipment_notification.invoice.title'),
                'list' => [
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.identification'),
                        'data' => $parameter['identification']
                    ],
                    [
                        'keyword' => __('observer.good_indent.receipt_notification.shipping_time'),
                        'data' => $parameter['shipping_time']
                    ],
                    [
                        'keyword' => __('observer.good_indent.shipment_notification.invoice.dhl'),
                        'data' => $parameter['dhl']
                    ],
                    [
                        'keyword' => __('observer.good_indent.shipment_notification.invoice.odd'),
                        'data' => $parameter['odd']
                    ],
                    [
                        'keyword' => __('observer.good_indent.shipment_notification.invoice.location'),
                        'data' => $parameter['location'] ? $parameter['location']->name . ' ' . $parameter['location']->cellphone . ' ' . $parameter['location']->location . $parameter['location']->house : __('common.nothing')
                    ],
                ],
                'remark' => __('observer.good_indent.shipment_notification.invoice.remark'),
                'url' => '/pages/indent/detail?id=' . $parameter['id'],
                'parameter' => $parameter,
                'prefers' => ['database', 'miniweixin', 'mail', 'wechat']
            ];
            $user = User::find($parameter['user_id']);
            $user->notify(new InvoicePaid($invoice));
        }
    }
}
