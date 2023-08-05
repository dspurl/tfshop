<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */

namespace App\Http\Controllers\v1\Admin;

use App\Http\Requests\v1\SubmitLanguageRequest;
use App\Http\Resources\LanguageResources;
use App\Models\v1\Language;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * @group [ADMIN]Language(地区管理)
 * Class LanguageController
 * @package App\Http\Controllers\v1\Admin
 */
class LanguageController extends Controller
{
    /**
     * LanguageList
     * 语言列表
     * @param Request $request
     * @return string
     */
    public function list(Request $request)
    {
        $q = Language::query();
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $paginate = $q->get();
        return resReturn(1, LanguageResources::collection($paginate));
    }

    /**
     * LanguageCreate
     * 创建语言
     * @param SubmitLanguageRequest $request
     * @return string
     * @queryParam  name string 地区名称
     * @queryParam  parent_id int 上级ID
     * @queryParam  value int 编码
     */
    public function create(SubmitLanguageRequest $request)
    {
        DB::transaction(function () use ($request) {
            $Language = new Language();
            $Language->name = $request->name;
            $Language->code = $request->code;
            $Language->save();
        }, 5);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.add')]));
    }

    /**
     * LanguageEdit
     * 保存语言
     * @param SubmitLanguageRequest $request
     * @param $id
     * @return string
     * @queryParam  id int 地区ID
     * @queryParam  name string 地区名称
     * @queryParam  parent_id int 上级ID
     * @queryParam  value int 编码
     */
    public function edit(SubmitLanguageRequest $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $Language = Language::find($id);
            $Language->name = $request->name;
            $Language->code = $request->code;
            $Language->save();
        }, 5);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.update')]));
    }

    /**
     * LanguageDestroy
     * 删除语言
     * @param int $id
     * @param Request $request
     * @return string
     * @queryParam  id int 地区ID
     */
    public function destroy($id, Request $request)
    {
        DB::transaction(function () use ($request, $id) {
            if ($id) {
                Language::where('id', $id)->delete();
            } else {
                foreach ($request as $data) {
                    Language::where('id', $data['id'])->delete();
                }
            }
        }, 5);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
    }
}
