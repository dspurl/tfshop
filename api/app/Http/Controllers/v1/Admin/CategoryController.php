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

use App\Code;
use App\Http\Requests\v1\SubmitCategoryRequest;
use App\Models\v1\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResources;
use Illuminate\Support\Facades\App;

/**
 * @group [ADMIN]Category(分类管理)
 * Class CategoryController
 * @package App\Http\Controllers\v1\Admin
 */
class CategoryController extends Controller
{
    /**
     * CategoryList
     * 分类列表
     * @param Request $request
     * @return string
     * @queryParam  title string 品牌名称
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = Category::query();
        if ($request->has('sort')) {
            if ($request->sort) {
                $sortFormatConversion = sortFormatConversion($request->sort);
                $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
            } else {
                $q->orderBy('sort', 'ASC')->orderBy('id', 'ASC');
            }
        } else {
            $q->orderBy('sort', 'ASC')->orderBy('id', 'ASC');
        }
        $q->where('parent_id', $request->has('parent_id') ? $request->parent_id : 0);
        if (isset($request->all)) {
            $q->with(['parent', 'children']);
        } else {
            $q->with(['parent', 'child']);
        }
        if ($request->keyword) {
            $q->where('name', 'like', '%' . $request->keyword . '%');
        }
        $q->where('lang', App::getLocale());
        $q->with(['Language']);
        $paginate = $q->get();
        return resReturn(1, CategoryResources::collection($paginate));
    }

    /**
     * CategoryCreate
     * 创建分类
     * @param SubmitCategoryRequest $request
     * @return \Illuminate\Http\JsonResponse
     * @queryParam  name string 分类名称
     * @queryParam  img string 分类图标
     * @queryParam  pid int 分类上级ID
     * @queryParam  sort int 分类排序
     * @queryParam  is_recommend int 是否推荐
     * @queryParam  state int 是否显示
     * @queryParam  specification array 规格列表
     * @queryParam  brand array 品牌列表
     */
    public function create(SubmitCategoryRequest $request)
    {
        $Category = new Category();
        $Category->name = $request->name;
        $Category->img = $request->img;
        $Category->parent_id = $request->parent_id;
        $Category->sort = $request->sort;
        $Category->is_recommend = $request->is_recommend;
        $Category->state = $request->state;
        $Category->lang = $request->lang ?? App::getLocale();
        $Category->lang_parent_id = $request->lang_parent_id ?? 0;
        $Category->save();
        return resReturn(1, __('common.succeed'));
    }

    /**
     * CategoryEdit
     * 保存分类
     * @param SubmitCategoryRequest|Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 分类ID
     * @queryParam  name string 分类名称
     * @queryParam  img string 分类图标
     * @queryParam  parent_id int 分类上级ID
     * @queryParam  sort int 分类排序
     * @queryParam  is_recommend int 是否推荐
     * @queryParam  state int 是否显示
     * @queryParam  specification array 规格列表
     * @queryParam  brand array 品牌列表
     */
    public function edit(SubmitCategoryRequest $request, $id)
    {
        $Category = Category::find($id);
        $Category->name = $request->name;
        $Category->img = $request->img;
        $Category->parent_id = $request->parent_id;
        $Category->sort = $request->sort;
        $Category->state = $request->state;
        $Category->is_recommend = $request->is_recommend;
        $Category->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.update')]));
    }

    /**
     * CategoryDestroy
     * 删除分类
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 分类ID
     * @throws \Exception
     */
    public function destroy($id, Request $request)
    {
        if ($id) {
            Category::destroy($id);
        } else {
            if (!$request->has('ids')) {
                return resReturn(0, __('hint.error.selects', ['attribute' => __('common.operation_content')]), Code::CODE_WRONG);
            }
            Category::destroy($request->ids);
        }
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
    }
}
