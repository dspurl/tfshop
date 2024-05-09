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
use App\Models\v1\Specification;
use App\Models\v1\Brand;
use App\Models\v1\Category;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

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
        $limit = $request->limit;
        if ($request->has('sort')) {
            if ($request->sort) {
                $sortFormatConversion = sortFormatConversion($request->sort);
                $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
            } else {
                $q->orderBy('sort', 'ASC')->orderBy('id', 'ASC');
            }
        }
        if ($request->has('title')) {
            $q->where('name', 'like', '%' . $request->title . '%');
        }
        if ($request->has('pid')) {
            $q->where('pid', $request->pid[count($request->pid) - 1]);
        } else {
            $q->where('pid', 0);
        }
        $q->where('lang', App::getLocale());
        $q->with(['Language'=>function($q){
            $q->with(['SpecificationOn', 'BrandOn']);
        }]);
        $paginate = $q->with(['resources', 'SpecificationOn', 'BrandOn'])->paginate($limit);
        $return['options'] = (new Category())->getAllCategory();
        $return['brand'] = Brand::with(['resources'])->select('id', 'name', 'lang')->get();
        $return['paginate'] = $paginate;
        $return['specification'] = Specification::orderBy('sort', 'ASC')->orderBy('id', 'ASC')->get();
        return resReturn(1, $return);
    }

    /**
     * CategoryCreate
     * 创建分类
     * @param SubmitCategoryRequest $request
     * @return \Illuminate\Http\JsonResponse
     * @queryParam  name string 分类名称
     * @queryParam  pid int 分类上级ID
     * @queryParam  sort int 分类排序
     * @queryParam  is_recommend int 是否推荐
     * @queryParam  state int 是否显示
     * @queryParam  specification array 规格列表
     * @queryParam  brand array 品牌列表
     */
    public function create(SubmitCategoryRequest $request)
    {
        $return = DB::transaction(function () use ($request) {
            $Category = new Category();
            $Category->name = $request->name;
            $Category->pid = $request->pid;
            $Category->sort = $request->sort;
            $Category->is_recommend = $request->is_recommend;
            $Category->state = $request->state;
            $Category->lang = $request->lang ?? App::getLocale();
            $Category->lang_parent_id = $request->lang_parent_id ?? 0;
            $Category->save();
            if ($request->logo) {
                $Resource = new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'category_' . $Category->id;
                $Resource->image_id = $Category->id;
                $Resource->image_type = 'App\Models\v1\Category';
                $Resource->img = imgPathShift('category', $request->logo);
                $Resource->save();
            }
            if ($request->specification) {
                foreach ($request->specification as $id => $r) {
                    $data[] = array(
                        'specification_id' => $r,
                        'category_id' => $Category->id,
                    );
                }
                DB::table('category_specifications')->insert($data);
            }
            unset($data);
            if ($request->brand) {
                foreach ($request->brand as $id => $r) {
                    $data[] = array(
                        'brand_id' => $r,
                        'category_id' => $Category->id,
                    );
                }
                DB::table('category_brands')->insert($data);
            }
            unset($data);
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, __('common.succeed'));
        } else {
            return resReturn(0, __('hint.succeed.fail', ['attribute' => __('common.add')]), Code::CODE_PARAMETER_WRONG);
        }
    }

    /**
     * CategoryEdit
     * 保存分类
     * @param SubmitCategoryRequest|Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 分类ID
     * @queryParam  name string 分类名称
     * @queryParam  pid int 分类上级ID
     * @queryParam  sort int 分类排序
     * @queryParam  is_recommend int 是否推荐
     * @queryParam  state int 是否显示
     * @queryParam  specification array 规格列表
     * @queryParam  brand array 品牌列表
     */
    public function edit(SubmitCategoryRequest $request, $id)
    {
        $return = DB::transaction(function () use ($request, $id) {
            $Category = Category::find($id);
            $Category->name = $request->name;
            $Category->pid = $request->pid;
            $Category->sort = $request->sort;
            $Category->state = $request->state;
            $Category->is_recommend = $request->is_recommend;
            $Category->save();
            if ($request->resources && $request->logo) {
                $Resource = Resource::find($request->resources['id']);
                if ($request->logo != $Resource->img) {
                    resourceAutoDelete($Resource->img);
                }
                $Resource->img = imgPathShift('category', $request->logo);
                $Resource->save();
            } else {
                if ($request->logo) {
                    $Resource = new Resource();
                    $Resource->type = Resource::RESOURCE_TYPE_IMG;
                    $Resource->depict = 'category_' . $Category->id;
                    $Resource->image_id = $Category->id;
                    $Resource->image_type = 'App\Models\v1\Category';
                    $Resource->img = imgPathShift('category', $request->logo);
                    $Resource->save();
                }
            }

            //获取已存在数据库的规格ID
            $category_specification = DB::table('category_specifications')->where('category_id', $Category->id)->get()->pluck('specification_id');
            $delete = [];
            $specification = $request->specification;

            foreach ($category_specification as $c) {
                $key = array_search($c, $specification);
                if ($key === false) { //已经被删除
                    $delete[] = $c;
                } else {  //已存在
                    unset($specification[$key]);
                }
            }
            // 没有添加的规格进行添加
            if (count($specification)) {
                foreach ($specification as $id => $r) {
                    $data[] = array(
                        'specification_id' => $r,
                        'category_id' => $Category->id,
                    );
                }
                DB::table('category_specifications')->insert($data);
            }
            //删除掉被删除掉的规格
            if (count($delete) > 0) {
                DB::table('category_specifications')->where('category_id', $Category->id)->whereIn('specification_id', $delete)->delete();
            }
            //获取已存在数据库的品牌ID
            $category_brand = DB::table('category_brands')->where('category_id', $Category->id)->get()->pluck('brand_id');
            $delete = [];
            $brand = $request->brand;

            foreach ($category_brand as $c) {
                $key = array_search($c, $brand);
                if ($key === false) { //已经被删除
                    $delete[] = $c;
                } else {  //已存在
                    unset($brand[$key]);
                }
            }
            // 没有添加的品牌进行添加
            $data = [];
            if (count($brand)) {
                foreach ($brand as $id => $r) {
                    $data[] = array(
                        'brand_id' => $r,
                        'category_id' => $Category->id,
                    );
                }
                DB::table('category_brands')->insert($data);
            }
            //删除掉被删除掉的品牌
            if (count($delete) > 0) {
                DB::table('category_brands')->where('category_id', $Category->id)->whereIn('brand_id', $delete)->delete();
            }
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.update')]));
        } else {
            return resReturn(0, __('hint.succeed.fail', ['attribute' => __('common.update')]), Code::CODE_PARAMETER_WRONG);
        }
    }

    /**
     * CategoryDestroy
     * 删除分类
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 分类ID
     * @throws \Exception
     */
    public function destroy($id)
    {
        // 判断是否存在子类目
        $count = Category::where('pid', $id)->count();
        if ($count) {
            throw new \Exception(__('category.error.destroy'), Code::CODE_WRONG);
        }
        Category::destroy($id);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
    }
}
