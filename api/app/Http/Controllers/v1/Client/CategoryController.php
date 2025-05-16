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
namespace App\Http\Controllers\v1\Client;

use App\Models\v1\Category;
use App\Http\Resources\CategoryResources;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;

/**
 * @group [CLIENT]Category(分类)
 * Class CategoryController
 * @package App\Http\Controllers\v1\Client
 */
class CategoryController extends Controller
{
    /**
     * CategoryList
     * 分类列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     * @queryParam  pid int 类目ID
     * @queryParam  ids array 商品ID组
     */
    public function list(Request $request)
    {
        $q = Category::query();
        if ($request->has('is_recommend')) {
            $q->where('is_recommend', $request->is_recommend);
        }
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        } else {
            $q->orderBy('sort', 'ASC')->orderBy('id', 'ASC');
        }
        if (isset($request->all)) {
            $q->with(['parent', 'children']);
        } else {
            $q->with(['parent', 'child']);
        }
        $q->where('lang', App::getLocale());
        $paginate = $q->get();
        return resReturn(1, CategoryResources::collection($paginate));
    }
}
