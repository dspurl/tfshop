<?php
/**
 * 短信
 */

namespace App\Channels;
use App\Models\v1\NotificationLog;
use Carbon\Carbon;
use EasyWeChat\Factory;
use Illuminate\Notifications\Notification;

class MiNiWeiXinChannel
{
    private $config;
    private $app;
    private $information;
    public function __construct()
    {
        $this->config = config('wechat.mini_program.default');
        $this->app = Factory::miniProgram($this->config);
        $this->information = config('wechat.subscription_information');
    }
    /**
     * 发送指定的通知.
     *
     * @param  mixed $notifiable
     * @param  \Illuminate\Notifications\Notification $notification
     * @return void
     */
    public function send($notifiable, Notification $notification)
    {
        $message = $notification->MiNiWeiXin($notifiable);
        //配置了微信小程序、miniweixin存在值、配置过模板ID、配置过附加参数
        if($this->config['app_id'] && $notifiable->miniweixin &&  $message['identification'] && $message['parameter']){
            if($this->information[$message['identification']]){
                $identification=convertUnderline($message['identification']);
                $this->$identification($notifiable,$message);
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
    protected function deliveryRelease($notifiable,$message){
        $data = [
            'template_id' => $this->information[$message['identification']],
            'touser' => $notifiable->miniweixin,
            'page' => 'pages/order/showOrder?id=' . $message['parameter']['id'],
            'data' => [
                'character_string1' => [
                    'value' => $message['parameter']['identification'],
                ],
                'thing3' => [
                    'value' => $message['parameter']['dhl'],
                ],
                'character_string4' => [
                    'value' => $message['parameter']['odd'],
                ],
                'amount9' => [
                    'value' => $message['parameter']['total'] / 100,
                ],
                'date6' => [
                    'value' => Carbon::now()->toDateTimeString(),
                ]
            ],
        ];
        //发送记录
        $send=$this->app->subscribe_message->send($data);
        $NotificationLog =new NotificationLog();
        $NotificationLog->user_id = $message['parameter']['user_id'];
        $NotificationLog->type = NotificationLog::NOTIFICATION_LOG_TYPE_MINIWEIXIN;
        $NotificationLog->msg = json_encode($data);
        $NotificationLog->feedback = json_encode($send);
        $NotificationLog->state = $send['errcode'] == 0 ? NotificationLog::NOTIFICATION_LOG_STATE_OK: NotificationLog::NOTIFICATION_LOG_STATE_ERROR;
        $NotificationLog->save();
    }
}