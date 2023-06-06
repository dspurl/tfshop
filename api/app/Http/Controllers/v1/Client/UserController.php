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
use App\common\RedisLock;
use App\Models\v1\GoodIndent;
use App\common\RedisService;
use App\Models\v1\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Webpatser\Uuid\Uuid;

/**
 * @group [CLIENT]User(用户)
 * Class UserController
 * @package App\Http\Controllers\v1\Client
 */
class UserController extends Controller
{
    /**
     * UserDetail
     * 用户信息
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function detail()
    {
        $redis = new RedisService();
        $lock = RedisLock::lock($redis, 'dsShopUser');
        User::$withoutAppends = false;
        $User = User::select('cellphone', 'nickname', 'portrait', 'money', 'uuid', 'email', 'notification', 'wechat')->find(auth('web')->user()->id);
        // 做uuid兼容
        if (!$User->uuid) {
            if ($lock) {
                $uuid = (string)Uuid::generate();
                User::where('id', auth('web')->user()->id)->update(['uuid' => $uuid]);
                $User->uuid = $uuid;
                RedisLock::unlock($redis, 'dsShopUser');
            } else {
                return resReturn(0, __('common.busy'), Code::CODE_SYSTEM_BUSY);
            }
        }
        return resReturn(1, $User);


    }

    /**
     * UserEdit
     * 保存用户信息
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  portrait string 头像
     * @queryParam  nickname string 昵称
     */
    public function edit(Request $request)
    {
        if (!$request->portrait && !$request->nickname) {
            return resReturn(0, __('common.arguments'), Code::CODE_PARAMETER_WRONG);
        }
        $redis = new RedisService();
        $lock = RedisLock::lock($redis, 'dsShopUser');
        if ($lock) {
            $User = User::find(auth('web')->user()->id);
            if ($request->portrait) {
                $User->portrait = imgPathShift('user', $request->portrait);
            }
            if ($request->nickname) {
                $User->nickname = $request->nickname;
            }
            $User->save();
            RedisLock::unlock($redis, 'dsShopUser');
            return resReturn(1, $User->portrait);
        } else {
            return resReturn(0, __('common.busy'), Code::CODE_SYSTEM_BUSY);
        }
    }

    /**
     * UserCancel
     * 注销账号
     * @return string
     */
    public function cancel()
    {
        //判断订单是否在未完成的
        $GoodIndentCount = GoodIndent::where('user_id', auth('web')->user()->id)->where('state', '!=', GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH)->count();
        if ($GoodIndentCount > 0) {
            return resReturn(0, __('user.state.error.unable_out'), Code::CODE_PARAMETER_WRONG);
        }
        User::where('id', auth('web')->user()->id)->update(['unsubscribe' => User::USER_UNSUBSCRIBE_YES]);
        return resReturn(1, __('common.succeed'));
    }

    /**
     * 更新接收通知状态
     * @param Request $request
     * @return string
     */
    public function notification(Request $request)
    {
        if (!$request->notification) {
            return resReturn(0, __('common.arguments'), Code::CODE_MISUSE);
        }
        $User = User::find(auth('web')->user()->id);
        $User->notification = $request->notification;
        $User->save();
        return resReturn(1, __('common.succeed'));
    }
}
