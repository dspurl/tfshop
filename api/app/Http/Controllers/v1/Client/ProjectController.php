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

use App\Models\v1\GoodSku;
use App\Models\v1\Category;
use App\Models\v1\Good;
use App\Models\v1\Project;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @group [CLIENT]Project(商城)
 * Class ProjectController
 * @package App\Http\Controllers\v1\Client
 */
class ProjectController extends Controller
{
    /**
     * ProjectDetail
     * 商城详情
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 商城ID
     */
    public function detail($id)
    {
        Project::$withoutAppends = false;
        $Project = Project::find(1);
        return resReturn(1, $Project);
    }
}
