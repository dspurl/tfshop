<?php

namespace App\Http\Controllers\v1\Client;

use App\Models\v1\Banner;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * banner
 * 轮播广告
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
        $limit = $request->limit;
        $paginate = $q->with(['resources'])->paginate($limit);
        return resReturn(1, $paginate);
    }
}
