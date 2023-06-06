<?php
/** +----------------------------------------------------------------------
 * | 微信公众号模板消息
 * +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Channels;
use App\Models\v1\NotificationLog;
use Carbon\Carbon;
use EasyWeChat\Factory;
use Illuminate\Notifications\Notification;
class WechatChannel
{
    private $config;
    private $app;
    private $information;
    private $miniweixin;
    public function __construct()
    {
        // 当配置过了微信小程序，通知一律跳转到小程序，否则跳H5
        $this->miniweixin = config('wechat.mini_program.default.app_id') ?? false;
        $this->config = config('wechat.official_account.default');
        $this->app = Factory::officialAccount($this->config);
        $this->information = config('notification.wechat');
    }
    /**
     * 发送指定的通知.
     *
     * @param mixed $notifiable
     * @param \Illuminate\Notifications\Notification $notification
     * @return void
     */
    public function send($notifiable, Notification $notification)
    {
        $message = $notification->invoice['parameter'];
        //配置了微信公众平台、wechat存在值、配置过模板ID
        if ($this->config['app_id'] && $notifiable->wechat) {
            if ($this->information[$message['template']]) {
                $identification = convertUnderline($message['template']);
                $this->$identification($notifiable, $message);
            }
        }
    }
    /**
     *  发货通知
     * @param $notifiable
     * @param $message
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    protected function deliveryRelease($notifiable, $message)
    {
        $data = [
            'template_id' => $this->information[$message['template']],
            'touser' => $notifiable->wechat,
            'data' => [
                'first' => __('wechat_channel.delivery_release.first'),
                'keyword1' => $message['identification'],
                'keyword2' => $message['shipping_time'],
                'keyword3' => $message['dhl'],
                'keyword4' => $message['odd'],
                'keyword5' => $message['location']->name . ' ' . $message['location']->cellphone . ' ' . $message['location']->location . $message['location']->house,
                'remark' => __('wechat_channel.delivery_release.remark'),
            ],
        ];
        if ($this->miniweixin) {
            $data['miniprogram'] = [
                'appid' => $this->miniweixin,
                'pagepath' => 'pages/indent/detail?id=' . $message['id'],
            ];
        } else {
            $data['url'] = request()->root() . '/h5/#' . 'pages/indent/detail?id=' . $message['id'];
        }
        //发送记录
        $send = $this->app->template_message->send($data);
        $NotificationLog = new NotificationLog();
        $NotificationLog->user_id = $message['user_id'];
        $NotificationLog->type = NotificationLog::NOTIFICATION_LOG_TYPE_MINIWEIXIN;
        $NotificationLog->msg = json_encode($data);
        $NotificationLog->feedback = json_encode($send);
        $NotificationLog->state = $send['errcode'] == 0 ? NotificationLog::NOTIFICATION_LOG_STATE_OK : NotificationLog::NOTIFICATION_LOG_STATE_ERROR;
        $NotificationLog->save();
    }
    /**
     *  订单支付成功
     * @param $notifiable
     * @param $message
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    protected function finishPayment($notifiable, $message)
    {
        $data = [
            'template_id' => $this->information[$message['template']],
            'touser' => $notifiable->wechat,
            'data' => [
                'first' => __('wechat_channel.finish_payment.first'),
                'keyword1' => $message['identification'],
                'keyword2' => $message['name'],
                'keyword3' => sprintf("%01.2f", $message['total'] / 100),
                'keyword4' => __('wechat_channel.finish_payment.paid'),
                'keyword5' => $message['time'],
                'remark' => __('wechat_channel.finish_payment.remark'),
            ],
        ];
        if ($this->miniweixin) {
            $data['miniprogram'] = [
                'appid' => $this->miniweixin,
                'pagepath' => '/pages/indent/detail?id=' . $message['id'],
            ];
        } else {
            $data['url'] = request()->root() . '/h5/#/pages/indent/detail?id=' . $message['id'];
        }
        //发送记录
        $send = $this->app->template_message->send($data);
        $NotificationLog = new NotificationLog();
        $NotificationLog->user_id = $message['user_id'];
        $NotificationLog->type = NotificationLog::NOTIFICATION_LOG_TYPE_MINIWEIXIN;
        $NotificationLog->msg = json_encode($data);
        $NotificationLog->feedback = json_encode($send);
        $NotificationLog->state = $send['errcode'] == 0 ? NotificationLog::NOTIFICATION_LOG_STATE_OK : NotificationLog::NOTIFICATION_LOG_STATE_ERROR;
        $NotificationLog->save();
    }
    /**
     * 订单待发货提醒
     * @param $notifiable
     * @param $message
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    protected function adminOrderSendGood($notifiable, $message)
    {
        $data = [
            'template_id' => $this->information[$message['template']],
            'touser' => $notifiable->wechat,
            'data' => [
                'first' => __('wechat_channel.admin_order_send_good.first'),
                'keyword1' => $message['identification'],
                'keyword2' => sprintf("%01.2f", $message['total'] / 100),
                'keyword3' => $message['cellphone'],
                'keyword4' => __('wechat_channel.finish_payment.paid'),
                'remark' => __('wechat_channel.admin_order_send_good.remark'),
            ],
        ];
        $data['url'] = request()->root() . '/admin/#/Indent/shipment?id=' . $message['id'];
        //发送记录
        $send = $this->app->template_message->send($data);
        $NotificationLog = new NotificationLog();
        $NotificationLog->user_id = $message['user_id'];
        $NotificationLog->type = NotificationLog::NOTIFICATION_LOG_TYPE_MINIWEIXIN;
        $NotificationLog->msg = json_encode($data);
        $NotificationLog->feedback = json_encode($send);
        $NotificationLog->state = $send['errcode'] == 0 ? NotificationLog::NOTIFICATION_LOG_STATE_OK : NotificationLog::NOTIFICATION_LOG_STATE_ERROR;
        $NotificationLog->save();
    }
    /**
     *  订单确认收货通知
     * @param $notifiable
     * @param $message
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    protected function orderConfirmReceipt($notifiable, $message)
    {
        $data = [
            'template_id' => $this->information[$message['template']],
            'touser' => $notifiable->wechat,
            'data' => [
                'first' => __('wechat_channel.order_confirm_receipt.first'),
                'keyword1' => $message['identification'],
                'keyword2' => $message['name'],
                'keyword3' => $message['created_at'],
                'keyword4' => $message['shipping_time'],
                'keyword5' => $message['confirm_time'],
                'remark' => __('wechat_channel.order_confirm_receipt.remark'),
            ],
        ];
        if ($this->miniweixin) {
            $data['miniprogram'] = [
                'appid' => $this->miniweixin,
                'pagepath' => '/pages/indent/detail?id=' . $message['id'],
            ];
        } else {
            $data['url'] = request()->root() . '/h5/#/pages/indent/detail?id=' . $message['id'];
        }
        //发送记录
        $send = $this->app->template_message->send($data);
        $NotificationLog = new NotificationLog();
        $NotificationLog->user_id = $message['user_id'];
        $NotificationLog->type = NotificationLog::NOTIFICATION_LOG_TYPE_WECHAT;
        $NotificationLog->msg = json_encode($data);
        $NotificationLog->feedback = json_encode($send);
        $NotificationLog->state = $send['errcode'] == 0 ? NotificationLog::NOTIFICATION_LOG_STATE_OK : NotificationLog::NOTIFICATION_LOG_STATE_ERROR;
        $NotificationLog->save();
    }
    /**
     * 订单完成通知
     * @param $notifiable
     * @param $message
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    protected function adminOrderCompletion($notifiable, $message)
    {
        $data = [
            'template_id' => $this->information[$message['template']],
            'touser' => $notifiable->wechat,
            'data' => [
                'first' => __('wechat_channel.admin_order_completion.first'),
                'keyword1' => $message['identification'],
                'keyword2' => $message['name'],
                'keyword3' => $message['confirm_time'],
                'remark' => __('wechat_channel.admin_order_completion.remark'),
            ],
        ];
        $data['url'] = request()->root() . '/admin/#/Indent/shipment?id=' . $message['id'];
        //发送记录
        $send = $this->app->template_message->send($data);
        $NotificationLog = new NotificationLog();
        $NotificationLog->user_id = $message['user_id'];
        $NotificationLog->type = NotificationLog::NOTIFICATION_LOG_TYPE_MINIWEIXIN;
        $NotificationLog->msg = json_encode($data);
        $NotificationLog->feedback = json_encode($send);
        $NotificationLog->state = $send['errcode'] == 0 ? NotificationLog::NOTIFICATION_LOG_STATE_OK : NotificationLog::NOTIFICATION_LOG_STATE_ERROR;
        $NotificationLog->save();
    }
    /**
     *  退款成功通知
     * @param $notifiable
     * @param $message
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    protected function refundSuccess($notifiable, $message)
    {
        $data = [
            'template_id' => $this->information[$message['template']],
            'touser' => $notifiable->wechat,
            'data' => [
                'first' => __('wechat_channel.refund_success.first',['type'=>$message['type']]),
                'keyword1' => $message['identification'],
                'keyword2' => sprintf("%01.2f", $message['total'] / 100),
                'remark' => $message['refund_reason'],
            ],
        ];
        if ($this->miniweixin) {
            $data['miniprogram'] = [
                'appid' => $this->miniweixin,
                'pagepath' => '/pages/finance/bill_show?id=' . $message['money_id'],
            ];
        } else {
            $data['url'] = request()->root() . '/h5/#/pages/finance/bill_show?id=' . $message['money_id'];
        }
        //发送记录
        $send = $this->app->template_message->send($data);
        $NotificationLog = new NotificationLog();
        $NotificationLog->user_id = $message['user_id'];
        $NotificationLog->type = NotificationLog::NOTIFICATION_LOG_TYPE_WECHAT;
        $NotificationLog->msg = json_encode($data);
        $NotificationLog->feedback = json_encode($send);
        $NotificationLog->state = $send['errcode'] == 0 ? NotificationLog::NOTIFICATION_LOG_STATE_OK : NotificationLog::NOTIFICATION_LOG_STATE_ERROR;
        $NotificationLog->save();
    }
    /**
     *  注册成功通知
     * @param $notifiable
     * @param $message
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    protected function registeredSuccess($notifiable, $message)
    {
        $data = [
            'template_id' => $this->information[$message['template']],
            'touser' => $notifiable->wechat,
            'data' => [
                'first' => __('wechat_channel.registered_success.first'),
                'keyword1' => $message['phoneNumber'],
                'keyword2' => $message['password'],
                'keyword3' => $message['phoneNumber'],
                'remark' => __('wechat_channel.registered_success.remark'),
            ],
        ];
        //发送记录
        $send = $this->app->template_message->send($data);
        $NotificationLog = new NotificationLog();
        $NotificationLog->user_id = $message['user_id'];
        $NotificationLog->type = NotificationLog::NOTIFICATION_LOG_TYPE_WECHAT;
        $NotificationLog->msg = json_encode($data);
        $NotificationLog->feedback = json_encode($send);
        $NotificationLog->state = $send['errcode'] == 0 ? NotificationLog::NOTIFICATION_LOG_STATE_OK : NotificationLog::NOTIFICATION_LOG_STATE_ERROR;
        $NotificationLog->save();
    }
    // 插件
}
