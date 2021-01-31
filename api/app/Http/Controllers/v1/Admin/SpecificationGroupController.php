<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Requests\v1\SubmitSpecificationGroupRequest;
use App\Models\v1\SpecificationGroup;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @group specificationGroup
 * 规格组管理
 * Class SpecificationGroupController
 * @package App\Http\Controllers\v1\Admin
 */
class SpecificationGroupController extends Controller
{
    /**
     * SpecificationGroupList
     * 规格组列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 规格组名称
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = SpecificationGroup::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->title) {
            $q->where('name', 'like', '%' . $request->title . '%');
        }
        $q->where('is_delete', SpecificationGroup::SPECIFICATION_GROUP_DELETE_NO);
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * SpecificationGroupCreate
     * 规格组添加
     * @param SubmitSpecificationGroupRequest $request
     * @return \Illuminate\Http\JsonResponse
     * @queryParam  name string 规格组名称
     */
    public function create(SubmitSpecificationGroupRequest $request)
    {
        $Specification = new SpecificationGroup();
        $Specification->name = $request->name;
        $Specification->save();
        return resReturn(1, '成功');
    }

    /**
     * SpecificationGroupEdit
     * 规格组编辑
     * @param SubmitSpecificationGroupRequest|Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 规格组ID
     * @queryParam  name string 规格组名称
     */
    public function edit(SubmitSpecificationGroupRequest $request, $id)
    {
        $Specification = SpecificationGroup::find($id);
        $Specification->name = $request->name;
        $Specification->save();
        return resReturn(1, '更新成功');
    }

    /**
     * SpecificationGroupDestroy
     * 规格组删除
     * @param  int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 规格组ID
     */
    public function destroy($id)
    {
        SpecificationGroup::where('id', $id)->update(['is_delete' => SpecificationGroup::SPECIFICATION_GROUP_DELETE_YES]);
        return resReturn(1, '删除成功');
    }
}
