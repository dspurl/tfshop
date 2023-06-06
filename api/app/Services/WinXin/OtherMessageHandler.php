<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
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
        return __('service.other_message');
    }
}
