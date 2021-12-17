<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitAdminFilterRequest;
use App\Http\Requests\v1\SubmitAdminRequest;
use App\Models\v1\Admin;
use App\Models\v1\AdminFilter;
use App\Models\v1\AuthRule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\v1\AdminAuthGroup;

/**
 * @group admin
 * 管理员过滤器
 * Class AdminController
 * @package App\Http\Controllers\v1\Admin
 */
class AdminFilterController extends Controller
{
    /**
     * AdminFilterList
     * 管理员过滤器列表
     * @param Request $request
     * @return string
     * @throws \Exception
     */
    public function list(Request $request)
    {
        if (!$request->has('authRule')) {
            throw new \Exception(__('hint.error.mistake', ['attribute' => __('requests.admin_filter.auth_rule_id')]), Code::CODE_WRONG);
        }
        $AuthRule = AuthRule::where('api', $request->authRule)->first();
        $q = AdminFilter::query();
        $q->where('auth_rule_id', $AuthRule->id);
        $q->where(function ($q1) use ($request) {
            $q1->orWhere('admin_id', 0)
                ->orWhere('admin_id', auth('api')->user()->id);
        });
        $paginate = $q->get();
        return resReturn(1, $paginate);
    }

    /**
     * AdminCreate
     * 创建管理员过滤器
     * @param SubmitAdminFilterRequest $request
     * @return string
     * @throws \Exception
     * @queryParam  type string 类型
     * @queryParam  authRule string 过滤器权限
     * @queryParam  title string 过滤器名称
     * @queryParam  data string 过滤器条件
     */
    public function create(SubmitAdminFilterRequest $request)
    {
        if (!$request->has('type')) {
            throw new \Exception(__('hint.error.mistake', ['attribute' => __('requests.admin_filter.type')]), Code::CODE_WRONG);
        }
        if (!$request->has('authRule')) {
            throw new \Exception(__('hint.error.mistake', ['attribute' => __('requests.admin_filter.auth_rule_id')]), Code::CODE_WRONG);
        }
        $AuthRule = AuthRule::where('api', $request->authRule)->first();
        $AdminFilter = new AdminFilter;
        if ($request->type == 'my') {
            $AdminFilter->admin_id = auth('api')->user()->id;
        }
        $AdminFilter->auth_rule_id = $AuthRule->id;
        $AdminFilter->title = $request->title;
        $AdminFilter->data = $request->data;
        $AdminFilter->save();
        return resReturn(1, '添加成功');
    }

    /**
     * AdminEdit
     * 保存管理员过滤器
     * @param $id
     * @param SubmitAdminRequest $request
     * @queryParam  id int 管理员过滤器ID
     * @queryParam  title string 过滤器名称
     * @queryParam  data string 过滤器条件
     * @return string
     */
    public function edit($id, SubmitAdminRequest $request)
    {
        $AdminFilter = AdminFilter::find($id);
        $AdminFilter->title = $request->title;
        $AdminFilter->data = $request->data;
        $AdminFilter->save();
        return resReturn(1, '修改成功');
    }

    /**
     * AdminDestroy
     * 删除管理员过滤器
     * @param $id
     * @queryParam  id int 管理员过滤器ID
     * @return string
     */
    public function destroy($id, Request $request)
    {
        if ($id > 0) {
            AdminFilter::destroy($id);
        }
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('hint.common.delete')]));
    }
}
