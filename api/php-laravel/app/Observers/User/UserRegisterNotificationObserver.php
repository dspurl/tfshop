<?php

namespace App\Observers\User;

use App\common\RedisService;
use App\Models\v1\User;
use App\Notifications\InvoicePaid;
use Illuminate\Http\Request;

/**
 * user register notification
 * 用户注册通知
 * Class UserRegisterNotificationObserver
 * @package App\Observers\User
 */
class UserRegisterNotificationObserver
{
    protected $request;
    protected $route = [
        'app/register',
        'app/authorization'
    ];
    protected $execute = false;

    public function __construct(Request $request)
    {
        if (!app()->runningInConsole()) {
            $this->request = $request;
            $path = explode("admin", $request->path());
            if (count($path) == 2) {
                $name = 'admin' . $path[1];
            } else {
                $path = explode("app", $request->path());
                $name = 'app' . $path[1];
            }
            if (collect($this->route)->contains($name)) {
                $this->execute = true;
            }
        }
    }

    public function created(User $user)
    {
        if ($this->execute || app()->runningInConsole()) {
            $redis = new RedisService();
            $password = $redis->get('password.register.' . $user->cellphone);
            if ($password) {  //授权登录时才会生成密码
                $parameter = [
                    'phoneNumber' => $user->cellphone,  //手机号
                    'password' => $password,  //密码
                    'template' => 'registered_success',   //通知模板标识
                    'user_id' => $user->id   //用户ID
                ];
                $invoice = [
                    'type' => InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
                    'title' => '您好，恭喜您成功注帐号。',
                    'list' => [
                        [
                            'keyword' => '账号',
                            'data' => $parameter['phoneNumber']
                        ],
                        [
                            'keyword' => '初始密码',
                            'data' => $parameter['password'],
                            'copy' => true
                        ],
                        [
                            'keyword' => '手机',
                            'data' => $parameter['phoneNumber']
                        ]
                    ],
                    'remark' => '您第一次授权登录我们平台，我们将为您生成初始密码，请妥善保管',
                    'parameter' => $parameter,
                    'prefers' => ['database']
                ];
                $user = User::find($parameter['user_id']);
                $user->notify(new InvoicePaid($invoice));
            }
        }
    }
}
