<?php

namespace App\Http\Middleware;

use App\Code;
use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param \Illuminate\Http\Request $request
     * @return string
     * @throws \Exception
     */
    protected function redirectTo($request)
    {
        if (!$request->expectsJson()) {
//            exit('密钥已失效，请清空本地缓存');
            throw new \Exception('登录超时，请重新登录', 500);
        }
    }
}
