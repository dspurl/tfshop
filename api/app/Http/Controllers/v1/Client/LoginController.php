<?php

namespace App\Http\Controllers\v1\Client;

use App\Code;
use App\common\RedisService;
use App\Models\v1\MiniProgram;
use App\Models\v1\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Webpatser\Uuid\Uuid;

/**
 * login
 * 登录、注册相关
 * Class LoginController
 * @package App\Http\Controllers\v1\Client
 */
class LoginController extends Controller
{

    /**
     * Login
     * 登录
     * @param Request $request
     * @return string
     * @queryParam  cellphone int 手机号
     * @queryParam  password string 密码
     */
    public function login(Request $request)
    {
        if (!$request->has('cellphone')) {
            return resReturn(0, '手机号不能为空', Code::CODE_WRONG);
        }
        if (!$request->has('password')) {
            return resReturn(0, '密码不能为空', Code::CODE_WRONG);
        }
        $user = User::where('cellphone', $request->cellphone)->first();
        if (!$user) {
            return resReturn(0, '手机号未注册过', Code::CODE_WRONG);
        }
        if ($user->unsubscribe == User::USER_UNSUBSCRIBE_YES) {
            return resReturn(0, '您的账号已注销，无法重新注册', Code::CODE_WRONG);
        }
        if ($user->state == User::USER_STATE_FORBID) {
            return resReturn(0, '您的账户禁止访问，请联系管理员', Code::CODE_WRONG);
        }
        if (!Hash::check($request->password, $user->password)) {
            return resReturn(0, '密码错误', Code::CODE_WRONG);
        }
        if (!$user->api_token) {
            $user->api_token = hash('sha256', Str::random(60));
        }
        $user->updated_at = Carbon::now()->toDateTimeString();
        $user->save();
        return resReturn(1, [
            'nickname' => $user->nickname,
            'cellphone' => $user->cellphone,
            'portrait' => $user->portrait,
            'api_token' => $user->api_token,
            'wechat' => $user->wechat
        ]);
    }

    /**
     * 授权登录
     * @param Request $request
     * @return array
     * @queryParam  iv array iv
     */
    public function authorization(Request $request)
    {
        if ($request->has('iv')) {
            $openid = $request->header('openid');
            if (!$openid) {
                return resReturn(0, '参数有误', Code::CODE_MISUSE);
            }
            $MiniProgram = new MiniProgram();
            $miniPhoneNumber = $MiniProgram->miniPhoneNumber($request->platform, $request->session_key, $request->iv, $request->encryptedData);
            if ($miniPhoneNumber['result'] == 'error') {
                return resReturn(0, $miniPhoneNumber['msg'], Code::CODE_MISUSE);
            }
            $User = User::where('cellphone', $miniPhoneNumber['purePhoneNumber'])->first();
            if (!$User) {
                $return = DB::transaction(function () use ($request, $miniPhoneNumber, $openid) {
                    $password = substr(MD5(time()), 5, 6);  //随机生成密码
                    $redis = new RedisService();
                    $redis->setex('password.register.' . $miniPhoneNumber['purePhoneNumber'], 5, $password);
                    $user = new User();
                    $user->name = $miniPhoneNumber['purePhoneNumber'];
                    $user->cellphone = $miniPhoneNumber['purePhoneNumber'];
                    $user->password = bcrypt($password);
                    $user[strtolower($request->platform)] = $openid;
                    $user->api_token = hash('sha256', Str::random(60));
                    $user->uuid = (string)Uuid::generate();
                    $user->save();
                    return [
                        'state' => 1,
                        'data' => $user
                    ];
                }, 5);
                if ($return['state'] == 1) {
                    return resReturn(1, [
                        'nickname' => $return['data']->nickname,
                        'cellphone' => $return['data']->cellphone,
                        'portrait' => $return['data']->portrait,
                        'api_token' => $return['data']->api_token,
                        'wechat' => $return['data']->wechat
                    ]);
                } else {
                    return resReturn(0, $return['msg'], $return['code']);
                }
            } else {
                if ($User->unsubscribe == User::USER_UNSUBSCRIBE_YES) {
                    return resReturn(0, '您的账号已注销，无法重新注册', Code::CODE_WRONG);
                }
                $return = DB::transaction(function () use ($request, $miniPhoneNumber, $User, $openid) {
                    $User->updated_at = Carbon::now()->toDateTimeString();
                    if (!$User[strtolower($request->platform)]) {
                        $User[strtolower($request->platform)] = $openid;
                    }
                    $User->save();
                    return [
                        'state' => 1,
                        'data' => $User
                    ];
                }, 5);
                if ($return['state'] == 1) {
                    return resReturn(1, [
                        'nickname' => $return['data']->nickname,
                        'cellphone' => $return['data']->cellphone,
                        'portrait' => $return['data']->portrait,
                        'api_token' => $return['data']->api_token,
                        'wechat' => $return['data']->wechat
                    ]);
                }
            }
        } else {
            return resReturn(0, '您拒绝授权，无法登录', Code::CODE_MISUSE);
        }
    }

