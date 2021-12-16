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
        if ($request->has('all')) {
            $paginate = AuthGroup::get();
        } else {
            $q = AuthGroup::query();
            $limit = $request->limit;
            if ($request->has('keyword')) {
                $q->where('introduction', 'like', '%' . $request->keyword . '%');
            }
            if ($request->has('sort')) {
                $sortFormatConversion = sortFormatConversion($request->sort);
                $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
            }
            $paginate = $q->with(['AuthRule' => function ($q) {
                $q->where('type', '!=', AuthRule::AUTH_RULE_TYPE_MENU);
            }])->paginate($limit);
        }
        return resReturn(1, $paginate);
    }

    /**
     * RoleCreate
     * 创建角色
     * @param SubmitRoleRequest $request
     * @queryParam  roles string 别名
     * @queryParam  introduction string 角色名称
     * @return string
     */
    public function create(SubmitRoleRequest $request)
    {
        $AuthGroup = new AuthGroup;
        $AuthGroup->roles = $request->roles;
        $AuthGroup->introduction = $request->introduction;
        $AuthGroup->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.add')]));
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
        $AuthGroup = AuthGroup::find($id);
        $AuthGroup->roles = $request->roles;
        $AuthGroup->introduction = $request->introduction;
        $AuthGroup->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.amend')]));
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
        if (!$request->has('ids')) {
            throw new \Exception(__('hint.error.mistake', ['attribute' => __('requests.auth_group_auth_rule.ids')]), Code::CODE_WRONG);
        }
        AuthGroupAuthRule::where('auth_group_id', $id)->delete();
        // 如果子类有勾选，添加父类ID

        foreach ($request->ids as $ids) {
            $AuthGroupAuthRule = new AuthGroupAuthRule();
            $AuthGroupAuthRule->auth_group_id = $id;
            $AuthGroupAuthRule->auth_rule_id = $ids;
            $AuthGroupAuthRule->save();
        }
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.amend')]));
    }

    /**
     * RoleDestroy
     * 删除角色
     * @param $id
     * @queryParam  id int 管理组ID
     * @queryParam  ids array 管理组ID组
     * @return string
     */
    public function destroy($id, Request $request)
    {
        if ($id > 0) {
            AuthGroup::destroy($id);
        } else {
            if (!$request->has('ids')) {
                return resReturn(0, __('hint.error.select', ['attribute' => __('hint.common.content_delete')]), Code::CODE_WRONG);
            }
            AuthGroup::destroy($request->ids);
            AuthGroupAuthRule::whereIn('auth_group_id', $request->ids)->delete();
        }
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.delete')]));
    }
}
