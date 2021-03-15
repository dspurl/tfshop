<?php
/**
 * 微信小程序模板消息
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
        $this->information = config('notification.miniweixin');
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
        $message = $notification->invoice['parameter'];
        //配置了微信小程序、miniweixin存在值、配置过模板ID
        if($this->config['app_id'] && $notifiable->miniweixin){
            if($this->information[$message['template']]){
                $identification=convertUnderline($message['template']);
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
            'template_id' => $this->information[$message['template']],
            'touser' => $notifiable->miniweixin,
            'page' => 'pages/indent/detail?id=' . $message['id'],
            'data' => [
                'character_string1' => [
                    'value' => $message['identification'],
                ],
                'thing3' => [
                    'value' => $message['dhl'],
                ],
                'character_string4' => [
                    'value' => $message['odd'],
                ],
                'amount9' => [
                    'value' => $message['total'] / 100,
                ],
                'date6' => [
                    'value' => $message['shipping_time'],
                ]
            ],
        ];
        //发送记录
        $send=$this->app->subscribe_message->send($data);
        $NotificationLog =new NotificationLog();
        $NotificationLog->user_id = $message['user_id'];
        $NotificationLog->type = NotificationLog::NOTIFICATION_LOG_TYPE_MINIWEIXIN;
        $NotificationLog->msg = json_encode($data);
        $NotificationLog->feedback = json_encode($send);
        $NotificationLog->state = $send['errcode'] == 0 ? NotificationLog::NOTIFICATION_LOG_STATE_OK: NotificationLog::NOTIFICATION_LOG_STATE_ERROR;
        $NotificationLog->save();
    }
    // 插件
}
