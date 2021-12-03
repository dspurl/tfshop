<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Models\v1\Admin;
use App\Models\v1\AdminLog;
use App\Models\v1\AuthGroup;
use App\Models\v1\AuthRule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class LoginController extends Controller
{

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
     * token刷新
     * @param Request $request
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
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
     * 获取管理员信息
     * @param Request $request
     * @return string
     */
    public function userInfos(Request $request)
    {
        $user = auth('api')->user();
        $data['name'] = $user->name;
        $data['avatar'] = $user->portrait;
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
        return resReturn(1, $data);
    }

    /**
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
        $AuthRule = AuthRule::whereIn('id', $permissions)->orderBy('pid', 'ASC')->orderBy('sort', 'DESC')->get();
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
            }
            if($a->type == AuthRule::AUTH_RULE_TYPE_BUTTON){
                break;
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
}
