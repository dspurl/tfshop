<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitRoleRequest;
use App\Models\v1\AuthGroup;
use App\Models\v1\AuthGroupAuthRule;
use App\Models\v1\AuthRule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
     * @queryParam  keyword string 关键字
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = AuthGroup::query();
        $limit = $request->limit;
        if ($request->has('keyword')) {
            $q->where('introduction', 'like', '%' . $request->keyword . '%');
        }
        $paginate = $q->with(['AuthRule'=>function($q){
            $q->where('type','!=',AuthRule::AUTH_RULE_TYPE_MENU);
        }])->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * RoleCreate
     * 创建角色
     * @param SubmitRoleRequest $request
     * @queryParam  roles array 别名
     * @queryParam  introduction string 角色名称
     * @return string
     */
    public function create(SubmitRoleRequest $request)
    {
        $authGroup = new AuthGroup;
        $authGroup->roles = $request->roles;
        $authGroup->introduction = $request->introduction;
        $authGroup->save();
        return resReturn(1, '添加成功');
    }

    /**
     * RoleEdit
     * 保存角色
     * @param SubmitRoleRequest $request
     * @queryParam  id int 角色ID
     * @queryParam  introduction string 角色名称
     * @queryParam  roles array 别名
     * @return string
     */
    public function edit($id, SubmitRoleRequest $request)
    {
        $authGroup = AuthGroup::find($id);
        $authGroup->roles = $request->roles;
        $authGroup->introduction = $request->introduction;
        $authGroup->save();
        return resReturn(1, '修改成功');
    }

    /**
     * RoleEdit
     * 编辑权限
     * @param $id
     * @param Request $request
     * @return string
     * @throws \Exception
     * @queryParam  id int 角色ID
     * @queryParam  ids array 权限ID组
     */
    public function permission($id, Request $request)
    {
        if(!$request->has('ids')){
            throw new \Exception('权限ID有误', Code::CODE_WRONG);
        }
        AuthGroupAuthRule::where('auth_group_id', $id)->delete();
        // 如果子类有勾选，添加父类ID

        foreach ($request->ids as $ids){
            $AuthGroupAuthRule = new AuthGroupAuthRule();
            $AuthGroupAuthRule->auth_group_id = $id;
            $AuthGroupAuthRule->auth_rule_id = $ids;
            $AuthGroupAuthRule->save();
        }
        return resReturn(1, '修改成功');
    }

    /**
     * RoleDestroy
     * 删除角色
     * @param $id
     * @queryParam  id int 管理组ID
     * @return string
     */
    public function destroy($id, Request $request)
    {
        if ($id > 0) {
            AuthGroup::destroy($id);
        } else {
            if (!$request->has('ids')) {
                return resReturn(0, '请选择内容', Code::CODE_WRONG);
            }
            AuthGroup::destroy($request->ids);
            AuthGroupAuthRule::whereIn('auth_group_id',$request->ids)->delete();
        }
        return resReturn(1, '删除成功');
    }
}
