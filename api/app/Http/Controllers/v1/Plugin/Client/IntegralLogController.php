<?php

namespace App\Http\Controllers\v1\Plugin\Client;

use App\Models\v1\IntegralLog;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * IntegralLog
 * 积分记录
 * Class IntegralLogController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class IntegralLogController extends Controller
{
    /**
     * IntegralLogList
     * 积分记录列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        IntegralLog::$withoutAppends = false;
        $q = IntegralLog::query();
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $q->where('user_id', auth('web')->user()->id);
        if ($request->has('keyword')) {
            $q->where('remark', 'like', '%' . $request->keyword . '%');
        }
        if ($request->has('timeInterval')) {
            if ($request->timeInterval) {
                if (is_array($request->timeInterval)) {
                    $q->where('created_at', '>=', $request->timeInterval[0] . ' 00:00:00');
                    $q->where('created_at', '<=', $request->timeInterval[1] . ' 23:59:59');
                } else {
                    $start_date = date('Y-m-d 00:00:00', mktime(00, 00, 00, date('m', strtotime($request->timeInterval)), 01));
                    $end_date = date('Y-m-d 23:59:59', mktime(23, 59, 59, date('m', strtotime($request->timeInterval)) + 1, 00));
                    $q->where('created_at', '>=', $start_date);
                    $q->where('created_at', '<=', $end_date);
                }
            }
        }
        if (isset($request->type)) {
            $q->where('type', $request->type);
        }
        $limit = $request->limit;
        $all = $q->get();
        $return['income'] = $all->where('type', '收入')->sum('operation');
        $return['expend'] = $all->where('type', '支出')->sum('operation');
        $paginate = $q->paginate($limit);
        $return['paginate'] = $paginate;
        return resReturn(1, $return);
    }

    /**
     * IntegralLogDetail
     * 积分记录详情
     * @param $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 积分记录ID
     */
    public function detail($id)
    {
        $return = IntegralLog::find($id);
        return resReturn(1, $return);
    }
}
