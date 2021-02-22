<?php

namespace App\Http\Controllers\v1\Client;

use App\Models\v1\Notification;
use App\Models\v1\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * notification
 * 通知
 * Class NoticeController
 * @package App\Http\Controllers\v1\Client
 */
class NotificationController extends Controller
{
    /**
     * NotificationList
     * 通知列表
     * @param Request $request
     * @return string
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        Notification::$withoutAppends = false;
        $q = Notification::query();
        $limit = $request->limit;
        $q->where('notifiable_id', auth('web')->user()->id);
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $paginate = $q->paginate($limit);
        // 标记为已读
        $user = User::find(auth('web')->user()->id);
        $user->unreadNotifications()->update(['read_at' => now()]);
        return resReturn(1, $paginate);
    }

    /**
     * NotificationUnread
     * 获取未读通知
     * @return string
     */
    public function unread()
    {
        $count = Notification::where('read_at', null)->where('notifiable_id', auth('web')->user()->id)->count();
        return resReturn(1, $count);
    }

    /**
     * NotificationDestroy
     * 删除通知
     * @param $id
     * @return string
     * @queryParam  id int 通知ID
     */
    public function destroy($id)
    {
        $user = User::find(auth('web')->user()->id);
        $user->notifications()->where('id', $id)->delete();
        return resReturn(1, '删除成功');
    }

}
