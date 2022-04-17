<?php

namespace App\Http\Controllers\v1\Plugin\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitIntegralDrawLogRequest;
use App\Models\v1\IntegralDrawLog;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * IntegralDrawLog
 * 积分抽奖记录
 * Class IntegralDrawLogController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class IntegralDrawLogController extends Controller
{
    /**
     * IntegralDrawLogList
     * 积分抽奖记录列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     * @queryParam  username string 用户名
     * @queryParam  integral_draw_name string 抽奖名称
     * @queryParam  integral_draw_name string 奖品名称
     * @queryParam  timeInterval array 抽奖名称
     */
    public function list(Request $request)
    {
        IntegralDrawLog::$withoutAppends = false;
        $q = IntegralDrawLog::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->username) {
            $q->whereHas('User', function ($query) use ($request) {
                $query->where('name', $request->username);
            });
        }
        if ($request->integral_draw_name) {
            $q->whereHas('IntegralDraw', function ($query) use ($request) {
                $query->where('name', $request->integral_draw_name);
            });
        }
        if ($request->prize) {
            $q->whereHas('IntegralPrize', function ($query) use ($request) {
                $query->where('name', $request->prize);
            });
        }
        if ($request->timeInterval) {
            $q->where('created_at', '>=', $request->timeInterval[0]);
            $q->where('created_at', '<=', $request->timeInterval[1]);
        }
        if ($request->integral_draw_id) {
            $q->where('integral_draw_id', $request->integral_draw_id);
        }
        $q->with(['IntegralDraw', 'IntegralPrize', 'User']);
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }
}
