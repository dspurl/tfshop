<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\v1\SubmitResourceGroupRequest;
use App\Models\v1\ResourceGroup;
use Illuminate\Support\Facades\DB;

/**
 * Resource Group
 * 资源分组管理
 * Class ResourceGroupController
 * @package App\Http\Controllers\v1\Admin
 */
class ResourceGroupController extends Controller
{
    /**
     * ResourceGroupList
     * 资源分组列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  keyword string 关键字
     */
    public function list(Request $request)
    {
        $AuthRule = ResourceGroup::where('pid', 0)->with(['children'])->orderBy('sort', 'ASC')->get();
        return resReturn(1, $AuthRule);
    }

    /**
     * ResourceGroupCreate
     * 创建资源分组
     * @param SubmitResourceGroupRequest $request
     * @queryParam  name string 资源分组名称
     * @return string
     */
    public function create(SubmitResourceGroupRequest $request)
    {
        $sort = ResourceGroup::where('pid', $request->pid)->count();
        $ResourceGroup = new ResourceGroup;
        $ResourceGroup->pid = $request->pid ?? 0;
        $ResourceGroup->name = $request->name;
        $ResourceGroup->sort = $sort + 1;
        $ResourceGroup->save();
        return resReturn(1, $ResourceGroup);
    }

    /**
     * ResourceGroupEdit
     * 保存资源分组
     * @param SubmitResourceGroupRequest $request
     * @queryParam  id int 资源分组ID
     * @queryParam  name string 资源分组名称
     * @return string
     */
    public function edit($id, SubmitResourceGroupRequest $request)
    {
        $ResourceGroup = ResourceGroup::find($id);
        $ResourceGroup->name = $request->name;
        $ResourceGroup->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.amend')]));
    }

    /**
     * ResourceGroupSort
     * 资源分组排序
     * @param Request $request
     * @return string
     * @throws \Exception
     * @queryParam  id int 资源分组ID
     * @queryParam  name string 资源分组名称
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
                $draggingNode = ResourceGroup::find($draggingNodeData['id']);
                $draggingNode->sort = $draggingNodeData['sort'];
                $draggingNode->pid = $pid;
                $draggingNode->save();
            } else {
                $brother = ResourceGroup::where('pid', $dropNodeData['pid'])->where('id', '!=', $draggingNodeData['id'])->orderBy('sort', 'ASC')->get()->toArray();
                $draggingNode = ResourceGroup::find($draggingNodeData['id']);
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
                    $AuthRule = ResourceGroup::find($b['id']);
                    $AuthRule->sort = $id + 1;
                    $AuthRule->save();
                }
            }
        }, 5);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.sort')]));
    }

    /**
     * ResourceGroupDestroy
     * 删除资源分组
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 资源分组ID
     * @queryParam  ids array 资源分组ID组
     */
    public function destroy($id, Request $request)
    {
        if ($id > 0) {
            ResourceGroup::destroy($id);
        } else {
            if (!$request->has('ids')) {
                return resReturn(0, __('hint.error.select', ['attribute' => __('hint.common.content_delete')]), Code::CODE_WRONG);
            }
            ResourceGroup::destroy($request->ids);
        }
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.delete')]));
    }
}
