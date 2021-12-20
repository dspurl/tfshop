<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitAdminRequest;
use App\Models\v1\Admin;
use App\Models\v1\AdminLog;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\v1\AdminAuthGroup;

/**
 * @group admin
 * 管理员日志
 * Class AdminController
 * @package App\Http\Controllers\v1\Admin
 */
class AdminLogController extends Controller
{
    /**
     * AdminList
     * 管理员日志列表
     * @param Request $request
     * @return string
     * @throws \Exception
     * @queryParam  title string 管理员账号
     * @queryParam  authGroup string 管理组ID
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = AdminLog::query();
        $limit = $request->limit;
        if ($request->has('filter')) {
            $this->customFilterCriteria($q, $request->filter);
        } else {
            if ($request->has('sort')) {
                $sortFormatConversion = sortFormatConversion($request->sort);
                $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
            }
        }
        $paginate = $q->with(['Admin'])->paginate($limit);
        return resReturn(1, $paginate);
    }
}
