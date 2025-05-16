<?php

/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitAdminRequest;
use App\Models\v1\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\v1\AdminAuthGroup;

/**
 * @group [ADMIN]Admin(管理员管理)
 * Class AdminController
 * @package App\Http\Controllers\v1\Admin
 */
class AdminController extends Controller
{
    /**
     * AdminList
     * 管理员列表
     * @param Request $request
     * @return string
     * @throws \Exception
     * @queryParam  title string 管理员账号
     * @queryParam  authGroup string 管理组ID
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = Admin::query();
        $limit = $request->limit;
        if ($request->has('filter')) {
            $this->customFilterCriteria($q, $request->filter);
        } else {
            if ($request->has('sort')) {
                $sortFormatConversion = sortFormatConversion($request->sort);
                $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
            }
            if ($request->has('state')) {
                if ($request->state) {
                    $q->where('state', $request->state);
                }
            }
            if ($request->has('portrait')) {
                if ($request->portrait) {
                    $q->where('portrait', '!=', NULL);
                } else {
                    $q->where('portrait', NULL);
                }
            }
            if ($request->has('keyword')) {
                $q->where(function ($q1) use ($request) {
                    $q1->orWhere('name', 'like', "%$request->keyword%")
                        ->orWhere('real_name', 'like', "%$request->keyword%")
                        ->orWhere('cellphone', 'like', "%$request->keyword%");
                });
            }
            if ($request->has('groupId')) {
                if ($request->groupId) {
                    $q->whereHas('AuthGroup', function ($query) use ($request) {
                        $query->where('id', $request->groupId);
                    });
                }
            }
        }
        $paginate = $q->with('AuthGroup')->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * AdminCreate
     * 创建管理员
     * @param SubmitAdminRequest $request
     * @queryParam  real_name string 管理员昵称
     * @queryParam  name string 管理员账号
     * @queryParam  email string 邮箱地址
     * @queryParam  cellphone int 手机号
     * @queryParam  portrait string 头像地址
     * @queryParam  password string 密码
     * @queryParam  state int 状态
     * @return string
     */
    public function create(SubmitAdminRequest $request)
    {
        $Admin = new Admin;
        $Admin->name = $request->name;
        $Admin->real_name = $request->real_name ?? '';
        $Admin->email = $request->email ?? '';
        $Admin->cellphone = $request->cellphone ?? '';
        $Admin->portrait = $request->portrait ?? '';
        $Admin->password = bcrypt($request->password);
        $Admin->state = $request->state == Admin::ADMIN_STATA_NORMAL ? Admin::ADMIN_STATA_NORMAL : Admin::ADMIN_STATA_FORBID;
        $Admin->save();
        if ($request->has('auth_group')) {
            foreach ($request->auth_group as $authGroup) {
                $AdminAuthGroup = new AdminAuthGroup();
                $AdminAuthGroup->admin_id = $Admin->id;
                $AdminAuthGroup->auth_group_id = $authGroup;
                $AdminAuthGroup->save();
            }
        }
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.add')]));
    }

    /**
     * AdminEdit
     * 保存管理员
     * @param $id
     * @param SubmitAdminRequest $request
     * @queryParam  id int 管理员ID
     * @queryParam  name string 管理员账号
     * @queryParam  email string 邮箱地址
     * @queryParam  cellphone int 手机号
     * @queryParam  portrait string 头像地址
     * @queryParam  password string 密码
     * @queryParam  state int 状态
     * @return string
     */
    public function edit($id, SubmitAdminRequest $request)
    {
        $Admin = Admin::find($id);
        $Admin->real_name = $request->real_name ?? $Admin->real_name;
        $Admin->email = $request->email ?? $Admin->email;
        $Admin->cellphone = $request->cellphone ?? $Admin->cellphone;
        $Admin->portrait = $request->portrait ?? $Admin->portrait;
        if ($request->has('state')) {
            $Admin->state = $request->state == Admin::ADMIN_STATA_NORMAL ? Admin::ADMIN_STATA_NORMAL : Admin::ADMIN_STATA_FORBID;
        }
        $Admin->save();
        if ($request->has('auth_group')) {
            AdminAuthGroup::where('admin_id', $Admin->id)->delete();
            foreach ($request->auth_group as $authGroup) {
                $AdminAuthGroup = new AdminAuthGroup();
                $AdminAuthGroup->admin_id = $Admin->id;
                $AdminAuthGroup->auth_group_id = $authGroup;
                $AdminAuthGroup->save();
            }
        }
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.update')]));
    }

    /**
     * AdminDetail
     * 个人信息
     * @return \Illuminate\Http\Response
     */
    public function detail()
    {
        return resReturn(1, auth('api')->user());
    }

    /**
     * AdminPasswork
     * 修改管理员密码
     * @param $id
     * @param Request $request
     * @queryParam  id int 管理员ID
     * @queryParam  password string 新密码
     * @return string
     */
    public function password($id, Request $request)
    {
        if (!$request->has('password')) {
            return resReturn(0, __('hint.error.import', ['attribute' => __('find_password.password')]), Code::CODE_PARAMETER_WRONG);
        }
        $Admin = Admin::find($id);
        $Admin->password = bcrypt($request->password);
        $Admin->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.update')]));
    }

    /**
     * AdminDestroy
     * 删除管理员
     * @param $id
     * @queryParam  id int 管理员ID
     * @return string
     */
    public function destroy($id, Request $request)
    {
        if ($id > 0) {
            Admin::destroy($id);
            AdminAuthGroup::where('admin_id', $id)->delete();
        } else {
            if (!$request->has('ids')) {
                return resReturn(0, __('hint.error.selects', ['attribute' => __('common.operation_content')]), Code::CODE_WRONG);
            }
            Admin::destroy($request->ids);
            AdminAuthGroup::whereIn('admin_id', $request->ids)->delete();
        }
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
    }
}
