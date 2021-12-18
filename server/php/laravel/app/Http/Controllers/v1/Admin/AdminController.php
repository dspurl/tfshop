<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitAdminRequest;
use App\Models\v1\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\v1\AdminAuthGroup;

/**
 * @group admin
 * 管理员管理
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
        }
        $paginate = $q->with('AuthGroup')->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * AdminCreate
     * 创建管理员
     * @param SubmitAdminRequest $request
     * @queryParam  user_id int __('migrations.admin.user_id')
     * @queryParam  name string __('migrations.admin.name')
     * @queryParam  real_name string __('migrations.admin.real_name')
     * @queryParam  email string __('migrations.admin.email')
     * @queryParam  cellphone int __('migrations.admin.cellphone')
     * @queryParam  password string __('migrations.admin.password')
     * @queryParam  portrait int __('migrations.admin.portrait')
     * @queryParam  state int __('migrations.admin.state')
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
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.add')]));
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
     * @return string
     */
    public function edit($id, SubmitAdminRequest $request)
    {
        $Admin = Admin::find($id);
        $Admin->real_name = $request->real_name ?? '';
        $Admin->email = $request->email ?? '';
        $Admin->cellphone = $request->cellphone ?? '';
        $Admin->portrait = $request->portrait ?? '';
        $Admin->state = $request->state == Admin::ADMIN_STATA_NORMAL ? Admin::ADMIN_STATA_NORMAL : Admin::ADMIN_STATA_FORBID;
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
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.amend')]));
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
            return resReturn(0, __('hint.error.input', ['attribute' => __('requests.admin.password')]), Code::CODE_PARAMETER_WRONG);
        }
        $Admin = Admin::find($id);
        $Admin->password = bcrypt($request->password);
        $Admin->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.amend')]));
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
                return resReturn(0, __('hint.error.select', ['attribute' => __('hint.common.content_delete')]), Code::CODE_WRONG);
            }
            Admin::destroy($request->ids);
            AdminAuthGroup::whereIn('admin_id', $request->ids)->delete();
        }
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.delete')]));
    }
}
