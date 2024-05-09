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
namespace App\Http\Middleware;

use Closure;

class EnableCrossRequestMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $origin = $request->server('HTTP_ORIGIN') ? $request->server('HTTP_ORIGIN') : '';
        $resp = $next($request);
        $resp->headers->add([
            'Access-Control-Allow-Origin' => $origin,
            'Access-Control-Allow-Headers' => 'Origin, Content-Type, Cookie, X-CSRF-TOKEN, Accept, Authorization,applyid,openid,apply-secret,versionid, X-XSRF-TOKEN,Lang',
            'Access-Control-Expose-Headers' => 'Authorization, authenticated',
            'Access-Control-Allow-Methods' => 'GET, POST, PATCH, PUT, OPTIONS,DELETE',
            'Access-Control-Allow-Credentials' => 'true'
        ]);
        return $resp;
    }
}
