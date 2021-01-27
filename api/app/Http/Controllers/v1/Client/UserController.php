<?php

namespace App\Http\Controllers\v1\Client;

use App\Code;
use App\common\RedisLock;
use App\Models\v1\GoodIndent;
use App\common\RedisService;
use App\Models\v1\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Webpatser\Uuid\Uuid;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     */
    public function index(Request $request)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        if(!$request->portrait && !$request->nickname){
            return resReturn(0,'参数有误',Code::CODE_PARAMETER_WRONG);
        }
        $redis = new RedisService();
        $lock=RedisLock::lock($redis,'dsShopUser');
        if($lock){
            $User=User::find(auth('web')->user()->id);
            if($request->portrait){
                $User->portrait = imgPathShift('user',$request->portrait);
            }
            if($request->nickname){
                $User->nickname = $request->nickname;
            }
            $User->save();
            RedisLock::unlock($redis,'dsShopUser');
            return resReturn(1,$User->portrait);
        }else{
            return resReturn(0,'业务繁忙，请稍后再试',Code::CODE_SYSTEM_BUSY);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function show(Request $request)
    {
        $redis = new RedisService();
        $lock=RedisLock::lock($redis,'dsShopUser');
        if($lock){
            User::$withoutAppends = false;
            $User=User::select('cellphone','nickname','portrait','money','uuid','email','notification','wechat')->find(auth('web')->user()->id);
            // 做uuid兼容
            if(!$User->uuid){
                $uuid=(string) Uuid::generate();
                User::where('id',auth('web')->user()->id)->update(['uuid' =>$uuid]);
                $User->uuid = $uuid;
            }
            RedisLock::unlock($redis,'dsShopUser');
            return resReturn(1,$User);
        }else{
            return resReturn(0,'业务繁忙，请稍后再试',Code::CODE_SYSTEM_BUSY);
        }

    }

    /**
     * 注销
     * @param Request $request
     * @return string
     */
    public function unsubscribe(Request $request){
        //判断订单是否在未完成的
        $GoodIndentCount=GoodIndent::where('user_id',auth('web')->user()->id)->where('state','!=',GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH)->count();
        if($GoodIndentCount>0){
            return resReturn(0,'您有未完成的业务，无法注销',Code::CODE_PARAMETER_WRONG);
        }
        User::where('id',auth('web')->user()->id)->update(['unsubscribe'=>User::USER_UNSUBSCRIBE_YES]);
        return resReturn(1,'注销成功');
    }

    /**
     * 更新接收通知状态
     * @param Request $request
     * @return string
     */
    public function userNotification(Request $request){
        if(!$request->notification){
            return resReturn(0,'参数有误',Code::CODE_MISUSE);
        }
        $User=User::find(auth('web')->user()->id);
        $User->notification=$request->notification;
        $User->save();
        return resReturn(1,'操作成功');
    }
}
