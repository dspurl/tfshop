<?php

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
            return resReturn(0, '非法applyid', Code::CODE_INEXISTENCE);
        }
        if (!$request->header('versionid')) {
            return resReturn(0, '非法versionid', Code::CODE_INEXISTENCE);
        }
        return $next($request);
    }
}
