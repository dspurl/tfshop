<?php
/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Http\Controllers\v1\Client;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @group [CLIENT]Service(客服)
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
