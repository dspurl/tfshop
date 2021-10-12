<?php
/**
 * Created by PhpStorm.
 * User: pang
 * Date: 2020/12/15
 * Time: 11:17
 */

namespace App\Services\WinXin;


use EasyWeChat\Kernel\Contracts\EventHandlerInterface;

class OtherMessageHandler implements EventHandlerInterface
{

    /**
     * @param mixed $payload
     * @return string
     */
    public function handle($payload = null)
    {
        return '暂不支持此类消息';
    }
}