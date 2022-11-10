<?php

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
