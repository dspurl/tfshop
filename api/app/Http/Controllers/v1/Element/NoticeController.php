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
use App\Models\v1\Notification;
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

class NoticeController extends Controller
{
    /**
     * 通知列表
     *
     * @param Request $request
     * @return string
     */
    public function index(Request $request)
    {
        Notification::$withoutAppends = false;
        $q = Notification::query();
        $limit=$request->limit;
        $q->where('notifiable_id',auth('web')->user()->id);
        $q->orderBy('created_at', 'DESC');
        $paginate=$q->paginate($limit);
        // 标记为已读
        $user = User::find(auth('web')->user()->id);
        $user->unreadNotifications()->update(['read_at' => now()]);
        return resReturn(1,$paginate);
    }

    public function count(){
        $count = Notification::where('read_at',null)->where('notifiable_id',auth('web')->user()->id)->count();
        return resReturn(1,$count);
    }

    /**
     * 删除通知
     *
     * @param $id
     * @param Request $request
     */
    public function destroy($id, Request $request)
    {
        $user = User::find(auth('web')->user()->id);
        $user->notifications()->where('id',$id)->delete();
    }

}
