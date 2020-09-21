<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoicePaid extends Notification
{
    public $invoice;
    const NOTIFICATION_TYPE_SYSTEM_MESSAGES= 1; //通知类型:系统消息
    const NOTIFICATION_TYPE_DEAL= 2; //通知类型:交易
    const NOTIFICATION_TYPE_ACTIVITY= 3; //通知类型:活动
    /**
     * Create a new notification instance.
     *
     * @param string $invoice
     */
    public function __construct($invoice='')
    {
        $this->invoice = $invoice;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return array_key_exists("prefers",$this->invoice) ? $this->invoice['prefers']: ['database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'type' => array_key_exists("type",$this->invoice) ? $this->invoice['type'] : static::NOTIFICATION_TYPE_SYSTEM_MESSAGES,    //通知类型：1系统消息（默认）2交易3活动
            'url' => array_key_exists("url",$this->invoice) ? $this->invoice['url']: '',   //跳转地址
            'image' => array_key_exists("image",$this->invoice) ? $this->invoice['image'] : '',   //带图
            'price' => array_key_exists("price",$this->invoice) ? $this->invoice['price'] : '',   //金额
            'title' => $this->invoice['title'],   //通知标题
            'list' => array_key_exists("list",$this->invoice) ? $this->invoice['list'] : '',   //列表
            'remark' =>array_key_exists("remark",$this->invoice) ? $this->invoice['remark'] : '',   //通知备注
        ];
    }
}
