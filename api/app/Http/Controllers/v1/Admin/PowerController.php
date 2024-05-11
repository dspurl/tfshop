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
use App\Http\Requests\v1\SubmitPowerRequest;
use App\Models\v1\AuthGroupAuthRule;
use App\Models\v1\AuthRule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

/**
 * @group [ADMIN]Power(权限管理)
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
        /*$AuthRuleAll = AuthRule::where('pid', 0)->with(['children'])->get();
        function children($data, $pid=0){
            foreach ($data as $a){
                $AuthRule = new AuthRule();
                $AuthRule->title = $a->title;
                $AuthRule->url = $a->url;
                $AuthRule->icon = $a->icon;
                $AuthRule->sort = $a->sort;
                $AuthRule->api = $a->api;
                $AuthRule->pid = $pid;
                $AuthRule->state = $a->state;
                $AuthRule->lang = 'en';
                $AuthRule->lang_parent_id = $a->id;
                $AuthRule->save();
                if(isset($a->children)){
                    children($a->children, $AuthRule->id);
                }
            }
        }
        children($AuthRuleAll);*/


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
        $q->where('lang', App::getLocale());
        $q->with(['Language']);
        $paginate['data'] = $q->paginate($limit)->toArray();
        $paginate['options'] = AuthRule::where('pid', 0)->with(['children'])->get();
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
        $authRule->lang = $request->lang ?? App::getLocale();
        $authRule->lang_parent_id = $request->lang_parent_id ?? 0;
        $authRule->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.add')]));
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
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.amend')]));
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
                return resReturn(0, __('common.arguments'), Code::CODE_PARAMETER_WRONG);
            }
            $arr = (new AuthRule())->obtainAllChildPermissions($id);
            AuthRule::whereIn('id', $arr)->delete();
            AuthGroupAuthRule::whereIn('auth_rule_id', $arr)->delete();
        }, 5);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
    }
}
