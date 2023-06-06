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

use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @group [ADMIN]Resource(资源管理)
 * Class ResourceController
 * @package App\Http\Controllers\v1\Admin
 */
class ResourceController extends Controller
{
    /**
     * ResourceList
     * 资源列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 资源名称
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = Resource::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->name) {
            $q->where('depict', $request->name);
        }
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * ResourceDestroy
     * 删除资源
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 资源ID
     */
    public function destroy($id)
    {
        $Resource = Resource::find($id);
        resourceAutoDelete($Resource->img);
        Resource::where('id', $id)->delete();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
    }
}
