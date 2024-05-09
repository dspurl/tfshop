<?php
/** +----------------------------------------------------------------------
 * | 短信
 * +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */

namespace App\Channels;
use App\common\Aliyun;
use Illuminate\Notifications\Notification;

class SmsChannel
{
    /**
     * 发送指定的通知.
     *
     * @param  mixed $notifiable
     * @param  \Illuminate\Notifications\Notification $notification
     * @return void
     */
    public function send($notifiable, Notification $notification)
    {
        $message = $notification->invoice['parameter'];
        $Config = config('sms');
        //判断短信账号是否配置
        if($Config[$Config['service']]['access_id']){
            //短信为模板化，故不需要传入文本信息，一般只要一个手机号+短信模板变量对应的实际值即可
            $this->$Config['service']($notifiable->cellphone,$message);
        }
    }

    /**
     *  阿里短信
     * @param $cellphone
     * @throws \AlibabaCloud\Client\Exception\ClientException
     */
    public function aliyun($cellphone){
        (new Aliyun())->sendCode($cellphone);
    }
}
