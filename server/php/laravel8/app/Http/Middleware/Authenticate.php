<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param \Illuminate\Http\Request $request
     * @return string|null
     * @throws \Exception
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            throw new \Exception('登录超时，请重新登录', 500);
        }
    }
}
