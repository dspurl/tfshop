<?php

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
            return resReturn(0, '请配置applySecret', Code::CODE_MISUSE);
        }
        if (!$redis->exists('wechat.' . $request->header('apply-secret'))) {
            return resReturn(0, '非法applySecret', Code::CODE_INEXISTENCE);
        }
        return $next($request);
    }
}
