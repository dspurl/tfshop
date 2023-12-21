<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Http\Controllers\v1\Client;

use App\Code;
use App\common\RedisService;
use App\Models\v1\MiniProgram;
use App\Models\v1\User;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Webpatser\Uuid\Uuid;

/**
 * @group [CLIENT]Login(登录)
 * Class LoginController
 * @package App\Http\Controllers\v1\Client
 */
class LoginController extends Controller
{
    use AuthenticatesUsers;
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
            return resReturn(0, __('hint.error.not_null', ['attribute' => __('user.cellphone')]), Code::CODE_WRONG);
        }
        if (!$request->has('password')) {
            return resReturn(0, __('hint.error.not_null', ['attribute' => __('user.password')]), Code::CODE_WRONG);
        }
        $user = User::where('cellphone', $request->cellphone)->first();
        if (!$user) {
            return resReturn(0, __('user.cellphone.error.unregistered'), Code::CODE_WRONG);
        }
        if ($user->unsubscribe == User::USER_UNSUBSCRIBE_YES) {
            return resReturn(0, __('user.cellphone.error.cancelled'), Code::CODE_WRONG);
        }
        if ($user->state == User::USER_STATE_FORBID) {
            return resReturn(0, __('user.cellphone.error.forbidden'), Code::CODE_WRONG);
        }
        if (!Hash::check($request->password, $user->password)) {
            return resReturn(0, __('hint.error.mistake', ['attribute' => __('user.password')]), Code::CODE_WRONG);
        }
        if (!$user->api_token) {
            $user->api_token = hash('sha256', Str::random(60));
        }
        $user->updated_at = Carbon::now()->toDateTimeString();
        $user->save();
        $client = new Client();
        $url = request()->root() . '/oauth/token';
        $params = array_merge(config('passport.web.proxy'), [
            'username' => $request->cellphone,
            'password' => $request->password,
        ]);
        $respond = $client->post($url, ['form_params' => $params]);
        $access_token = json_decode($respond->getBody()->getContents(), true);
        $access_token['refresh_expires_in'] = config('passport.refresh_expires_in') / 60 / 60 / 24;
        $access_token['nickname'] = $user->nickname;
        $access_token['cellphone'] = $user->cellphone;
        $access_token['wechat'] = $user->wechat;
        return resReturn(1, $access_token);
    }

    /**
     * token刷新
     * @param Request $request
     * @return string
     */
    public function refresh(Request $request)
    {
        $client = new Client();
        $url = request()->root() . '/oauth/token';
        $access_token = '';
        if ($request->refresh_token) {
            $params = array_merge(config('passport.web.refresh'), [
                'refresh_token' => $request->refresh_token,
            ]);
            $respond = $client->post($url, ['form_params' => $params]);
            $access_token = json_decode($respond->getBody()->getContents(), true);
        }
        return resReturn(1, $access_token);
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
        return resReturn(1, __('common.succeed'));
    }

    /**
     * Register/Login
     * 注册/登录
     * @param Request $request
     * @return string
     * @queryParam  cellphone int 手机号
     * @queryParam  code int 验证码
     */
    public function register(Request $request)
    {
        if (!$request->has('cellphone')) {
            return resReturn(0, __('hint.error.not_null', ['attribute' => __('user.cellphone')]), Code::CODE_WRONG);
        }
        $redis = new RedisService();
        $code = $redis->get('code.register.' . $request->cellphone);
        if (!$code) {
            return resReturn(0, __('user.email.error.lost_effectiveness'), Code::CODE_MISUSE);
        }
        if ($code != $request->code) {
            return resReturn(0, __('user.email_code.error'), Code::CODE_MISUSE);
        }
        // 没用用户就注册，有则登录
        $User = User::where('cellphone', $request->cellphone)->first();
        $client = new Client();
        $url = request()->root() . '/oauth/token';
        if (!$User) {
            $User = new User();
            $User->lang = $request->lang ?? App::getLocale();
            $User->name = $request->cellphone;
            $User->cellphone = $request->cellphone;
            $User->password = bcrypt($request->password);
            $User->uuid = (string) Uuid::generate();
            $User->save();
        } else {
            // 修改登录时间
            $User->updated_at = Carbon::now()->toDateTimeString();
            $User->save();
        }
        $params = array_merge(config('passport.web.proxy'), [
            'username' => $User->name,
            'password' => $User->password,
        ]);
        $respond = $client->post($url, ['form_params' => $params]);
        $access_token = json_decode($respond->getBody()->getContents(), true);
        $access_token['refresh_expires_in'] = config('passport.refresh_expires_in') / 60 / 60 / 24;
        $redis->del('code.register.' . $request->cellphone);
        return resReturn(1, $access_token);
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
            $platform = strtolower($request->platform);
            // 注册临时用户
            $User = User::where('platform', $platform)->where('openid', $mini['openid'])->first();
            $client = new Client();
            $url = request()->root() . '/oauth/token';
            if ($User) {
                // 修改登录时间
                $User->updated_at = Carbon::now()->toDateTimeString();
                $User->save();
            } else {
                $password = substr(MD5(time()), 5, 6);
                $User = new User();
                $User->lang = $request->lang ?? App::getLocale();
                $User->uuid = (string) Uuid::generate();
                $User->name = $User->uuid;
                $User->password = bcrypt($password);
                $User->platform = $platform;
                $User->openid = $mini['openid'];
                $User->save();
            }
            $params = array_merge(config('passport.web.proxy'), [
                'username' => $User->name,
                'password' => $User->password,
            ]);
            $respond = $client->post($url, ['form_params' => $params]);
            $access_token = json_decode($respond->getBody()->getContents(), true);
            $mini['refresh_expires_in'] = config('passport.refresh_expires_in') / 60 / 60 / 24;
            $mini['access_token'] = $access_token['access_token'];
            $mini['refresh_token'] = $access_token['refresh_token'];
            $mini['expires_in'] = $access_token['expires_in'];
            $mini['token_type'] = $access_token['token_type'];
            return resReturn(1, $mini);
        } else {
            return resReturn(0, $mini['msg'], Code::CODE_WRONG);
        }
    }
}
