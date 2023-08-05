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

use App\Http\Requests\v1\SubmitRegionRequest;
use App\Http\Resources\RegionResources;
use App\Models\v1\Region;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

/**
 * @group [ADMIN]Region(地区管理)
 * Class RegionController
 * @package App\Http\Controllers\v1\Admin
 */
class RegionController extends Controller
{
    /**
     * RegionList
     * 地区列表
     * @param Request $request
     * @return string
     * @queryParam  parent int 上级ID
     */
    public function list(Request $request)
    {
        $q = Region::query();
        $q->where('parent_id', $request->has('parent_id') ? $request->parent_id : 0);
        if(isset($request->all)){
            $q->with(['parent','children']);
        }else{
            $q->with(['parent','child']);
        }
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $q->where('lang', App::getLocale());
        $paginate = $q->get();
        return resReturn(1, RegionResources::collection($paginate));
    }

    /**
     * RegionCreate
     * 创建地区
     * @param SubmitRegionRequest $request
     * @return string
     * @queryParam  name string 地区名称
     * @queryParam  parent_id int 上级ID
     * @queryParam  value int 编码
     */
    public function create(SubmitRegionRequest $request)
    {
        DB::transaction(function () use ($request) {
            $Region = new Region();
            $Region->name = $request->name;
            $Region->value = $request->value;
            $Region->parent_id = $request->parent_id;
            $Region->lang = $request->lang ?? App::getLocale();
            $Region->save();
        }, 5);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.add')]));
    }

    /**
     * RegionEdit
     * 保存地区
     * @param SubmitRegionRequest $request
     * @param $id
     * @return string
     * @queryParam  id int 地区ID
     * @queryParam  name string 地区名称
     * @queryParam  parent_id int 上级ID
     * @queryParam  value int 编码
     */
    public function edit(SubmitRegionRequest $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $Region = Region::find($id);
            $Region->name = $request->name;
            $Region->value = $request->value;
            $Region->parent_id = $request->parent_id;
            $Region->save();
        }, 5);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.update')]));
    }

    /**
     * RegionDestroy
     * 删除地区
     * @param int $id
     * @param Request $request
     * @return string
     * @queryParam  id int 地区ID
     */
    public function destroy($id, Request $request)
    {
        DB::transaction(function () use ($request, $id) {
            if ($id) {
                Region::where('id', $id)->delete();
            } else {
                foreach ($request as $data) {
                    Region::where('id', $data['id'])->delete();
                }
            }
        }, 5);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
    }
}
