<?php

namespace App\Http\Controllers\v1\Plugin\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitGoodParameterRequest;
use App\Models\v1\GoodParameter;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * GoodParameter
 * 产品参数
 * Class GoodParameterController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class GoodParameterController extends Controller
{
    /**
     * GoodParameterList
     * 产品参数列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        GoodParameter::$withoutAppends = false;
        $q = GoodParameter::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->has('is_hide')) {
            $q->where('is_hide', $request->is_hide);
        }
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * GoodParameterCreate
     * 产品参数添加
     * @param SubmitGoodParameterRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  value string 参数名
     */
    public function create(SubmitGoodParameterRequest $request)
    {
        DB::transaction(function () use ($request) {
            $GoodParameter = new GoodParameter();
            $GoodParameter->value = $request->value;
            $GoodParameter->is_hide = $request->is_hide;
            $GoodParameter->save();
        }, 5);
        return resReturn(1, '添加成功');
    }

    /**
     * GoodParameterDetail
     * 产品参数详情
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 产品参数ID
     */
    public function detail($id)
    {
        $GoodParameter = GoodParameter::find($id);
        return resReturn(1, $GoodParameter);
    }

    /**
     * GoodParameterEdit
     * 产品参数更新
     * @param SubmitGoodParameterRequest $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 产品参数ID
     * @queryParam  value string 参数名
     */
    public function edit(SubmitGoodParameterRequest $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $GoodParameter = GoodParameter::find($id);
            $GoodParameter->value = $request->value;
            $GoodParameter->is_hide = $request->is_hide;
            $GoodParameter->save();
        }, 5);
        return resReturn(1, '更新成功');
    }

    /**
     * GoodParameterDestroy
     * 产品参数删除
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 产品参数ID
     */
    public function destroy($id, Request $request)
    {
        DB::transaction(function () use ($request, $id) {
            if ($id > 0) {
                GoodParameter::destroy($id);
            } else {
                if (!$request->all()) {
                    throw new \Exception('请选择内容', Code::CODE_WRONG);
                }
                $idData = collect($request->all())->pluck('id');
                GoodParameter::destroy($idData);
            }
        }, 5);
        return resReturn(1, '删除成功');
    }
}
