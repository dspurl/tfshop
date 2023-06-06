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
                    'title' => __('wechat_channel.registered_success.first'),
                    'list' => [
                        [
                            'keyword' => __('admin.name'),
                            'data' => $parameter['phoneNumber']
                        ],
                        [
                            'keyword' => __('observer.user_user_register_notification.invoice.password'),
                            'data' => $parameter['password'],
                            'copy' => true
                        ],
                        [
                            'keyword' => __('admin.cellphone'),
                            'data' => $parameter['phoneNumber']
                        ]
                    ],
                    'remark' => __('wechat_channel.registered_success.remark'),
                    'parameter' => $parameter,
                    'prefers' => ['database']
                ];
                $user = User::find($parameter['user_id']);
                $user->notify(new InvoicePaid($invoice));
            }
        }
    }
}
