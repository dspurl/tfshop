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
namespace App\Http\Middleware;

use App\Code;
use App\common\RedisService;
use Closure;

class Applet
{
    /**
     * 小程序secret验证
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $redis = new RedisService();
        if (!$request->header('apply-secret')) {
            return resReturn(0, __('middleware.applet.error.configuration'), Code::CODE_MISUSE);
        }
        if (!$redis->exists('wechat.' . $request->header('apply-secret'))) {
            return resReturn(0, __('middleware.applet.error.illegality'), Code::CODE_INEXISTENCE);
        }
        return $next($request);
    }
}
