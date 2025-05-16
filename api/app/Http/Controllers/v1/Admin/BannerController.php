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

use App\Http\Requests\v1\SubmitBannerRequest;
use App\Models\v1\Banner;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;

/**
 * @group [ADMIN]Banner(轮播管理)
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
     * @queryParam name string 轮播名称
     * @queryParam limit int 每页显示条数
     * @queryParam type int 轮播类型
     * @queryParam sort string 排序
     * @queryParam page string 页码
     */
    public function list(Request $request)
    {
        Banner::$withoutAppends = false;
        $q = Banner::query();
        if ($request->keyword) {
            $q->where('name', 'like', '%' . $request->keyword . '%');
        }
        if (isset($request->type)) {
            $q->where('type', $request->type);
        }
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $q->where('lang', App::getLocale());
        $q->with(['Language']);
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * BannerCreate
     * 创建轮播
     * @param SubmitBannerRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 轮播名称
     * @queryParam img string 轮播图片
     * @queryParam  type int 轮播类型
     * @queryParam  url string 轮播跳转地址
     * @queryParam  sort int 轮播排序
     * @queryParam  state int 轮播状态
     * @queryParam  img string 轮播图片
     */
    public function create(SubmitBannerRequest $request)
    {
        $Banner = new Banner();
        $Banner->name = $request->name;
        $Banner->type = $request->type;
        $Banner->url = $request->url;
        $Banner->img = $request->img;
        $Banner->sort = $request->sort;
        $Banner->state = $request->state;
        $Banner->lang = $request->lang ?? App::getLocale();
        $Banner->lang_parent_id = $request->lang_parent_id ?? 0;
        $Banner->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.add')]));
    }

    /**
     * BannerEdit
     * 保存轮播
     * @param SubmitBannerRequest $request
     * @param $id
     * @return string
     * @queryParam  id int 轮播ID
     * @queryParam  name string 轮播名称
     * @queryParam img string 轮播图片
     * @queryParam  type int 轮播类型
     * @queryParam  url string 轮播跳转地址
     * @queryParam  sort int 轮播排序
     * @queryParam  state int 轮播状态
     * @queryParam  img string 轮播图片
     */
    public function edit(SubmitBannerRequest $request, $id)
    {
        $Banner = Banner::find($id);
        $Banner->name = $request->name;
        $Banner->type = $request->type;
        $Banner->url = $request->url;
        $Banner->img = $request->img;
        $Banner->sort = $request->sort;
        $Banner->state = $request->state;
        $Banner->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.update')]));
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
        if ($id) {
            Banner::destroy($id);
        } else {
            if (!$request->has('ids')) {
                return resReturn(0, __('hint.error.selects', ['attribute' => __('common.operation_content')]), Code::CODE_WRONG);
            }
            Banner::destroy($request->ids);
        }
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
    }
}
