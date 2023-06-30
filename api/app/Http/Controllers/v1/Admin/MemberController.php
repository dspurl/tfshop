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
namespace App\Http\Controllers\v1\Admin;

use App\Exports\v1\MemberExport;
use App\Http\Requests\v1\SubmitUserRequest;
use App\Models\v1\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

/**
 * @group [ADMIN]Member(会员管理)
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
            $timeInterval[0] = $request->timeInterval[0] . ' 00:00:00';
            $timeInterval[1] = $request->timeInterval[1] . ' 23:59:59';
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
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.add')]));
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
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.amend')]));
    }

    /**
     * MemberExport
     * 会员导出
     * @param Request $request
     * @return string
     */
    public function export(Request $request)
    {
        $date = date('Ymd');
        $title = __('user.list');
        $name = "temporary/$title$date.xlsx";
        $list = [];
        User::$withoutAppends = false;
        $q = User::query();
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
            $timeInterval[0] = $request->timeInterval[0] . ' 00:00:00';
            $timeInterval[1] = $request->timeInterval[1] . ' 23:59:59';
            $q->where('created_at', '>=', $timeInterval[0]);
            $q->where('created_at', '<=', $timeInterval[1]);
        }
        $paginate = $q->get();
        foreach ($paginate as $p){
            $config[$p->type][] = '';
            $list[$p->type][]=[
                'id'=> $p->id,
                'name'=> $p->name,
                'nickname'=> $p->nickname,
                'cellphone'=> $p->cellphone,
                'gender'=> $p->gender_show,
                'money'=> $p->money,
                'state'=> $p->state_show,
                'created_at'=> $p->created_at,
                'updated_at'=> $p->updated_at,
            ];
        }
        Excel::store(new MemberExport($list, $config, $title), "public/" . $name);
        return resReturn(1, request()->root() . '/storage/' . $name);
    }
}
