<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Models\v1\Admin;
use App\Models\v1\AdminLog;
use App\Models\v1\AuthRule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    use AuthenticatesUsers;
    public function index(Request $request)
    {

        $admin = Admin::query()->where('name', $request->username)->first();
        if (!$admin) {
            return resReturn(0, '账号不存在', Code::CODE_INEXISTENCE);
        }
        if (!Hash::check($request->password, $admin->password)) {
            return resReturn(0, '密码错误', Code::CODE_WRONG);
        }
        $admin->last_login_at = Carbon::now()->toDateTimeString();
        $admin->save();
        $access_token = '';
        
        if ($this->hasTooManyLoginAttempts($request)) {
            $this->limiter()->clear($this->throttleKey($request));
            $this->fireLockoutEvent($request);
            return $this->sendLockoutResponse($request);
        }
        
        if ($request->type == 1) {  //首次登录获取token
            $client = new Client();
            $url = request()->root() . '/oauth/token';
            $params = array_merge(config('passport.proxy'), [
                'username' => $request->username,
                'password' => $request->password,
            ]);
            $respond = $client->post($url, ['form_params' => $params]);
            $access_token = json_decode($respond->getBody()->getContents(), true);
        } else if ($request->type == 2) {    //token失效更新token
            $client = new Client();
            $url = request()->root() . '/oauth/token';
            $params = array_merge(config('passport.refresh'), [
                'refresh_token' => $request->refresh_token,
            ]);
            $respond = $client->post($url, ['form_params' => $params]);
            $access_token = json_decode($respond->getBody()->getContents(), true);
        }
        $this->incrementLoginAttempts($request);
        //日志记录
        $input = $request->all();
        $log = new AdminLog();
        $log->admin_id = $admin->id;
        $log->path = $request->path();
        $log->method = $request->method();
        $log->ip = $request->ip();
        $log->input = json_encode($input, JSON_UNESCAPED_UNICODE);
        $log->save();   # 记录日志
        return resReturn(1, $access_token);
    }

    //获取管理员信息
    public function userInfo(Request $request)
    {
        $user = auth('api')->user();
        $data['name'] = $user->name;
        if ($user->portrait) {
            $data['avatar'] = $user->portrait;
        } else {
            $data['avatar'] = request()->root() . '/storage/image/avatar/1.gif';
        }
        $group = auth('api')->user()->authGroup->toArray();
        //权限名只取一个（多个权限名称太长）
        $data['introduction'] = $group[0]['introduction'];
        foreach ($group as $u) {
            $data['roles'][] = $u['roles'];
        }
        //获取该权限组的菜单
        $AuthRule = AuthRule::with(['AuthGroup' => function ($query) {
            $query->select('roles');
        }])->orderBy('pid', 'ASC')->orderBy('sort', 'ASC')->orderBy('id', 'ASC')->get();
        $data['asyncRouterMap'] = [];   //菜单
        $data['jurisdiction'] = []; //权限列表
        $asyncRouterMap = [];
        foreach ($AuthRule as $id => $rule) {
            $rolesArray = [];
            if (count($rule->AuthGroup) > 0) {
                foreach ($rule->AuthGroup as $group) {
                    $rolesArray[] = $group->roles;
                    $data['jurisdiction'][$rule->api][] = $group->roles;
                }

            }
            if ($rule->type == 0) {
                $asyncRouterMap[] = array(
                    'id' => $rule->id,
                    'pid' => $rule->pid,
                    'path' => $rule->pid > 0 ? lcfirst($rule->api) : '/' . lcfirst($rule->api),
                    'component' => $rule->pid > 0 ? $rule->api : 'Layout',
                    'redirect' => $rule->pid > 0 ? $rule->url : 'noredirect',
                    'alwaysShow' => $rule->pid > 0 ? false : true,
                    'name' => $rule->api,
                    'hidden' => $rule->state == 1 && array_intersect($data['roles'], $rolesArray) ? false : true,
                    'meta' => array(
                        'title' => $rule->title,
                        'icon' => $rule->icon,
                        'roles' => $rolesArray,
                        'noCache' => true,
                        'breadcrumb' => true
                    ),
                );
            }
        }
        $data['asyncRouterMap'] = genTree($asyncRouterMap, 'pid');
        return resReturn(1, $data);
    }
}
