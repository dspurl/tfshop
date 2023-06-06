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
use Closure;

class AppVerify
{
    /**
     * 验证APP
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!$request->header('apply-secret')) {
            return resReturn(0, __('middleware.app_verify.error.illegality'), Code::CODE_INEXISTENCE);
        }
        if (config('dsshop.applySecret') != $request->header('apply-secret')) {
            return resReturn(0, __('middleware.app_verify.error.api'), Code::CODE_INEXISTENCE);
        }
        return $next($request);
    }
}
