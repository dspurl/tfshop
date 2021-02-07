<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Requests\v1\SubmitUserRequest;
use App\Models\v1\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @group member
 * 会员管理
 * Class MemberController
 * @package App\Http\Controllers\v1\Admin
 */
class MemberController extends Controller
{
    /**
     * MemberList
     * 会员列表
     * @param Request $request
     * @queryParam  title string 用户ID、用户名、手机号
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     * @queryParam  timeInterval string 注册时间区间
     * @return string
     */
    public function list(Request $request)
    {
        User::$withoutAppends = false;
        $q = User::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->state) {
            $q->where('state', $request->state);
        }
        if ($request->title) {
            $q->where('id', $request->title)->orWhere('cellphone', $request->title)->orWhere('name', 'like', '%' . $request->title . '%');
        }
        if ($request->timeInterval) {
            $timeInterval = explode("至", $request->timeInterval);
            $timeInterval[0] = $timeInterval[0] . ' 00:00:00';
            $timeInterval[1] = $timeInterval[1] . ' 23:59:59';
            $q->where('created_at', '>=', $timeInterval[0]);
            $q->where('created_at', '<=', $timeInterval[1]);
        }
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * MemberCreate
     * 创建会员
     * @param SubmitUserRequest $request
     * @queryParam  name string 用户名
     * @queryParam  cellphone string 手机号
     * @queryParam  nickname string 昵称
     * @queryParam  state string 状态
     * @queryParam  gender string 性别
     * @queryParam  password string 密码
     * @return string
     */
    public function create(SubmitUserRequest $request)
    {
        $User = new User();
        $User->name = $request->name;
        $User->cellphone = $request->cellphone;
        $User->nickname = $request->nickname;
        $User->state = $request->state;
        $User->gender = $request->gender;
        $User->password = bcrypt($request->password);
        $User->save();
        return resReturn(1, '添加成功');
    }

    /**
     * MemberEdit
     * 保存会员
     * @param $id
     * @param SubmitUserRequest $request
     * @queryParam  name string 用户名
     * @queryParam  cellphone string 手机号
     * @queryParam  nickname string 昵称
     * @queryParam  state string 状态
     * @queryParam  gender string 性别
     * @queryParam  password string 密码
     * @return string
     */
    public function edit($id, SubmitUserRequest $request)
    {
        $User = User::find($id);
        if ($request->password) {  //修改密码
            $User->password = bcrypt($request->password);
        }
        $User->name = $request->name;
        $User->state = $request->state;
        $User->cellphone = $request->cellphone;
        $User->nickname = $request->nickname;
        $User->gender = $request->gender;
        $User->save();
        return resReturn(1, '修改成功');
    }
}
