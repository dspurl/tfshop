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
namespace App\Http\Controllers\v1\Client;

use App\Http\Resources\LanguageResources;
use App\Models\v1\Banner;
use App\Models\v1\Language;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @group [CLIENT]Language(语言)
 * Class LanguageController
 * @package App\Http\Controllers\v1\Client
 */
class LanguageController extends Controller
{
    /**
     * BannerList
     * 轮播列表
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
}
