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

use App\Http\Resources\RegionResources;
use App\Models\v1\Region;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;

/**
 * @group [CLIENT]Region(地区管理)
 * Class RegionController
 * @package App\Http\Controllers\v1\Client
 */
class RegionController extends Controller
{
    /**
     * RegionList
     * 地区列表
     * @param Request $request
     * @return string
     */
    public function list(Request $request)
    {
        $q = Region::query();
        $q->where('parent_id', 0);
        $q->with(['parent','children']);
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $q->where('lang', App::getLocale());
        $paginate = $q->get();
        return resReturn(1, RegionResources::collection($paginate));
    }
}
