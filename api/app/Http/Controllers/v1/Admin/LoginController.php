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
namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\common\RedisService;
use App\Models\v1\Admin;
use App\Models\v1\AdminLog;
use App\Models\v1\AuthRule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

/**
 * @group [ADMIN]Login(登录)
 * Class LoginController
 * @package App\Http\Controllers\v1\Admin
 */
class LoginController extends Controller
{
    use AuthenticatesUsers;

    /**
     * Register
     * 登录
     * @param Request $request
     * @return string|void
     * @throws \Illuminate\Validation\ValidationException
     * @queryParam  username string 用户名
     * @queryParam  password string 密码
     */
    public function index(Request $request)
    {
        $admin = Admin::query()->where('name', $request->username)->first();
        if (!$admin) {
            return resReturn(0, __('hint.error.nonentity',['attribute'=>__('admin.name')]), Code::CODE_INEXISTENCE);
        }
        if (!Hash::check($request->password, $admin->password)) {
            return resReturn(0, __('hint.error.falseness',['attribute'=>__('admin.password')]), Code::CODE_WRONG);
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
            $params = array_merge(config('passport.admin.proxy'), [
                'username' => $request->username,
                'password' => $request->password,
            ]);
            $respond = $client->post($url, ['form_params' => $params]);
            $access_token = json_decode($respond->getBody()->getContents(), true);
        } else if ($request->type == 2) {    //token失效更新token
            $client = new Client();
            $url = request()->root() . '/oauth/token';
            $params = array_merge(config('passport.admin.refresh'), [
                'refresh_token' => $request->refresh_token,
            ]);
            $respond = $client->post($url, ['form_params' => $params]);
            $access_token = json_decode($respond->getBody()->getContents(), true);
        }
        $access_token['refresh_expires_in'] = config('passport.refresh_expires_in') / 60 / 60 / 24;
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

    /**
     * TokenRefresh
     * token刷新
     * @param Request $request
     * @return string
     * @queryParam  refresh_token string 刷新密钥
     */
    public function refresh(Request $request)
    {
        $client = new Client();
        $url = request()->root() . '/oauth/token';
        $params = array_merge(config('passport.admin.refresh'), [
            'refresh_token' => $request->refresh_token,
        ]);
        $respond = $client->post($url, ['form_params' => $params]);
        $access_token = json_decode($respond->getBody()->getContents(), true);
        return resReturn(1, $access_token);
    }

    /**
     * ObtainingAdministratorInformation
     * 获取管理员信息
     * @param Request $request
     * @return string
     */
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
        }])->where('lang', App::getLocale())->orderBy('pid', 'ASC')->orderBy('sort', 'ASC')->orderBy('id', 'ASC')->get();
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
                $activeMenu = '';
                if (strpos($rule->api, 'Create') !== false) {
                    $activeMenu = str_replace('Create', '', $rule->api) . 'List';
                } else if (strpos($rule->api, 'Edit') !== false) {
                    $activeMenu = str_replace('Edit', '', $rule->api) . 'List';
                } else if (strpos($rule->api, 'Detail') !== false) {
                    $activeMenu = str_replace('Detail', '', $rule->api) . 'List';
                }
                $asyncRouterMap[] = array(
                    'id' => $rule->id,
                    'pid' => $rule->pid,
                    'path' => $rule->pid > 0 ? lcfirst($rule->api) : '/' . lcfirst($rule->api),
                    'component' => $rule->pid > 0 ? $rule->api : 'Layout',
                    'redirect' => (strpos($rule->api, 'List') !== false || strpos($rule->api, 'Create') !== false || strpos($rule->api, 'Edit') !== false || strpos($rule->api, 'Detail') !== false) ? $rule->url : 'noredirect',
                    'alwaysShow' => $rule->state,
                    'name' => $rule->api,
                    'hidden' => $rule->state == 1 && array_intersect($data['roles'], $rolesArray) ? false : true,
                    'meta' => array(
                        'title' => $rule->title,
                        'icon' => $rule->icon,
                        'roles' => $rolesArray,
                        'noCache' => false,
                        'breadcrumb' => true,
                        'activeMenu' => $activeMenu
                    ),
                );
            }
        }
        $data['asyncRouterMap'] = genTree($asyncRouterMap, 'pid');
        $data['version'] = config('tfshop.appVersion');
        return resReturn(1, $data);
    }
}
