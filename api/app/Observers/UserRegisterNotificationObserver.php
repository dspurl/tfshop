<?php

namespace App\Observers;

use App\common\RedisService;
use App\Models\v1\User;
use App\Notifications\Common;

/**
 * user register notification
 * 用户注册通知
 * Class UserRegisterNotificationObserver
 * @package App\Observers
 */
class UserRegisterNotificationObserver
{
    public function created(User $user)
    {
        $redis = new RedisService();
        $password = $redis->get('password.register.' . $user->id);
        if ($password) {  //授权登录时才会生成密码
            (new Common)->register([
                'phoneNumber' => $user->cellphone,  //手机号
                'password' => $password,  //密码
                'template' => 'registered_success',   //通知模板标识
                'user_id' => $user->id   //用户ID
            ]);
        }
    }
}
