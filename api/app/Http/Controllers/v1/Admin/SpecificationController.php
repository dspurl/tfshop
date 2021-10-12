<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitSpecificationRequest;
use App\Models\v1\Specification;
use App\Models\v1\SpecificationGroup;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * @group specification
 * 规格管理
 * Class SpecificationController
 * @package App\Http\Controllers\v1\Admin
 */
class SpecificationController extends Controller
{
    /**
     * SpecificationList
     * 规格列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  title string 规格名称
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = Specification::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->title) {
            $q->where('name', 'like', '%' . $request->title . '%');
        }
        $paginate = $q->with(['SpecificationGroup'])->paginate($limit);
        $return = [];
        $return['paginate'] = $paginate;
        $return['SpecificationGroup'] = SpecificationGroup::select('id', 'name')->get();
        return resReturn(1, $return);
    }

    /**
     * SpecificationCreate
     * 创建规格
     * @param SubmitSpecificationRequest $request
     * @return \Illuminate\Http\JsonResponse
     * @queryParam  name string 规格名称
     * @queryParam  label string 规格标注名称
     * @queryParam  type int 规格类型
     * @queryParam  is_search string 是否可搜索
     * @queryParam  location string 显示位置
     * @queryParam  specification_group_id int 规格组ID
     * @queryParam  value string 规格值
     * @queryParam  sort string 排序
     */
    public function create(SubmitSpecificationRequest $request)
    {
        $Specification = new Specification();
        $Specification->name = $request->name;
        $Specification->label = $request->label ? $request->label : $request->name;
        $Specification->type = $request->type;
        $Specification->is_search = $request->is_search;
        $Specification->location = $request->location;
        $Specification->specification_group_id = $request->specification_group_id ?? 0;
        $Specification->value = $request->value;
        $Specification->sort = $request->sort;
        $Specification->save();
        return resReturn(1, '成功');
    }

    /**
     * SpecificationEdit
     * 保存规格
     * @param SubmitSpecificationRequest|Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 规格ID
     * @queryParam  name string 规格名称
     * @queryParam  label string 规格标注名称
     * @queryParam  type int 规格类型
     * @queryParam  is_search string 是否可搜索
     * @queryParam  location string 显示位置
     * @queryParam  specification_group_id int 规格组ID
     * @queryParam  value string 规格值
     * @queryParam  sort string 排序
     */
    public function edit(SubmitSpecificationRequest $request, $id)
    {
        $Specification = Specification::find($id);
        $Specification->name = $request->name;
        $Specification->label = $request->label ? $request->label : $request->name;
        $Specification->type = $request->type;
        $Specification->is_search = $request->is_search;
        $Specification->location = $request->location;
        $Specification->specification_group_id = $request->specification_group_id ?? 0;
        $Specification->value = $request->value;
        $Specification->sort = $request->sort;
        $Specification->save();
        return resReturn(1, '更新成功');
    }

    /**
     * SpecificationDestroy
     * 删除规格
     * @param  int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 规格ID
     */
    public function destroy($id)
    {
        Specification::destroy($id);
        return resReturn(1, '删除成功');
    }
}
