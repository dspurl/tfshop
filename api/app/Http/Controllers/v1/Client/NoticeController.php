<?php

namespace App\Http\Controllers\v1\Client;

use App\Models\v1\Notification;
use App\Models\v1\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
