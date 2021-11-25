<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Requests\v1\SubmitBannerRequest;
use App\Models\v1\Banner;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * banner
 * 轮播管理
 * Class BannerController
 * @package App\Http\Controllers\v1\Admin
 */
class BannerController extends Controller
{
    /**
     * BannerList
     * 轮播列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 轮播名称
     * @queryParam  limit int 每页显示条数
     * @queryParam  type int 轮播类型
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        Banner::$withoutAppends = false;
        $q = Banner::query();
        if ($request->name) {
            $q->where('name', 'like', '%' . $request->name . '%');
        }
        if ($request->type) {
            $q->where('type', $request->type);
        }
        $q->with(['resources']);
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * BannerCreate
     * 创建轮播
     * @param SubmitBannerRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 轮播名称
     * @queryParam  type int 轮播类型
     * @queryParam  url string 轮播跳转地址
     * @queryParam  sort int 轮播排序
     * @queryParam  state int 轮播状态
     * @queryParam  img string 轮播图片
     */
    public function create(SubmitBannerRequest $request)
    {
        $return = DB::transaction(function () use ($request) {
            $Banner = new Banner();
            $Banner->name = $request->name;
            $Banner->type = $request->type;
            $Banner->url = $request->url;
            $Banner->sort = $request->sort;
            $Banner->state = $request->state;
            $Banner->save();
            if ($request->img) {
                $Resource = new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'banner_' . $Banner->id;
                $Resource->image_id = $Banner->id;
                $Resource->image_type = 'App\Models\v1\Banner';
                $Resource->img = imgPathShift('banner', $request->img);
                $Resource->save();
            }
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '添加成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }

    /**
     * BannerEdit
     * 保存轮播
     * @param SubmitBannerRequest $request
     * @param $id
     * @return string
     * @queryParam  id int 轮播ID
     * @queryParam  name string 轮播名称
     * @queryParam  type int 轮播类型
     * @queryParam  url string 轮播跳转地址
     * @queryParam  sort int 轮播排序
     * @queryParam  state int 轮播状态
     * @queryParam  img string 轮播图片
     */
    public function edit(SubmitBannerRequest $request, $id)
    {
        $return = DB::transaction(function () use ($request, $id) {
            $Banner = Banner::find($id);
            $Banner->name = $request->name;
            $Banner->type = $request->type;
            $Banner->url = $request->url;
            $Banner->sort = $request->sort;
            $Banner->state = $request->state;
            $Banner->save();
            //如果有旧图, 替换
            if ($request->resources && $request->img) {
                $Resource = Resource::find($request->resources['id']);
                if ($request->img != $Resource->img) {
                    imgPathDelete('banner', $Resource->img);
                }
                $Resource->img = imgPathShift('banner', $request->img);
                $Resource->save();
                return 1;
            }
            //如果无旧图, 上传新图
            if ($request->img) {
                $Resource = new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'banner_' . $Banner->id;
                $Resource->image_id = $Banner->id;
                $Resource->image_type = 'App\Models\v1\Banner';
                $Resource->img = imgPathShift('banner', $request->img);
                $Resource->save();
                return 1;
            }
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '更新成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }

    /**
     * BannerDestroy
     * 删除轮播
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 轮播ID
     */
    public function destroy($id, Request $request)
    {
        $return = DB::transaction(function () use ($request, $id) {
            if ($id) {
                $Banner = Banner::find($id);
                $Resource = Resource::where('image_type', 'App\Models\v1\Banner')->where('image_id', $Banner->id)->first();
                Resource::where('image_type', 'App\Models\v1\Banner')->where('image_id', $Banner->id)->delete();
                Banner::where('id', $Banner->id)->delete();
                imgPathDelete('banner', $Resource->img);
            } else {
                foreach ($request as $data) {
                    $Banner = Banner::find($data['id']);
                    $Resource = Resource::where('image_type', 'App\Models\v1\Banner')->where('image_id', $Banner->id)->first();
                    Resource::where('image_type', 'App\Models\v1\Banner')->where('image_id', $Banner->id)->delete();
                    Banner::where('id', $Banner->id)->delete();
                    imgPathDelete('banner', $Resource->img);
                }
            }
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '删除成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }
}
