<?php

namespace App\Notifications;

use App\Channels\MiNiWeiXinChannel;
use App\Channels\SmsChannel;
use App\Channels\WechatChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

//class InvoicePaid extends Notification implements ShouldQueue
class InvoicePaid extends Notification
{
//    use Queueable;
    public $invoice;
    const NOTIFICATION_TYPE_SYSTEM_MESSAGES = 1; //通知类型:系统消息
    const NOTIFICATION_TYPE_DEAL = 2; //通知类型:交易
    const NOTIFICATION_TYPE_ACTIVITY = 3; //通知类型:活动

    /**
     * Create a new notification instance.
     *
     * @param string $invoice
     */
    public function __construct($invoice = '')
    {
        $this->invoice = $invoice;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        if (array_key_exists("prefers", $this->invoice)) { //多种通知方式
            $return = [];
            $notification = json_decode($notifiable->notification);
            foreach ($this->invoice['prefers'] as $prefers) {
                switch ($prefers) {
                    case 'mail':
                        //配置了邮箱&用户验证了邮箱&用户开启了邮件通知
                        if ($notification != null) {
                            if ($notifiable->email && config('mail.username') && $notification->email) {
                                $return[] = $prefers;
                            }
                        }
                        break;
                    case 'database':
                    case 'broadcast':
                    case 'nexmo':
                    case 'slack':
                        $return[] = $prefers;
                        break;
                    case 'sms': //短信
                        $return[] = SmsChannel::class;
                        break;
                    case 'miniweixin': //微信小程序
                        $return[] = MiNiWeiXinChannel::class;
                        break;
                    case 'wechat': //微信公众平台
                        //配置了微信公众平台&用户验证了微信公众平台&用户开启了微信公众平台通知
                        if ($notification != null) {
                            if ($notifiable->wechat && config('wechat.official_account.default.token') && $notification->wechat) {
                                $return[] = WechatChannel::class;
                            }
                        }
                        break;
                }
            }
            return $return;
        } else {  //默认仅数据库通知
            return ['database'];
        }
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $this->invoice['appName'] = config('app.name');
        $this->invoice['type'] = array_key_exists("type", $this->invoice) ? $this->invoice['type'] : static::NOTIFICATION_TYPE_SYSTEM_MESSAGES;    //通知类型：1系统消息（默认）2交易3活动
        if (array_key_exists("admin", $this->invoice)) {
            $this->invoice['url'] = array_key_exists("url", $this->invoice) ? config('app.url') . '/admin/#' . $this->invoice['url'] : '';   //后台跳转地址
        } else {
            $this->invoice['url'] = array_key_exists("url", $this->invoice) ? config('app.url') . '/h5/#' . $this->invoice['url'] : '';   //跳转地址
        }
        $this->invoice['image'] = array_key_exists("image", $this->invoice) ? $this->invoice['image'] : '';   //带图
        $this->invoice['price'] = array_key_exists("price", $this->invoice) ? sprintf("%01.2f", $this->invoice['price'] / 100) : '';   //金额
        $this->invoice['list'] = array_key_exists("list", $this->invoice) ? $this->invoice['list'] : '';   //列表
        $this->invoice['remark'] = array_key_exists("remark", $this->invoice) ? $this->invoice['remark'] : '';   //通知备注
        return (new MailMessage)->view('emails.notification', $this->invoice)
            ->subject($this->invoice['title']);
    }

    /**
     * 获取短信形式的通知。
     *
     * @param mixed $notifiable
     * @return string
     */
    public function toSms($notifiable)
    {
        return $this->invoice;
    }

    /**
     * 获取微信小程序的通知。
     *
     * @param mixed $notifiable
     * @return string
     */
    public function MiNiWeiXin($notifiable)
    {
        return $this->invoice;
    }

    /**
     * 获取微信公众号的通知。
     *
     * @param mixed $notifiable
     * @return string
     */
    public function Wechat($notifiable)
    {
        return $this->invoice;
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'type' => array_key_exists("type", $this->invoice) ? $this->invoice['type'] : static::NOTIFICATION_TYPE_SYSTEM_MESSAGES,    //通知类型：1系统消息（默认）2交易3活动
            'url' => array_key_exists("url", $this->invoice) ? $this->invoice['url'] : '',   //跳转地址
            'image' => array_key_exists("image", $this->invoice) ? $this->invoice['image'] : '',   //带图
            'price' => array_key_exists("price", $this->invoice) ? $this->invoice['price'] : '',   //金额
            'title' => $this->invoice['title'],   //通知标题
            'list' => array_key_exists("list", $this->invoice) ? $this->invoice['list'] : '',   //列表
            'remark' => array_key_exists("remark", $this->invoice) ? $this->invoice['remark'] : '',   //通知备注
        ];
    }
}
