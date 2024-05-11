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

use App\Models\v1\Banner;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;

/**
 * @group [CLIENT]Banner(轮播广告)
 * Class BannerController
 * @package App\Http\Controllers\v1\Client
 */
class BannerController extends Controller
{
    /**
     * BannerList
     * 轮播列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  type int 轮播类型
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        Banner::$withoutAppends = false;
        $q = Banner::query();
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->has('type')) {
            $q->where('type', $request->type);
        }
        if ($request->has('state')) {
            $q->where('state', $request->state);
        }
        $limit = $request->limit;
        $q->where('lang', App::getLocale());
        $paginate = $q->with(['resources'])->paginate($limit);
        return resReturn(1, $paginate);
    }
}
