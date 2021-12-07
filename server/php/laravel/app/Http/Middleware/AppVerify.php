<?php

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
            return resReturn(0, __('hint.error.illegality', ['specification' => 'apply-secret']), Code::CODE_INEXISTENCE);
        }
        if (config('dsshop.applySecret') != $request->header('apply-secret')) {
            return resReturn(0, __('hint.error.key_wrong', ['specification' => 'API']), Code::CODE_INEXISTENCE);
        }
        return $next($request);
    }
}
