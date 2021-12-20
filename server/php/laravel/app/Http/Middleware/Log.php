<?php

namespace App\Http\Middleware;

use App\Models\v1\AdminLog;
use App\Models\v1\UserLog;
use Closure;
use Illuminate\Http\Request;

class Log
{
    /**
     * 日志记录
     * Set the log
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $id = 0;
        $response = $next($request);
        if (auth('api')->user()) {
            $id = auth('api')->user()->id;
        } else if (auth('web')->user()) {
            $id = auth('web')->user()->id;
        }
        if (strpos($request->route()->getName(), 'admin.') !== false) {
            $AdminLog = new AdminLog();
            $AdminLog->admin_id = $id;
            $AdminLog->header = $request->header();
            $AdminLog->name = $request->route()->getName() ?? '';
            $AdminLog->path = $request->path();
            $AdminLog->url = $request->fullUrl();
            $AdminLog->method = $request->method();
            $AdminLog->ip = $request->ip();
            $AdminLog->param = $request->all();
            $AdminLog->save();
        } else if (strpos($request->route()->getName(), 'client.') !== false) {
            $UserLog = new UserLog();
            $UserLog->user_id = $id;
            $UserLog->header = $request->header();
            $UserLog->name = $request->route()->getName();
            $UserLog->path = $request->path();
            $UserLog->url = $request->fullUrl();
            $UserLog->method = $request->method();
            $UserLog->ip = $request->ip();
            $UserLog->param = $request->all();
            $UserLog->save();
        }
        return $next($request);
    }
}
