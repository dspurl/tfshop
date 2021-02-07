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
 * 管理组管理
 * Class ManageController
 * @package App\Http\Controllers\v1\Admin
 */
class ManageController extends Controller
{
    /**
     * ManageList
     * 管理组列表
     * @param Request $request
     * @return string
     */
    public function list(Request $request)
    {
        $q = Admin::query();
        //查询管理员列表
        $group = $q->where('state', Admin::ADMIN_STATA_NORMAL)->get(['id', 'name']);
        $options = [];
        if ($group) {
            foreach ($group as $g) {
                $options[] = array(
                    'value' => $g->id,
                    'label' => $g->name
                );
            }
        }
        //查询API列表
        $auth_rule = AuthRule::orderBy('pid', 'asc')->orderBy('sort', 'asc')->orderBy('id')->get(['id', 'title', 'pid']);
        if ($auth_rule) {
            $auth_ruleArray = [];
            foreach ($auth_rule as $a) {
                $rule[$a->id] = $a->title;
                $auth_ruleArray[$a->id] = array(
                    'label' => $a->title,
                    'value' => $a->id,
                    'pid' => $a->pid,
                    'id' => $a->id
                );
                $fromData[] = array(
                    'label' => $a->title,
                    'value' => $a->id,
                    'pid' => $a->pid,
                    'id' => $a->id
                );
            }
        }
        //查询管理组列表
        $auth_groups = AuthGroup::with(['Admin' => function ($query) {
            $query->select('id', 'name');
        }, 'AuthRule' => function ($query) {
            $query->select('id', 'title', 'pid');
        }])->orderBy('id')->get(['id', 'roles', 'introduction'])->toArray();
        foreach ($auth_groups as $id => $a) {
            $toData = [];
            $a['rules'] = [];
            foreach ($a['admin'] as $groupname) {
                $auth_groups[$id]['groupname'][] = $groupname['name'];
                $auth_groups[$id]['group'][] = $groupname['id'];
                $auth_groups[$id]['oldGroupValue'][] = $groupname['id'];
                $auth_groups[$id]['oldGroup'][] = array(
                    'label' => $groupname['name'],
                    'value' => $groupname['id']
                );
            }
            foreach ($a['auth_rule'] as $rules) {
                $auth_groups[$id]['rules'][] = $a['rules'][] = $rules['id'];
                $auth_groups[$id]['power'][] = $rule[$rules['id']];
                //获取已选中数组
                $toData[$rules['id']] = $auth_ruleArray[$rules['id']];
            }

            //获取未选中的内容
            $fromDatas = [];
            foreach ($fromData as $s => $f) {
                if (!in_array($f['id'], $a['rules']) || !in_array($f['pid'], $a['rules'])) {
                    $fromDatas[] = $f;
                }
            }
            $auth_groups[$id]['fromData'] = unsetMultiKeys(array('value'), genTree($fromDatas, 'pid'));

            if ($auth_groups[$id]['fromData']) {
                foreach ($auth_groups[$id]['fromData'] as $s => $f) {

                    if (!array_key_exists('children', $f)) {
                        unset($auth_groups[$id]['fromData'][$s]);
                    }
                }
                $auth_groups[$id]['fromData'] = array_values($auth_groups[$id]['fromData']);
            }

            $auth_groups[$id]['toData'] = unsetMultiKeys(array('value'), genTree($toData, 'pid'));

            unset($auth_groups[$id]['users']);
        }
        $data['data'] = $auth_groups;
        $data['options'] = $options;
        $fromData = genTree($fromData, 'pid');
        $fromData = unsetMultiKeys(array('value'), $fromData);
        $data['fromData'] = $fromData;
        return resReturn(1, $data);
    }

    /**
     * ManageCreate
     * 创建管理组
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
     * ManageEdit
     * 保存管理组
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
     * ManageDestroy
     * 删除管理组
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
