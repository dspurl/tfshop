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

use App\Http\Requests\v1\SubmitSpecificationGroupRequest;
use App\Models\v1\SpecificationGroup;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;

/**
 * @group [ADMIN]SpecificationGroup(规格组管理)
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
        $q->where('lang', App::getLocale());
        $q->with(['Language']);
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * SpecificationGroupCreate
     * 创建规格组
     * @param SubmitSpecificationGroupRequest $request
     * @return \Illuminate\Http\JsonResponse
     * @queryParam  name string 规格组名称
     */
    public function create(SubmitSpecificationGroupRequest $request)
    {
        $Specification = new SpecificationGroup();
        $Specification->name = $request->name;
        $Specification->lang = $request->lang ?? App::getLocale();
        $Specification->lang_parent_id = $request->lang_parent_id ?? 0;
        $Specification->save();
        return resReturn(1, __('common.succeed'));
    }

    /**
     * SpecificationGroupEdit
     * 保存规格组
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
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.update')]));
    }

    /**
     * SpecificationGroupDestroy
     * 删除规格组
     * @param  int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 规格组ID
     */
    public function destroy($id)
    {
        SpecificationGroup::destroy($id);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
    }
}
