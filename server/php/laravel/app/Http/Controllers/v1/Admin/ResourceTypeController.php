<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\v1\SubmitResourceTypeRequest;
use App\Models\v1\ResourceType;
use Webpatser\Uuid\Uuid;

/**
 * Resource Type
 * 资源类型管理
 * Class ResourceTypeController
 * @package App\Http\Controllers\v1\Admin
 */
class ResourceTypeController extends Controller
{
    /**
     * ResourceTypeList
     * 资源类型列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  keyword string 关键字
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = ResourceType::query();
        $limit = $request->limit;
        if ($request->has('keyword')) {
            $q->where('name', 'like', '%' . $request->keyword . '%');
        }
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * ResourceTypeCreate
     * 创建资源类型
     * @param SubmitResourceTypeRequest $request
     * @return string
     * @throws \Exception
     * @queryParam  name string 资源分组名称
     * @queryParam  alias string 资源类型别名
     * @queryParam  icon string 资源类型图标
     * @queryParam  icon string 资源类型大小
     * @queryParam  extension array 资源类型后缀
     * @queryParam  specification array 资源类型规格
     */
    public function create(SubmitResourceTypeRequest $request)
    {
        $ResourceType = new ResourceType;
        $ResourceType->uuid = (string)Uuid::generate();
        $ResourceType->name = $request->name;
        $ResourceType->alias = $request->alias;
        $ResourceType->icon = $request->icon;
        $ResourceType->size = $request->size ?? 0;
        $ResourceType->extension = $request->extension;
        $ResourceType->specification = $request->specification;
        $ResourceType->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.add')]));
    }

    /**
     * ResourceTypeEdit
     * 保存资源类型
     * @param SubmitResourceTypeRequest $request
     * @queryParam  id int 资源分组ID
     * @queryParam  name string 资源分组名称
     * @queryParam  alias string 资源类型别名
     * @queryParam  icon string 资源类型图标
     * @queryParam  icon string 资源类型大小
     * @queryParam  extension array 资源类型后缀
     * @queryParam  specification array 资源类型规格
     * @return string
     */
    public function edit($id, SubmitResourceTypeRequest $request)
    {
        $ResourceType = ResourceType::find($id);
        $ResourceType->name = $request->name;
        $ResourceType->alias = $request->alias;
        $ResourceType->icon = $request->icon;
        $ResourceType->size = $request->size ?? 0;
        $ResourceType->extension = $request->extension;
        $ResourceType->specification = $request->specification;
        $ResourceType->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.amend')]));
    }

    /**
     * ResourceTypeDestroy
     * 删除资源类型
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 资源分组ID
     * @queryParam  ids array 资源分组ID组
     */
    public function destroy($id, Request $request)
    {
        if ($id > 0) {
            ResourceType::destroy($id);
        } else {
            if (!$request->has('ids')) {
                return resReturn(0, __('hint.error.select', ['attribute' => __('hint.common.content_delete')]), Code::CODE_WRONG);
            }
            ResourceType::destroy($request->ids);
        }
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.delete')]));
    }
}
