<?php

namespace App\Http\Controllers\v1\Client;

use App\Models\v1\MoneyLog;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * moneyLog
 * 资金记录
 * Class MoneyLogController
 * @package App\Http\Controllers\v1\Client
 */
class MoneyLogController extends Controller
{
    /**
     * MoneyLogList
     * 收支列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  month string 日期筛选
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = MoneyLog::query();
        if ($request->month) {
            $start_date = date('Y-m-d 00:00:00', mktime(00, 00, 00, date('m', strtotime($request->month)), 01));
            $end_date = date('Y-m-d 23:59:59', mktime(23, 59, 59, date('m', strtotime($request->month)) + 1, 00));
            $q->where('created_at', '>=', $start_date);
            $q->where('created_at', '<=', $end_date);
        }
        if ($request->has('type')) {
            if ($request->type) {
                $q->where('type', $request->type - 1);
            }
        }
        $q->where('user_id', auth('web')->user()->id);
        $q->whereIn('type', [MoneyLog::MONEY_LOG_TYPE_INCOME, MoneyLog::MONEY_LOG_TYPE_EXPEND]);
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $limit = $request->limit;
        $get = $q->get();

        $return['paginate'] = $q->paginate($limit);
        $return['income'] = 0;
        $return['expend'] = 0;
        foreach ($get as $g) {
            if ($g->type == MoneyLog::MONEY_LOG_TYPE_INCOME) {
                $return['income'] += $g->money / 100;
            } else {
                $return['expend'] += $g->money / 100;
            }
        }
        return resReturn(1, $return);
    }

    /**
     * MoneyLogDetail
     * 收支明细
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 记录ID
     */
    public function detail($id)
    {
        $MoneyLog = MoneyLog::where('user_id', auth('web')->user()->id)->find($id);
        return resReturn(1, $MoneyLog);
    }
}
