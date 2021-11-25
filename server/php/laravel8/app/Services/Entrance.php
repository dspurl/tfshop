<?php
/**
 * 公众号、小程序统一入口类
 */

namespace App\Services;


use App\Models\v1\User;
use App\Services\WinXin\OtherMessageHandler;
use App\Services\WinXin\SubscribeHandler;
use EasyWeChat\Kernel\Messages\Image;
use EasyWeChat\Kernel\Messages\Media;
use EasyWeChat\Kernel\Messages\Message;
use EasyWeChat\Factory;
use EasyWeChat\Kernel\Messages\Text;
use EasyWeChat\Kernel\Messages\Transfer;
use Illuminate\Support\Facades\Log;

class Entrance
{
    protected $client;

    /**
     * Entrance constructor.
     * @param $client
     */
    public function __construct($client)
    {
        $this->client = $client;
    }

    /**
     * @return mixed
     */
    public function informationDistribution()
    {
        $client = $this->client;
        if (method_exists(static::class, $client)) {
            return $this->$client();
        } else {
            exit('未配置客户端');
        }
    }

    /**
     * 微信公众号
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \EasyWeChat\Kernel\Exceptions\BadRequestException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \ReflectionException
     */
    public function wechat()
    {
        $config = config('wechat.official_account.default');
        if (!$config['token']) {
            exit('未配置微信公众账号');
        }
        $app = Factory::officialAccount($config);
        /*$app->menu->delete(); // 全部
        $buttons = [
            [
                "name"       => "小程序",
                "sub_button" => [
                    [
                        "type" => "miniprogram",
                        "name" => "DSSHOP商城",
                        "url"  => "https://dsshop.dswjcms.com/h5/#/",
                        "appid"=>"wxc31e70f47087660b",
                        "pagepath"=>"pages/index/index"
                    ],
                    [
                        "type" => "miniprogram",
                        "name" => "宜云码",
                        "url"  => "https://api.yyunma.cn/h5/#/",
                        "appid"=>"wx1428c90c0926d491",
                        "pagepath"=>"pages/index/index"
                    ]
                ],
            ],
            [
                "name"       => "h5",
                "sub_button" => [
                    [
                        "type" => "view",
                        "name" => "DSSHOP商城",
                        "url"  => "https://dsshop.dswjcms.com/h5/#/"
                    ]
                ],
            ],
        ];
        $app->menu->create($buttons);*/
        $app->server->push(SubscribeHandler::class, Message::EVENT); // 事件消息
        $app->server->push(OtherMessageHandler::class, Message::TEXT | Message::IMAGE | Message::VOICE | Message::VIDEO | Message::SHORT_VIDEO); // 其它消息
        return $app->server->serve();
    }

    /**
     * 微信小程序
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \EasyWeChat\Kernel\Exceptions\BadRequestException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \ReflectionException
     */
    public function miniweixin()
    {
        $config = config('wechat.mini_program.default');
        $officialConfig = config('wechat.official_account.default');
        if (!$config['token']) {
            exit('未配置微信小程序账号');
        }
        if (!$officialConfig['token']) {
            exit('未配置微信公众账号');
        }
        $app = Factory::miniProgram($config);
        $app->server->push(function ($message) use ($app, $officialConfig) {
//            Log::info('$message:'.json_encode($message));
            if ($message['MsgType'] == 'miniprogrampage' && $message['PagePath'] == 'pages/public/subscribe') {    //用户发送消息卡片，并且是开启微信提醒服务时才触发
                $User = User::where('miniweixin', $message['FromUserName'])->first();
                if (!$User) {
                    $app->customer_service->message('请先登录后再开启微信提醒服务')->to($message['FromUserName'])->send();
                }
                $official = Factory::officialAccount($officialConfig);
                // 采用临时生成二维码
                $result = $official->qrcode->temporary($User->uuid, 6 * 24 * 3600); //通过uuid绑定用户小程序和公众号账号
                $url = $official->qrcode->url($result['ticket']);
                $content = file_get_contents($url); //获取二维码二进制
                file_put_contents('storage/temporary/code.jpg', $content);  //上传到本地
                $uploadImage = $app->media->uploadImage('storage/temporary/code.jpg');    //获取media_id
//            Log::info('media_id:'.json_encode($uploadImage));
                $image = new Image($uploadImage['media_id']);
                $app->customer_service->message($image)->to($message['FromUserName'])->send();
            } else {  //其它将进行客服转发
                return new Transfer();
            }

        });

        return $app->server->serve();
    }
}
