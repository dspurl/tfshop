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
namespace App\Http\Controllers\v1\Admin;

use App\Models\v1\Project;
use App\Models\v1\Resource;
use EasyWeChat\Factory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * @group [ADMIN]Project(商城管理)
 * Class BannerController
 * @package App\Http\Controllers\v1\Admin
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
        $Project = Project::find($id);
        return resReturn(1, $Project);
    }

    /**
     * ProjectEdit
     * 保存商城信息
     * @param Request $request
     * @param $id
     * @return string
     * @queryParam  pages array 页面
     * @queryParam  config array 配置
     */
    public function edit(Request $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $Project = Project::find($id);
            $Project->pages = multiDimensionalArrayImageReplacement($request->pages, 'project');
            $Project->config = $request->config;
            $Project->cover = imgPathShift('project', $request->cover);
            $Project->save();
            $Resource = Resource::where('image_id', $Project->id)->where('image_type', 'App\Models\v1\Project')->first();
            if (!$Resource) {
                $Resource = new Resource();
            }
            $Resource->type = Resource::RESOURCE_TYPE_IMG;
            $Resource->depict = 'project';
            $Resource->image_id = $Project->id;
            $Resource->image_type = 'App\Models\v1\Project';
            $Resource->img = $Project->cover;
            $Resource->save();
        }, 5);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.update')]));
    }

    /**
     * ProjectQr
     * 获取商城小程序二维码
     * @param Request $request
     * @return string
     */
    public function qr(Request $request)
    {
        $config = config('wechat.mini_program.default');
        $miniProgram = Factory::miniProgram($config);
        $response = $miniProgram->app_code->getUnlimit('id=' . $request->id, [
//            'page' => 'pages/index'
        ]);
        $res = $response->getBody()->getContents();
        $base64Image = "data:image/jpeg;base64," . base64_encode($res);
        return resReturn(1, $base64Image);
    }
}
