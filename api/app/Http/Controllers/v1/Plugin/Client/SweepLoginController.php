<?php

namespace App\Http\Controllers\v1\Plugin\Client;

use App\Code;
use App\common\RedisService;
use App\Models\v1\User;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Webpatser\Uuid\Uuid;

/**
 * SweepLogin
 * 扫码登录
 * Class SweepLoginController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class SweepLoginController extends Controller
{
    /**
     * SweepLoginGenerateQrCode
     * 扫码登录生成二维码
     * @param RedisService $redis
     * @return string
     * @throws \Exception
     */
    public function code(RedisService $redis)
    {
        $uuid = (string)Uuid::generate();
        $return = [
            'code' => 'data:image/png;base64,' . base64_encode(QrCode::format('png')->margin(2)->size(300)->generate(request()->root() . '/sweepLogin?uuid=' . $uuid)),
            'expires_in' => config('sweepLogin.expiresIn'),
            'uuid' => $uuid,
        ];
        $redis->setex('code.sweep.login.' . $uuid, config('sweepLogin.expiresIn') + 2, json_encode([
            'type' => 'web',
            'state' => config('sweepLogin.state.no'),
            'user_id' => 0
        ]));
        return resReturn(1, $return);
    }

    /**
     * SweepLoginVerifyUuid
     * 扫码登录验证uuid
     * @param Request $request
     * @param RedisService $redis
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function verify(Request $request, RedisService $redis)
    {
        if (!$request->uuid) {
            throw new \Exception('非法操作', Code::CODE_MISUSE);
        }
        if ($data = $redis->get('code.sweep.login.' . $request->uuid)) {
            $data = json_decode($data, true);
            if ($data['type'] != 'web') {
                throw new \Exception('非法操作', Code::CODE_MISUSE);
            }
            return resReturn(1, [
                'state' => $data['state']
            ]);
        } else {
            return resReturn(1, [
                'state' => config('sweepLogin.state.expires')
            ]);
        }
    }

    /**
     * SweepLoginSuccess
     * 扫码登录扫码成功
     * @param Request $request
     * @param RedisService $redis
     * @return string
     * @throws \Exception
     */
    public function success(Request $request, RedisService $redis)
    {
        if (!$request->uuid) {
            throw new \Exception('非法操作', Code::CODE_MISUSE);
        }
        if ($data = $redis->get('code.sweep.login.' . $request->uuid)) {
            $data = json_decode($data, true);
            if ($data['type'] != 'web') {
                throw new \Exception('非法操作', Code::CODE_MISUSE);
            }
            // 第一次扫码触发
            if ($data['state'] === config('sweepLogin.state.no')) {
                $redis->setex('code.sweep.login.' . $request->uuid, $redis->TTL('code.sweep.login.' . $request->uuid), json_encode([
                    'type' => $data['type'],
                    'state' => config('sweepLogin.state.hasSweptCode'),
                    'user_id' => auth('web')->user()->id
                ]));
                return resReturn(1, [
                    'state' => 1,
                ]);
            } else if ($data['state'] === config('sweepLogin.state.hasSweptCode')) {  // 已被扫码
                if ($data['user_id'] === auth('web')->user()->id) {
                    return resReturn(1, [
                        'state' => 1,
                    ]);
                } else {
                    return resReturn(1, [
                        'state' => 2,
                    ]);
                }
            } else {
                return resReturn(1, [
                    'state' => 3,
                ]);
            }
        }
    }

    /**
     * SweepLoginAuthorization
     * 扫码授权
     * @param Request $request
     * @param RedisService $redis
     * @return string
     * @throws \Exception
     */
    public function authorization(Request $request, RedisService $redis)
    {
        if (!$request->uuid) {
            throw new \Exception('非法操作', Code::CODE_MISUSE);
        }
        if ($data = $redis->get('code.sweep.login.' . $request->uuid)) {
            $data = json_decode($data, true);
            if ($data['type'] != 'web') {
                throw new \Exception('非法操作', Code::CODE_MISUSE);
            }
            if ($data['state'] === config('sweepLogin.state.hasSweptCode')) {
                $redis->setex('code.sweep.login.' . $request->uuid, $redis->TTL('code.sweep.login.' . $request->uuid), json_encode([
                    'type' => $data['type'],
                    'state' => config('sweepLogin.state.granted'),
                    'user_id' => $data['user_id']
                ]));
                return resReturn(1, '授权成功');
            } else {
                throw new \Exception('扫码超时，请刷新后重新扫码', Code::CODE_SYSTEM_BUSY);
            }
        } else {
            throw new \Exception('扫码超时，请刷新后重新扫码', Code::CODE_SYSTEM_BUSY);
        }
    }

    /**
     * SweepLogin
     * 扫码登录
     * @param Request $request
     * @param RedisService $redis
     * @return string
     * @throws \Exception
     */
    public function index(Request $request, RedisService $redis)
    {
        if ($data = $redis->get('code.sweep.login.' . $request->uuid)) {
            $data = json_decode($data, true);
            if ($data['type'] != 'web') {
                throw new \Exception('非法操作', Code::CODE_MISUSE);
            }
            $User = User::find($data['user_id']);
            if (!$User) {
                throw new \Exception('账号不存在', Code::CODE_MISUSE);
            }
            $client = new Client();
            $url = request()->root() . '/oauth/token';
            $params = array_merge(config('passport.web.proxy'), [
                'username' => $User->name,
                'password' => $User->password,
            ]);
            $respond = $client->post($url, ['form_params' => $params]);
            $access_token = json_decode($respond->getBody()->getContents(), true);
            $access_token['refresh_expires_in'] = config('passport.refresh_expires_in') / 60 / 60 / 24;
            $access_token['nickname'] = $User->nickname;
            $access_token['cellphone'] = $User->cellphone;
            $access_token['portrait'] = $User->portrait;
            $access_token['wechat'] = $User->wechat;
            $redis->del('code.sweep.login.' . $request->uuid);
            return resReturn(1, $access_token);
        } else {
            throw new \Exception('扫码超时，请刷新后重新扫码', Code::CODE_SYSTEM_BUSY);
        }
    }
}
