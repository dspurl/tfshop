<?php

namespace App\Http\Controllers\v1\Plugin\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitIntegralLogRequest;
use App\Models\v1\IntegralLog;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

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
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        IntegralLog::$withoutAppends = false;
        $q = IntegralLog::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->keyword) {
            $q->whereHas('User', function ($query) use ($request) {
                $query->where('cellphone', 'like', '%' . $request->keyword . '%');
            });
        }
        if ($request->timeInterval) {
            $q->where('created_at', '>=', $request->timeInterval[0] . ' 00:00:00');
            $q->where('created_at', '<=', $request->timeInterval[1] . ' 23:59:59');
        }
        if (isset($request->type)) {
            $q->where('type', $request->type);
        }
        $q->with(['User']);
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }
}
