<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\v1\ResourceType;

/**
 * Resource
 * 资源管理
 * Class ResourceController
 * @package App\Http\Controllers\v1\Admin
 */
class ResourceController extends Controller
{
    /**
     * ResourceList
     * 资源列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  keyword string 关键字
     * @queryParam  limit int 每页显示条数
     * @queryParam  groupId int 分组ID
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     * @queryParam  uuid string 资源类型
     */
    public function list(Request $request)
    {
        $q = Resource::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->uuid) {
            $ResourceType = ResourceType::where('uuid', $request->uuid)->first();
            $q->whereIn('info->extension', $ResourceType->extension);
        }
        if ($request->has('groupId')) {
            if ($request->groupId != -1) {
                $q->where('resource_group_id', $request->groupId);
            }
        }
        if ($request->keyword) {
            $q->where('name', 'like', '%' . $request->keyword . '%')->orWhere('depict', 'like', '%' . $request->keyword . '%');
        }
        $q->orderBy('id', 'DESC');
        $paginate = $q->with(['ResourceType', 'Resource'])->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * ResourceCreate
     * 上传资源
     * @queryParam  name string 资源名称
     * @return string
     */
    public function create($request)
    {
        $Resource = new Resource();
        $Resource->resource_type_id = $request['type_id'];
        $Resource->resource_group_id = $request['group_id'];
        $Resource->name = $request['fileName'];
        $Resource->depict = '';
        $Resource->url = $request['url'];
        $Resource->info = $request['info'];
        $Resource->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.add')]));
    }

    /**
     * ResourceCover
     * 资源设置封面
     * @param Request $request
     * @queryParam  id int 资源ID
     * @queryParam  resource_id int 关联资源ID 
     * @return string
     */
    public function cover($id, Request $request)
    {
        $Resource = Resource::find($id);
        $Resource->resource_id = $request->resource_id;
        $Resource->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.amend')]));
    }

    /**
     * ResourceDepict
     * 资源设置别名
     * @param Request $request
     * @queryParam  id int 资源ID
     * @queryParam  resource_id int 关联资源ID 
     * @return string
     */
    public function depict($id, Request $request)
    {
        $Resource = Resource::find($id);
        $Resource->depict = $request->depict;
        $Resource->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.amend')]));
    }

    /**
     * ResourceGroup
     * 资源设置分组
     * @param Request $request
     * @queryParam  id int 资源ID
     * @queryParam  resource_id int 关联资源ID 
     * @return string
     */
    public function group(Request $request)
    {
        if (!$request->has('resource_group_id')) {
            throw new \Exception(__('hint.error.mistake', ['attribute' => __('requests.resource.resource_group_id')]), Code::CODE_WRONG);
        }
        if (!$request->has('ids')) {
            throw new \Exception(__('hint.error.mistake', ['attribute' => __('requests.resource.ids')]), Code::CODE_WRONG);
        }
        Resource::whereIn('id', $request->ids)->update(['resource_group_id' => $request->resource_group_id]);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.amend')]));
    }

    /**
     * ResourceDestroy
     * 删除资源
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 资源ID
     * @queryParam  ids array 资源ID组
     */
    public function destroy($id, Request $request)
    {
        if ($id > 0) {
            $Resource = Resource::find($id);
            resourceAutoDelete($Resource->url);
            Resource::destroy($id);
        } else {
            if (!$request->has('ids')) {
                return resReturn(0, __('hint.error.select', ['attribute' => __('hint.common.content_delete')]), Code::CODE_WRONG);
            }
            $Resource = Resource::whereIn('id', $request->ids)->get()->pluck('url');
            foreach ($Resource as $url) {
                resourceAutoDelete($url);
            }
            Resource::destroy($request->ids);
        }
    }
}
