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
     * @return string
     */
    public function list(Request $request)
    {
        $AuthRule = AuthRule::where('pid', 0)->with(['children'])->orderBy('sort', 'ASC')->get();
        return resReturn(1, $AuthRule);
    }

    /**
     * PowerCreate
     * 创建权限
     * @param SubmitPowerRequest $request
     * @queryParam  title string 权限名称
     * @queryParam  api string 别名
     * @queryParam  path string 路由
     * @queryParam  active string 菜单高亮
     * @queryParam  redirect_url string 重定向
     * @queryParam  view string 视图
     * @queryParam  icon string 图标
     * @queryParam  color string 颜色值
     * @queryParam  pid int 父ID
     * @queryParam  type int 类型:1=菜单-menu,2=iframe-iframe,3=外链-link
     * @queryParam  is_hidden int 是否在菜单隐藏:1=是-yes,0=否-no
     * @queryParam  is_hidden_breadcrumb int 是否隐藏面包屑:1=是-yes,0=否-no
     * @queryParam  is_affix int 是否固定:1=是-yes,0=否-no
     * @queryParam  is_full_page int 是否整页打开路由:1=是-yes,0=否-no
     * @queryParam  sort int 排序
     * @return string
     */
    public function create(SubmitPowerRequest $request)
    {
        $sort = AuthRule::where('pid', $request->pid)->count();
        $AuthRule = new AuthRule;
        $AuthRule->title = $request->title;
        $AuthRule->api = '';
        $AuthRule->path = '';
        $AuthRule->active = '';
        $AuthRule->redirect_url = '';
        $AuthRule->view = '';
        $AuthRule->icon = '';
        $AuthRule->color = '';
        $AuthRule->pid = $request->pid;
        $AuthRule->type = $request->type;
        $AuthRule->is_hidden = AuthRule::AUTH_RULE_IS_HIDDEN_NO;
        $AuthRule->is_hidden_breadcrumb = AuthRule::AUTH_RULE_IS_HIDDEN_BREADCRUMB_NO;
        $AuthRule->is_affix = AuthRule::AUTH_RULE_IS_AFFIX_NO;
        $AuthRule->is_full_page = AuthRule::AUTH_RULE_IS_FULL_PAGE_NO;
        $AuthRule->sort = $sort + 1;
        $AuthRule->save();
        return resReturn(1, $AuthRule);
    }

    /**
     * PowerEdit
     * 保存权限
     * @param $id
     * @param SubmitPowerRequest $request
     * @return string
     * @queryParam  id int 权限ID
     * @queryParam  title string 权限名称
     * @queryParam  api string 别名
     * @queryParam  path string 路由
     * @queryParam  active string 菜单高亮
     * @queryParam  redirect_url string 重定向
     * @queryParam  view string 视图
     * @queryParam  icon string 图标
     * @queryParam  color string 颜色值
     * @queryParam  pid int 父ID
     * @queryParam  type int 类型:1=菜单-menu,2=iframe-iframe,3=外链-link
     * @queryParam  is_hidden int 是否在菜单隐藏:1=是-yes,0=否-no
     * @queryParam  is_hidden_breadcrumb int 是否隐藏面包屑:1=是-yes,0=否-no
     * @queryParam  is_affix int 是否固定:1=是-yes,0=否-no
     * @queryParam  is_full_page int 是否整页打开路由:1=是-yes,0=否-no
     * @queryParam  sort int 排序
     */
    public function edit($id, SubmitPowerRequest $request)
    {
        $AuthRule = AuthRule::find($id);
        $AuthRule->title = $request->title;
        $AuthRule->api = $request->api ?? '';
        $AuthRule->path = $request->path ?? '';
        $AuthRule->pid = $request->pid;
        $AuthRule->active = $request->active ?? '';
        $AuthRule->redirect_url = $request->redirect_url ?? '';
        $AuthRule->view = $request->view ?? '';
        $AuthRule->icon = $request->icon ?? '';
        $AuthRule->color = $request->color ?? '';
        $AuthRule->type = $request->type;
        $AuthRule->is_hidden = $request->is_hidden ? AuthRule::AUTH_RULE_IS_HIDDEN_YES : AuthRule::AUTH_RULE_IS_HIDDEN_NO;
        $AuthRule->is_hidden_breadcrumb = $request->is_hidden_breadcrumb ? AuthRule::AUTH_RULE_IS_HIDDEN_BREADCRUMB_YES : AuthRule::AUTH_RULE_IS_HIDDEN_BREADCRUMB_NO;
        $AuthRule->is_affix = $request->is_affixn ? AuthRule::AUTH_RULE_IS_AFFIX_YES : AuthRule::AUTH_RULE_IS_AFFIX_NO;
        $AuthRule->is_full_page = $request->is_full_pagen ? AuthRule::AUTH_RULE_IS_FULL_PAGE_YES : AuthRule::AUTH_RULE_IS_FULL_PAGE_NO;
        $AuthRule->sort = $request->sort;
        $AuthRule->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.amend')]));
    }

    /**
     * PowerSort
     * 权限排序
     * @param Request $request
     * @return string
     * @throws \Exception
     * @queryParam  draggingNode array 拖拽对象
     * @queryParam  dropNode array 释放对象
     * @queryParam  dropType string 释放对象的位置
     */
    public function sort(Request $request)
    {
        if (!$request->has('draggingNode')) {
            throw new \Exception(__('hint.error.mistake', ['attribute' => __('requests.power.dragging_node')]), Code::CODE_WRONG);
        }
        if (!$request->has('dropNode')) {
            throw new \Exception(__('hint.error.mistake', ['attribute' => __('requests.power.drop_node')]), Code::CODE_WRONG);
        }
        if (!$request->has('dropType')) {
            throw new \Exception(__('hint.error.mistake', ['attribute' => __('requests.power.drop_type')]), Code::CODE_WRONG);
        }
        DB::transaction(function () use ($request) {
            $draggingNodeData = $request->draggingNode;
            $dropNodeData = $request->dropNode;
            $pid = $dropNodeData['pid'];
            if ($request->dropType == 'inner') {    // 里面
                $draggingNodeData['sort'] = count($dropNodeData['children']);
                $pid = $dropNodeData['id'];
                $draggingNode = AuthRule::find($draggingNodeData['id']);
                $draggingNode->sort = $draggingNodeData['sort'];
                $draggingNode->pid = $pid;
                $draggingNode->save();
            } else {
                $brother = AuthRule::where('pid', $dropNodeData['pid'])->where('id', '!=', $draggingNodeData['id'])->orderBy('sort', 'ASC')->get()->toArray();
                $draggingNode = AuthRule::find($draggingNodeData['id']);
                $draggingNode->pid = $pid;
                $draggingNode->save();
                // 处理排序
                if ($request->dropType == 'before') { // 之前
                    array_splice($brother, $dropNodeData['sort'] - 1, 0, [$draggingNode->toArray()]);
                } else {  // 之后
                    array_splice($brother, $dropNodeData['sort'], 0, [$draggingNode->toArray()]);
                }
                // 重新排序
                foreach ($brother as $id => $b) {
                    $AuthRule = AuthRule::find($b['id']);
                    $AuthRule->sort = $id + 1;
                    $AuthRule->save();
                }
            }
        }, 5);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.sort')]));
    }

    /**
     * PowerDestroy
     * 删除权限
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 权限ID
     */
    public function destroy($id, Request $request)
    {
        DB::transaction(function () use ($id, $request) {
            if ($id > 0) {
                $arr = (new AuthRule())->obtainAllChildPermissions($id);
                AuthRule::whereIn('id', $arr)->delete();
                AuthGroupAuthRule::whereIn('auth_rule_id', $arr)->delete();
            } else {
                if (!$request->has('ids')) {
                    throw new \Exception(__('hint.error.parameter_wrong'), Code::CODE_WRONG);
                }
                foreach ($request->ids as $ids) {
                    $arr = (new AuthRule())->obtainAllChildPermissions($ids);
                    AuthRule::whereIn('id', $arr)->delete();
                    AuthGroupAuthRule::whereIn('auth_rule_id', $arr)->delete();
                }
            }
        }, 5);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.delete')]));
    }
}
