<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitPowerRequest;
use App\Models\v1\AuthGroupAuthRule;
use App\Models\v1\AuthRule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * @group power
 * 权限管理
 * Class PowerController
 * @package App\Http\Controllers\v1\Admin
 */
class PowerController extends Controller
{
    /**
     * PowerList
     * 权限管理
     * @param Request $request
     * @queryParam limit int 每页显示条数
     * @queryParam page string 页码
     * @queryParam pid int 分组ID
     * @queryParam title string ID、权限名称、API名称
     * @return string
     */
    public function list(Request $request)
    {
        $q = AuthRule::query();
        $limit = $request->limit;
        $q->orderBy('pid', 'asc');
        $q->orderBy('sort', 'asc');
        $q->orderBy('id', 'asc');
        if ($request->title) {
            $q->where('id', $request->title)->orWhere('title', 'like', '%' . $request->title . '%')->orWhere('api', 'like', '%' . $request->title . '%');
        }
        if (isset($request->pid)) {
            $q->where('pid', collect($request->pid)->last());
        }
        $paginate = $q->paginate($limit)->toArray();
        $array = AuthRule::with(['AuthGroup'])->get()->toArray();
        if ($array) {
            foreach ($array as $id => $a) {
                $grouping[$a['id']] = $a['title'];
                $options[] = array(
                    'value' => $a['id'],
                    'label' => $a['title'],
                    'pid' => $a['pid'],
                    'id' => $a['id']
                );
            }
        }
        foreach ($paginate['data'] as $id => $d) {
            $paginate['data'][$id]['pid'] = getParentClassHierarchy($d['pid'], $options);
            if (count($paginate['data'][$id]['pid']) < 1) {
                $paginate['data'][$id]['pid'] = [0];
            }
        }

        $paginate['options'] = collect(genTree($options, 'pid'))->prepend(array(
            'value' => 0,
            'label' => '顶级分组'
        ));
        return resReturn(1, $paginate);
    }

    /**
     * PowerCreate
     * 创建权限
     * @param SubmitPowerRequest $request
     * @queryParam  title string 权限名称
     * @queryParam  url string 外链
     * @queryParam  icon string 图标
     * @queryParam  sort string 排序
     * @queryParam  api string API
     * @queryParam  pid int 权限组ID
     * @queryParam  state int 显示在菜单栏：1是0否
     * @return string
     */
    public function create(SubmitPowerRequest $request)
    {
        $authRule = new AuthRule;
        $authRule->title = $request->title;
        $authRule->url = $request->url ? $request->url : '';
        $authRule->icon = $request->icon ? $request->icon : '';
        $authRule->sort = $request->sort ? $request->sort : 0;
        $authRule->api = $request->api;
        $pid = collect($request->pid)->last();
        $authRule->pid = $pid > 0 ? $pid : 0;
        $authRule->state = $request->state;
        $authRule->save();
        return resReturn(1, '添加成功');
    }

    /**
     * PowerEdit
     * 保存权限
     * @param $id
     * @param SubmitPowerRequest $request
     * @return string
     * @queryParam  id int 权限ID
     * @queryParam  title string 权限名称
     * @queryParam  url string 外链
     * @queryParam  icon string 图标
     * @queryParam  sort string 排序
     * @queryParam  api string API
     * @queryParam  pid int 权限组ID
     * @queryParam  state int 显示在菜单栏：1是0否
     */
    public function edit($id, SubmitPowerRequest $request)
    {
        $authRule = AuthRule::find($id);
        $authRule->title = $request->title;
        $authRule->api = $request->api;
        $pid = collect($request->pid)->last();
        $authRule->pid = $pid > 0 ? $pid : 0;
        $authRule->url = $request->url ? $request->url : '';
        $authRule->icon = $request->icon ? $request->icon : '';
        $authRule->sort = $request->sort ? $request->sort : 0;
        $authRule->state = $request->state;
        $authRule->save();
        return resReturn(1, '修改成功');
    }

    /**
     * PowerDestroy
     * 删除权限
     * @param $id
     * @return string
     */
    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            if (!$id) {
                return resReturn(0, '参数错误', Code::CODE_PARAMETER_WRONG);
            }
            $authRule = AuthRule::find($id);
            $authRule->delete();
            AuthGroupAuthRule::where('auth_rule_id', $id)->delete();
        }, 5);
        return resReturn(1, '删除成功');
    }
}
