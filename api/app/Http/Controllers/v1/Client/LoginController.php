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
use App\Models\v1\UserPlatform;
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
        $User = User::where('cellphone', $request->cellphone)->first();
        if ($User) {
            if ($User->unsubscribe == User::USER_UNSUBSCRIBE_YES) {
                return resReturn(0, __('user.cellphone.error.cancelled'), Code::CODE_WRONG);
            }
        }
        $redis = new RedisService();
        $code = $redis->get('code.register.' . $request->cellphone);
        if (!$code) {
            return resReturn(0, __('user.email.error.lost_effectiveness'), Code::CODE_MISUSE);
        }
        if ($code != $request->code) {
            return resReturn(0, __('user.email_code.error'), Code::CODE_MISUSE);
        }
        $password = substr(MD5(time()), 5, 6);
        // 小程序手机号登录
        if ($request->has('login_code')) {
            if (!in_array($request->platform, ['miniWeixin', 'miniAlipay', 'miniToutiao'])) {
                return resReturn(1, []);
            }
            $MiniProgram = new MiniProgram();
            $mini = $MiniProgram->mini($request->platform, $request->login_code);
            if ($mini['result'] == 'ok') {
                $platform = strtolower($request->platform);
                // 注册临时用户
                $UserPlatform = UserPlatform::where('platform', $platform)->where('openid', $mini['openid'])->first();
                if ($UserPlatform) {
                    // 如果第三方账号已存在，用户也已经注册，则将用户同步到第三方账号（第一次第三方账号创建的用户将失效）
                    if ($User) {
                        $UserPlatform->user_id = $User->id;
                        $UserPlatform->save();
                    }
                    // 修改登录时间
                    $User = User::find($UserPlatform->user_id);
                    $User->updated_at = Carbon::now()->toDateTimeString();
                    $User->save();
                } else {
                    // 如果手机号未注册，则注册第三方账号和用户
                    if (!$User) {
                        $User = new User();
                        $User->lang = $request->lang ?? App::getLocale();
                        $User->uuid = (string) Uuid::generate();
                        $User->name = $User->uuid;
                        $User->password = bcrypt($password);
                        $User->save();
                    }
                    $UserPlatform = new UserPlatform();
                    $UserPlatform->lang = $request->lang ?? App::getLocale();
                    $UserPlatform->user_id = $User->id;
                    $UserPlatform->platform = $platform;
                    $UserPlatform->openid = $mini['openid'];
                    $UserPlatform->save();
                }
            } else {
                throw new \Exception($mini['msg'], Code::CODE_WRONG);
            }
        } else {
            // 非小程序登录
            if ($User) {
                $User->updated_at = Carbon::now()->toDateTimeString();
                $User->save();
            } else {
                $User = new User();
                $User->lang = $request->lang ?? App::getLocale();
                $User->uuid = (string) Uuid::generate();
                $User->name = $User->uuid;
                $User->cellphone = $request->cellphone;
                $User->password = bcrypt($password);
                $User->save();
            }
        }
        // 获取登录密钥
        $client = new Client();
        $url = request()->root() . '/oauth/token';
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
        $redis->del('code.register.' . $request->cellphone);
        return resReturn(1, $mini);
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
            $UserPlatform = UserPlatform::where('platform', $platform)->where('openid', $mini['openid'])->first();
            $client = new Client();
            $url = request()->root() . '/oauth/token';
            if ($UserPlatform) {
                // 修改登录时间
                $User = User::find($UserPlatform->user_id);
                $User->updated_at = Carbon::now()->toDateTimeString();
                $User->save();
            } else {
                // 授权登录，如果没有注册过，直接注册用户及第三方账号
                $password = substr(MD5(time()), 5, 6);
                $User = new User();
                $User->lang = $request->lang ?? App::getLocale();
                $User->uuid = (string) Uuid::generate();
                $User->name = $User->uuid;
                $User->password = bcrypt($password);
                $User->save();
                $UserPlatform = new UserPlatform();
                $UserPlatform->lang = $request->lang ?? App::getLocale();
                $UserPlatform->user_id = $User->id;
                $UserPlatform->platform = $platform;
                $UserPlatform->openid = $mini['openid'];
                $UserPlatform->save();
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
