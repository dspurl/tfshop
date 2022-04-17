<?php

namespace App\Http\Controllers\v1\Plugin\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitGoodParameterGroupRequest;
use App\Models\v1\GoodParameterGroup;
use App\Models\v1\GoodParameterGroupGoodParameter;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * GoodParameterGroup
 * 产品参数组
 * Class GoodParameterGroupController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class GoodParameterGroupController extends Controller
{
    /**
     * GoodParameterGroupList
     * 产品参数组列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        GoodParameterGroup::$withoutAppends = false;
        $q = GoodParameterGroup::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $paginate = $q->with('GoodParameter')->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * GoodParameterGroupCreate
     * 产品参数组添加
     * @param SubmitGoodParameterGroupRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  value string 参数名
     * @queryParam  is_hide int 是否隐藏:0=否-no,1=是-yes
     * @queryParam  leaf array 产品参数列表
     */
    public function create(SubmitGoodParameterGroupRequest $request)
    {
        DB::transaction(function () use ($request) {
            $GoodParameterGroup = new GoodParameterGroup();
            $GoodParameterGroup->value = $request->value;
            $GoodParameterGroup->is_hide = $request->is_hide;
            $GoodParameterGroup->save();
            if(count($request->leaf)>0){
                foreach ($request->leaf as $ids) {
                    $GoodParameterGroupGoodParameter = new GoodParameterGroupGoodParameter();
                    $GoodParameterGroupGoodParameter->good_parameter_group_id = $GoodParameterGroup->id;
                    $GoodParameterGroupGoodParameter->good_parameter_id = $ids;
                    $GoodParameterGroupGoodParameter->save();
                }
            }
        }, 5);
        return resReturn(1, '添加成功');
    }

    /**
     * GoodParameterGroupDetail
     * 产品参数组详情
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 产品参数组ID
     */
    public function detail($id)
    {
        $GoodParameterGroup = GoodParameterGroup::with('GoodParameter')->find($id);
        return resReturn(1, $GoodParameterGroup);
    }

    /**
     * GoodParameterGroupEdit
     * 产品参数组更新
     * @param SubmitGoodParameterGroupRequest $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 产品参数组ID
     * @queryParam  value string 参数名
     * @queryParam  is_hide int 是否隐藏:0=否-no,1=是-yes
     * @queryParam  leaf array 产品参数列表
     */
    public function edit(SubmitGoodParameterGroupRequest $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $GoodParameterGroup = GoodParameterGroup::find($id);
            $GoodParameterGroup->value = $request->value;
            $GoodParameterGroup->is_hide = $request->is_hide;
            $GoodParameterGroup->save();
            GoodParameterGroupGoodParameter::where('good_parameter_group_id', $id)->delete();
            if(count($request->leaf)>0){
                foreach ($request->leaf as $ids) {
                    $GoodParameterGroupGoodParameter = new GoodParameterGroupGoodParameter();
                    $GoodParameterGroupGoodParameter->good_parameter_group_id = $id;
                    $GoodParameterGroupGoodParameter->good_parameter_id = $ids;
                    $GoodParameterGroupGoodParameter->save();
                }
            }
        }, 5);
        return resReturn(1, '更新成功');
    }

    /**
     * GoodParameterGroupDestroy
     * 产品参数组删除
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 产品参数组ID
     */
    public function destroy($id, Request $request)
    {
        DB::transaction(function () use ($request, $id) {
            if ($id > 0) {
                GoodParameterGroup::destroy($id);
            } else {
                if (!$request->all()) {
                    throw new \Exception('请选择内容', Code::CODE_WRONG);
                }
                $idData = collect($request->all())->pluck('id');
                GoodParameterGroup::destroy($idData);
            }
        }, 5);
        return resReturn(1, '删除成功');
    }
}
