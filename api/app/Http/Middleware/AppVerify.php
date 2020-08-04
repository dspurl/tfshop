<?php

namespace App\Http\Middleware;

use App\Code;
use App\Models\v1\AdminLog;
use App\Models\v1\AuthGroupAuthRule;
use App\Models\v1\AuthRule;
use Closure;
use Illuminate\Support\Facades\Cache;

class AppVerify
{
    /**
     * 验证APP
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(!$request->header('apply-secret')){
            return resReturn(0,'非法apply-secret',Code::CODE_INEXISTENCE);
        }
        if(config('dswjcms.applySecret') != $request->header('apply-secret')){
            return resReturn(0,'API密钥有误',Code::CODE_INEXISTENCE);
        }
        return $next($request);
    }
}
