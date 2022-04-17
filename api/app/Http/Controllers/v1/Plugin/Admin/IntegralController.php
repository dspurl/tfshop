<?php

namespace App\Http\Controllers\v1\Plugin\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitIntegralRequest;
use App\Models\v1\Integral;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * Integral
 * 积分
 * Class IntegralController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class IntegralController extends Controller
{
    /**
     * IntegralList
     * 积分列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        Integral::$withoutAppends = false;
        $q = Integral::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->has('keyword')) {
            $q->whereHas('User', function ($query) use ($request) {
                $query->where('cellphone', 'like', '%' . $request->keyword . '%');
            });
        }
        $q->with(['User']);
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }
}
