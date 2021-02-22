<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitBrandRequest;
use App\Models\v1\Brand;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * @group brand
 * 品牌管理
 * Class BrandController
 * @package App\Http\Controllers\v1\Admin
 */
class BrandController extends Controller
{
    /**
     * BrandList
     * 品牌列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 品牌名称
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = Brand::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->name) {
            $q->where('name', 'like', '%' . $request->name . '%');
        }
        $paginate = $q->with('resources')->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * BrandCreate
     * 创建品牌
     * @param SubmitBrandRequest $request
     * @return \Illuminate\Http\JsonResponse
     * @queryParam  name string 品牌名称
     * @queryParam  sort int 排序
     */
    public function create(SubmitBrandRequest $request)
    {
        $return = DB::transaction(function () use ($request) {
            $Brand = new Brand();
            $Brand->name = $request->name;
            $Brand->sort = $request->sort;
            $Brand->save();
            if ($request->logo) {
                $Resource = new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'brand_' . $Brand->id;
                $Resource->image_id = $Brand->id;
                $Resource->image_type = 'App\Models\v1\Brand';
                $Resource->img = imgPathShift('brand', $request->logo);
                $Resource->save();
            }
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '成功');
        } else {
            return resReturn(0, '添加失败', Code::CODE_PARAMETER_WRONG);
        }
    }

    /**
     * BrandEdit
     * 保存品牌
     * @param SubmitBrandRequest|Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 品牌ID
     * @queryParam  name string 品牌名称
     * @queryParam  sort int 排序
     */
    public function edit(SubmitBrandRequest $request, $id)
    {
        $return = DB::transaction(function () use ($request, $id) {
            $Brand = Brand::find($id);
            $Brand->name = $request->name;
            $Brand->sort = $request->sort;
            $Brand->save();
            if ($request->resources['id'] && $request->logo) {
                $Resource = Resource::find($request->resources['id']);
                if ($request->logo != $Resource->img) {
                    resourceAutoDelete($Resource->img);
                }
                $Resource->img = imgPathShift('brand', $request->logo);
            } else {
                if ($request->logo) {
                    $Resource = new Resource();
                    $Resource->type = Resource::RESOURCE_TYPE_IMG;
                    $Resource->depict = 'brand_' . $Brand->id;
                    $Resource->image_id = $Brand->id;
                    $Resource->image_type = 'App\Models\v1\Brand';
                    $Resource->img = imgPathShift('brand', $request->logo);
                    $Resource->save();
                }
            }
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '更新成功');
        } else {
            return resReturn(0, '更新失败', Code::CODE_PARAMETER_WRONG);
        }
    }

    /**
     * BrandDestroy
     * 删除品牌
     * @param  int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 品牌ID
     */
    public function destroy($id)
    {
        Brand::destroy($id);
        return resReturn(1, '删除成功');
    }
}
