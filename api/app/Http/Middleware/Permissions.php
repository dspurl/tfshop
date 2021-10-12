<?php

namespace App\Http\Middleware;

use App\Code;
use App\Models\v1\AdminLog;
use App\Models\v1\AuthGroupAuthRule;
use App\Models\v1\AuthRule;
use Closure;

class Permissions
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next, $role)
    {
        if (!$role) {
            return resReturn(0, '权限配置有误', Code::CODE_PERMISSION_CONFIGURATION);
        }
        if (count(auth('api')->user()->authGroup) < 1) {
            return resReturn(0, '该账号无权限', Code::CODE_NO_ACCESS);
        }
        $users = auth('api')->user()->authGroup->toArray();
        $authGroup = [];
        foreach ($users as $u) {
            $authGroup[] = $u['id'];
        }
        $rules = array();
        $authRule = AuthRule::where('api', $role)->first(['id']);
        if ($authRule) {
            $count = AuthGroupAuthRule::where('auth_rule_id', $authRule->id)->whereIn('auth_group_id', $authGroup)->count();
            if ($count > 0) { //判断是否拥有该权限
                //记录
                if ('GET' != $request->method() && 'OPTIONS' != $request->method()) {
                    $input = $request->all();
                    $log = new AdminLog();
                    $log->admin_id = auth('api')->user()->id;
                    $log->path = $request->path();
                    $log->method = $request->method();
                    $log->ip = $request->ip();
                    $log->input = json_encode($input, JSON_UNESCAPED_UNICODE);
                    $log->save();   # 记录日志
                }
                return $next($request);
            } else {
                return resReturn(0, '该账号无权限', Code::CODE_NO_ACCESS);
            }
        } else {
            return resReturn(0, '该权限未配置', Code::CODE_NO_ACCESS);
        }


    }
}
