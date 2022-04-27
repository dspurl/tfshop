<?php

namespace App\Http\Controllers\v1\Client;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * service
 * 客服
 * Class ServiceController
 * @package App\Http\Controllers\v1\Client
 */
class ServiceController extends Controller
{
    /**
     * ServiceConfig
     * 获取客服配置
     * @param Request $request
     * @return string
     * @throws \Exception
     */
    public function config(Request $request)
    {
        $service = config('service.workWeixin');
        return resReturn(1, $service);
    }
}
