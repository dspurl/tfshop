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

use App\Code;
use Closure;

class LesseeVerify
{
    /**
     * 租户端验证应用ID和权限
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!$request->header('applyid')) {
            return resReturn(0, __('middleware.lessee_verify.error.apply_id'), Code::CODE_INEXISTENCE);
        }
        if (!$request->header('versionid')) {
            return resReturn(0, __('middleware.lessee_verify.error.version_id'), Code::CODE_INEXISTENCE);
        }
        return $next($request);
    }
}