    /**
     * Logout
     * 登出
     * @param Request $request
     * @return string
     */
    public function logout(Request $request)
    {
        $user = User::find(auth('web')->user()->id);
        $user->updated_at = Carbon::now()->toDateTimeString();
        $user->save();
        return resReturn(1, '退出成功');
    }

    /**
     * Register
     * 注册
     * @param Request $request
     * @return string
     * @queryParam  cellphone int 手机号
     * @queryParam  password string 密码
     * @queryParam  rPassword string 重复密码
     * @queryParam  code int 验证码
     */
    public function register(Request $request)
    {
        if (!$request->has('cellphone')) {
            return resReturn(0, '手机号不能为空', Code::CODE_WRONG);
        }
        if (!$request->has('password')) {
            return resReturn(0, '密码不能为空', Code::CODE_WRONG);
        }
        if (!$request->has('rPassword')) {
            return resReturn(0, '重复密码不能为空', Code::CODE_WRONG);
        }
        if ($request->password != $request->rPassword) {
            return resReturn(0, '重复密码和密码不相同', Code::CODE_WRONG);
        }
        $user = User::where('cellphone', $request->cellphone)->first();
        if ($user) {
            if ($user->unsubscribe == User::USER_UNSUBSCRIBE_YES) {
                return resReturn(0, '您的账号已注销，无法重新注册', Code::CODE_WRONG);
            }
            return resReturn(0, '手机号已被注册', Code::CODE_WRONG);
        }
        $redis = new RedisService();
        $code = $redis->get('code.register.' . $request->cellphone);
        if (!$code) {
            return resReturn(0, '验证码已失效，请重新获取', Code::CODE_MISUSE);
        }
        if ($code != $request->code) {
            return resReturn(0, '验证码错误', Code::CODE_MISUSE);
        }
        $return = DB::transaction(function () use ($request) {
            $addUser = new User();
            $addUser->name = $request->cellphone;
            $addUser->cellphone = $request->cellphone;
            $addUser->password = bcrypt($request->password);
            $addUser->api_token = hash('sha256', Str::random(60));
            $addUser->uuid = (string)Uuid::generate();
            $addUser->save();
            return [
                'result' => 'ok',
                'msg' => '成功'
            ];
        }, 5);
        if ($return['result'] == 'ok') {
            return resReturn(1, '注册成功');
        } else {
            return resReturn(0, '注册失败', Code::CODE_PARAMETER_WRONG);
        }
    }

    /**
     * FindPassword
     * 找回密码
     * @param Request $request
     * @return string
     * @queryParam  cellphone int 手机号
     * @queryParam  password string 密码
     * @queryParam  rPassword string 重复密码
     * @queryParam  code int 验证码
     */
    public function findPassword(Request $request)
    {
        if (!$request->has('cellphone')) {
            return resReturn(0, '手机号不能为空', Code::CODE_WRONG);
        }
        if (!$request->has('password')) {
            return resReturn(0, '新密码不能为空', Code::CODE_WRONG);
        }
        if (!$request->has('rPassword')) {
            return resReturn(0, '确认密码不能为空', Code::CODE_WRONG);
        }
        if ($request->password != $request->rPassword) {
            return resReturn(0, '确认密码和新密码不相同', Code::CODE_WRONG);
        }
        $redis = new RedisService();
        $code = $redis->get('code.register.' . $request->cellphone);
        if (!$code) {
            return resReturn(0, '验证码已失效，请重新获取', Code::CODE_MISUSE);
        }
        if ($code != $request->code) {
            return resReturn(0, '验证码错误', Code::CODE_MISUSE);
        }
        $user = User::where('cellphone', $request->cellphone)->first();
        $user->password = bcrypt($request->password);
        $user->save();
        return resReturn(1, '密码重置成功');
    }

    /**
     * 小程序换取openid
     * @param Request $request
     * @return string
     * @throws \Exception
     * @queryParam  platform string 平台标识
     * @queryParam  code string 平台标识
     */
    public function miniLogin(Request $request)
    {
        // 不支持的直接返回
        if (!in_array($request->platform, ['miniWeixin', 'miniAlipay', 'miniToutiao'])) {
            return resReturn(1, []);
        }
        $MiniProgram = new MiniProgram();
        $mini = $MiniProgram->mini($request->platform, $request->code);
        if ($mini['result'] == 'ok') {
            return resReturn(1, $mini);
        } else {
            return resReturn(0, $mini['msg'], Code::CODE_WRONG);
        }
    }
}
