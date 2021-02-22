<?php

namespace App\Observers\GoodIndent;

use App\common\RedisService;
use App\Models\v1\GoodIndent;
use App\Models\v1\User;
use App\Notifications\InvoicePaid;

/**
 * finish payment
 * 完成付款通知
 * Class FinishPaymentNotificationObserver
 * @package App\Observers\GoodIndent
 */
class FinishPaymentNotificationObserver
{
    public function updated(GoodIndent $goodIndent)
    {
        // 当状态为待发货时触发
        if($goodIndent->state == GoodIndent::GOOD_INDENT_STATE_DELIVER){
            $redis = new RedisService();
            $type = $redis->get('goodIndent.pay.type.' . $goodIndent->id);
            $parameter = [
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'name' => $goodIndent->goodsList[0]->name . (count($goodIndent->goodsList) > 1 ? '等多件' : ''),    //商品名称
                'total' => $goodIndent->total,    //订单金额
                'type' => $type,
                'template' => 'finish_payment',   //通知模板标识
                'time' => $goodIndent->pay_time,  //下单时间(付款时间)
                'user_id' => $goodIndent->user_id    //用户ID
            ];
            $invoice = [
                'type' => InvoicePaid::NOTIFICATION_TYPE_DEAL,
                'title' => '恭喜您！购买的商品已支付成功，我们会尽快安排发货哦！么么哒！~~',
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
                        'keyword' => '订单总额',
                        'data' => sprintf("%01.2f", $parameter['total'] / 100),
                    ],
                    [
                        'keyword' => '支付方式',
                        'data' => $parameter['type']
                    ],
                    [
                        'keyword' => '订单状态',
                        'data' => '已支付'
                    ],
                    [
                        'keyword' => '下单时间',
                        'data' => $parameter['time']
                    ]
                ],
                'price' => $parameter['total'],
                'url' => '/pages/order/showOrder?id=' . $parameter['id'],
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
                'title' => '您有一个新的待发货订单',
                'list' => [
                    [
                        'keyword' => '订单编号',
                        'data' => $parameter['identification']
                    ],
                    [
                        'keyword' => '订单总额',
                        'data' => sprintf("%01.2f", $parameter['total'] / 100),
                    ],
                    [
                        'keyword' => '买家',
                        'data' => $parameter['cellphone']
                    ],
                    [
                        'keyword' => '支付方式',
                        'data' => $parameter['type']
                    ],
                    [
                        'keyword' => '订单状态',
                        'data' => '已支付'
                    ],
                    [
                        'keyword' => '付款时间',
                        'data' => $parameter['time']
                    ]
                ],
                'remark' => '客户已付款，尽快发货吧',
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
