<?php

namespace App\Http\Controllers\v1\Element;

use App\Code;
use App\common\RedisLock;
use App\Http\Requests\v1\SubmitLiveCodeRequest;
use App\Models\v1\Common;
use App\Models\v1\ApplyUser;
use App\Models\v1\LiveCode;
use App\Models\v1\LiveCodeLog;
use App\Models\v1\LiveThirdCode;
use App\Models\v1\User;
use EasyWeChat\Kernel\Http\StreamResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use EasyWeChat\Factory;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

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
        $redis = Redis::connection('default');
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
     */
    public function show(Request $request)
    {
        $redis = Redis::connection('default');
        $lock=RedisLock::lock($redis,'dsShopUser');
        if($lock){
            User::$withoutAppends = false;
            $User=User::select('cellphone','nickname','portrait','money')->find(auth('web')->user()->id);
            RedisLock::unlock($redis,'dsShopUser');
            return resReturn(1,$User);
        }else{
            return resReturn(0,'业务繁忙，请稍后再试',Code::CODE_SYSTEM_BUSY);
        }

    }
}
