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
use App\Models\v1\AuthGroup;
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
            return resReturn(0, __('hint.error.nonentity', ['attribute' => __('admin.name')]), Code::CODE_INEXISTENCE);
        }
        if (!Hash::check($request->password, $admin->password)) {
            return resReturn(0, __('hint.error.falseness', ['attribute' => __('admin.password')]), Code::CODE_WRONG);
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
        $group = auth('api')->user()->authGroup;
        $data = [
            'role' => [], // 角色
            'permissions' => [], // 权限
            'menu' => [], // 菜单
            'userInfo' => [],   //管理员信息
        ];
        $user = auth('api')->user();
        $data['userInfo'] = [
            'userName' => $user->name,
            'avatar' => $user->portrait
        ];
        $authGroupIdArray = [];
        $permissions = [];
        foreach ($group as $g) {
            $authGroupIdArray[] = $g->pivot->auth_group_id;
            $data['role'][] = $g->introduction;
        }
        $AuthGroup = AuthGroup::whereIn('id', $authGroupIdArray)->with(['AuthRule'])->select('id')->get();
        foreach ($AuthGroup as $a) {
            foreach ($a->AuthRule as $rule) {
                if (!in_array($rule->api, $data['permissions'])) {
                    // 获取不重复的权限
                    $permissions[] = $rule->id;
                    $data['permissions'][] = $rule->api;
                }
            }
        }
        $AuthRule = AuthRule::whereIn('id', $permissions)->orderBy('pid', 'ASC')->orderBy('sort', 'ASC')->get();
        $type = '';
        foreach ($AuthRule as $a) {
            switch ($a->type) {
                case AuthRule::AUTH_RULE_TYPE_MENU:
                    $type = 'menu';
                    break;
                case AuthRule::AUTH_RULE_TYPE_IFRAME:
                    $type = 'iframe';
                    break;
                case AuthRule::AUTH_RULE_TYPE_LINK:
                    $type = 'link';
                    break;
                case AuthRule::AUTH_RULE_TYPE_BUTTON:
                    $type = 'button';
                    break;
                case AuthRule::AUTH_RULE_TYPE_PAGE:
                    $type = 'page';
                    break;
            }
            if ($a->type == AuthRule::AUTH_RULE_TYPE_BUTTON) {
                continue;
            }
            $data['menu'][] = [
                'id' => $a->id,
                'pid' => $a->pid,
                'name' => $a->api,
                'path' => $a->path,
                'redirect' => $a->redirect_url ? $a->redirect_url : '',
                'component' => $a->view ? $a->view : '',
                'meta' => [
                    'title' => $a->title,
                    'icon' => $a->icon,
                    'type' => $type,
                    'hidden' => $a->is_hidden ? true : false,
                    'hiddenBreadcrumb' => $a->is_hidden_breadcrumb ? true : false,
                    'color' => $a->color,
                    'affix' => $a->is_affix ? true : false,
                    'fullpage' => $a->is_full_page ? true : false,
                    'active' => $a->active
                ],
            ];
        }
        $data['menu'] = genTree($data['menu'], 'pid');
        return resReturn(1, $data);
    }

    public function version()
    {
        // 获取最新版本
        $client = new Client();
        $url = "https://api.github.com/repos/dspurl/tfshop/releases/latest";
        $respond = $client->get($url);
        $version = json_decode($respond->getBody()->getContents(), true);
        return resReturn(1, [
            'version' => 'v' . config('tfshop.appVersion'),
            'tag_name' => $version['tag_name'],
            'html_url' => $version['html_url']
        ]);
    }

    /**
     * 登出
     * Logout
     * @param Request $request
     * @return string
     */
    public function logout(Request $request)
    {
        return resReturn(1, 'ok');
    }
}
