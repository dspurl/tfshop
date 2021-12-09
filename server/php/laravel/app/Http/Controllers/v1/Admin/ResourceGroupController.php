<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\v1\SubmitResourceGroupRequest;
use App\Models\v1\ResourceGroup;

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
        $q = ResourceGroup::query();
        if ($request->has('keyword')) {
            $q->where('name', 'like', '%' . $request->keyword . '%');
        }
        $paginate = $q->get();
        return resReturn(1, $paginate);
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
        $ResourceGroup = new ResourceGroup;
        $ResourceGroup->name = $request->name;
        $ResourceGroup->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.add')]));
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
