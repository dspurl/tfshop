<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitManageRequest;
use App\Models\v1\Admin;
use App\Models\v1\AuthGroup;
use App\Models\v1\AuthRule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * @group manage
 * 角色管理
 * Class RoleController
 * @package App\Http\Controllers\v1\Admin
 */
class RoleController extends Controller
{
    /**
     * ManageList
     * 角色列表
     * @param Request $request
     * @return string
     * @queryParam  title string 关键字
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = AuthGroup::query();
        $limit = $request->limit;
        if ($request->title) {
            $q->where('introduction', 'like', '%' . $request->title . '%');
        }
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * RoleCreate
     * 创建角色
     * @param SubmitManageRequest $request
     * @queryParam  roles array 权限
     * @queryParam  introduction string 角色名称
     * @queryParam  group array 管理员
     * @return string
     */
    public function create(SubmitManageRequest $request)
    {
        DB::transaction(function () use ($request) {
            $authGroup = new AuthGroup;
            $authGroup->roles = $request->roles;
            $authGroup->introduction = $request->introduction;
            $rules = $authGroup->returnRulesData($request->rules);
            $authGroup->save();
            //关联表操作

            if (count($rules) > 0) {
                foreach ($rules as $id => $r) {
                    $data[] = array(
                        'auth_rule_id' => $r,
                        'auth_group_id' => $authGroup->id,
                    );
                }
                DB::table('auth_group_auth_rules')->insert($data);
                unset($data);
            }
            if (count($request->group) > 0) {
                foreach ($request->group as $id => $group) {
                    $data[] = array(
                        'admin_id' => $group,
                        'auth_group_id' => $authGroup->id,
                    );
                }
                DB::table('admin_auth_group')->insert($data);
                unset($data);
            }

        }, 5);
        return resReturn(1, '添加成功');
    }

    /**
     * RoleEdit
     * 保存角色
     * @param SubmitManageRequest $request
     * @queryParam  id int 管理组ID
     * @queryParam  roles array 权限
     * @queryParam  introduction string 角色名称
     * @queryParam  group array 管理员
     * @return string
     */
    public function edit($id,SubmitManageRequest $request)
    {
        $authGroup = AuthGroup::find($id);
        DB::transaction(function () use ($request, $authGroup) {
            $authGroup->roles = $request->roles;
            $authGroup->introduction = $request->introduction;
            if (!is_numeric($request->rules[0])) {
                $rules = $authGroup->returnRulesData($request->rules);
            } else {
                $rules = $request->rules;
            }

            $authGroup->save();
            //修改中间表
            DB::table('auth_group_auth_rules')->where('auth_group_id', $authGroup->id)->delete();
            if ($rules) {
                foreach ($rules as $id => $r) {
                    $data[] = array(
                        'auth_rule_id' => $r,
                        'auth_group_id' => $authGroup->id,
                    );
                }
                DB::table('auth_group_auth_rules')->insert($data);
                unset($data);
            }

            DB::table('admin_auth_group')->where('auth_group_id', $authGroup->id)->delete();
            if ($request->group) {
                foreach ($request->group as $id => $group) {
                    $data[] = array(
                        'admin_id' => $group,
                        'auth_group_id' => $authGroup->id,
                    );
                }
                DB::table('admin_auth_group')->insert($data);
                unset($data);
            }
        }, 5);
        return resReturn(1, '修改成功');
    }

    /**
     * RoleDestroy
     * 删除角色
     * @param $id
     * @queryParam  id int 管理组ID
     * @return string
     */
    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            if (!$id) {
                return resReturn(0, '参数错误', Code::CODE_PARAMETER_WRONG);
            }
            $authGroup = AuthGroup::find($id);
            $authGroup->delete();
            DB::table('auth_group_auth_rules')->where('auth_group_id', $authGroup->id)->delete();
            DB::table('admin_auth_group')->where('auth_group_id', $authGroup->id)->delete();
        }, 5);
        return resReturn(1, '删除成功');
    }
}
