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

namespace App\Services\WinXin;


use App\Models\v1\User;
use EasyWeChat\Kernel\Contracts\EventHandlerInterface;
use Illuminate\Support\Facades\Log;

class SubscribeHandler implements EventHandlerInterface
{

    /**
     * @param mixed $payload
     * @return string
     */
    public function handle($payload = null)
    {
        switch ($payload['Event']) {
            case 'subscribe':
            case 'SCAN':
                if ($payload['EventKey']) {
                    $EventKey = explode('qrscene_', $payload['EventKey']);
                    if (($payload['Event'] == 'subscribe' && $EventKey[1]) || $payload['Event'] == 'SCAN') {  //第一次关注如果包含qrscene_或已经关注公众号为扫码进来的，说明是来绑定微信通知的
                        $EventKey = count($EventKey) == 2 ? $EventKey[1] : $EventKey[0];
                        User::$withoutAppends = false;
                        $User = User::where('uuid', $EventKey)->first();
                        $notification = $User->notification;
                        $notification['wechat'] = true;
//                        Log::info('$notification:'.json_encode($notification));
                        User::where('uuid', $EventKey)->update([
                            'wechat' => $payload['FromUserName'],
                            'notification' => json_encode($notification)
                        ]);
                        return __('service.subscribe.scan');
                    }
                }
                break;
            case 'unsubscribe':   //取消关注
                User::$withoutAppends = false;
                $User = User::where('wechat', $payload['FromUserName'])->first();
                $notification = $User->notification;
                $notification['wechat'] = false;
                User::where('wechat', $payload['FromUserName'])->update([
                    'wechat' => null,
                    'notification' => json_encode($notification)
                ]);
                break;
        }

        return __('service.subscribe');
    }
}
