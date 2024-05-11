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

use App\common\RedisService;
use App\Models\v1\GoodIndent;
use App\Models\v1\User;
use App\Notifications\InvoicePaid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * finish payment
 * 完成付款通知
 * Class FinishPaymentNotificationObserver
 * @package App\Observers\GoodIndent
 */
class FinishPaymentNotificationObserver
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
        // 当状态为待发货时触发
        if(($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_DELIVER){
            $redis = new RedisService();
            $type = $redis->get('goodIndent.pay.type.' . $goodIndent->id);
            $parameter = [
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'name' => $goodIndent->goodsList[0]->name . (count($goodIndent->goodsList) > 1 ? __('observer.good_indent.finish_payment_notification.excessive_parts') : ''),    //商品名称
                'total' => $goodIndent->total,    //订单金额
                'type' => $type,
                'template' => 'finish_payment',   //通知模板标识
                'time' => $goodIndent->pay_time,  //下单时间(付款时间)
                'user_id' => $goodIndent->user_id    //用户ID
            ];
            $invoice = [
                'type' => InvoicePaid::NOTIFICATION_TYPE_DEAL,
                'title' => __('observer.good_indent.finish_payment_notification.invoice.title'),
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
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.total'),
                        'data' => sprintf("%01.2f", $parameter['total'] / 100),
                    ],
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.type'),
                        'data' => $parameter['type']
                    ],
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.state'),
                        'data' => __('wechat_channel.finish_payment.paid')
                    ],
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.time'),
                        'data' => $parameter['time']
                    ]
                ],
                'price' => $parameter['total'],
                'url' => '/pages/indent/detail?id=' . $parameter['id'],
                'parameter' => $parameter,
                'prefers' => ['database', 'mail', 'wechat']
            ];
            $user = User::find($parameter['user_id']);
            $user->notify(new InvoicePaid($invoice));
            $parameter = [
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'cellphone' => $goodIndent->User->cellphone,    //用户手机
                'total' => $goodIndent->total,    //订单金额
                'type' => $type,
                'template' => 'admin_order_send_good',   //通知模板标识
                'time' => $goodIndent->pay_time,  //下单时间(付款时间)
            ];
            $invoice = [
                'type' => InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
                'title' => __('observer.good_indent.finish_payment_notification.invoice.system_title'),
                'list' => [
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.identification'),
                        'data' => $parameter['identification']
                    ],
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.total'),
                        'data' => sprintf("%01.2f", $parameter['total'] / 100),
                    ],
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.system_cellphone'),
                        'data' => $parameter['cellphone']
                    ],
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.type'),
                        'data' => $parameter['type']
                    ],
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.state'),
                        'data' => __('wechat_channel.finish_payment.paid')
                    ],
                    [
                        'keyword' => __('observer.good_indent.finish_payment_notification.invoice.system_time'),
                        'data' => $parameter['time']
                    ]
                ],
                'remark' => __('observer.good_indent.finish_payment_notification.invoice.system.remark'),
                'price' => $parameter['total'],
                'url' => '/Indent/shipment?id=' . $parameter['id'],
                'admin' => true,
                'parameter' => $parameter,
                'prefers' => ['mail', 'wechat']
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
