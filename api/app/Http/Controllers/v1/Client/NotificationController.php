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
        if (!$request->has('pc')) {
            // 标记为已读
            $user = User::find(auth('web')->user()->id);
            $user->unreadNotifications()->update(['read_at' => now()]);
        }
        return resReturn(1, $paginate);
    }

    /**
     * GoodIndentDetail
     * 通知详情
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 订单ID
     */
    public function detail($id)
    {
        $notification = auth('web')->user()->notifications()->find($id);
        auth('web')->user()->notifications()->where('id', $id)->update(['read_at' => now()]);
        return resReturn(1, $notification);
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
     * NotificationRead
     * 标记为已读
     * @param $id
     * @param Request $request
     * @return string
     * @queryParam  id int 通知ID
     */
    public function read($id, Request $request)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$id) {
            $idArr = [];
            foreach ($request->all() as $all) {
                $idArr[] = $all['id'];
            }
            $user->notifications()->whereIn('id', $idArr)->update(['read_at' => now()]);
        } else {
            $user->notifications()->where('id', $id)->update(['read_at' => now()]);
        }
        return resReturn(1, '标记已读成功');
    }

    /**
     * NotificationDestroy
     * 删除通知
     * @param $id
     * @param Request $request
     * @return string
     * @queryParam  id int 通知ID
     */
    public function destroy($id, Request $request)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$id) {
            $idArr = [];
            foreach ($request->all() as $all) {
                $idArr[] = $all['id'];
            }
            $user->notifications()->whereIn('id', $idArr)->delete();
        } else {
            $user->notifications()->where('id', $id)->delete();
        }
        return resReturn(1, '删除成功');
    }

}
