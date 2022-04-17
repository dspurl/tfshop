<?php
namespace App\Http\Controllers\v1\Plugin\Admin;
use App\Code;
use App\Http\Requests\v1\SubmitIntegralConfigurationRequest;
use App\Models\v1\IntegralConfiguration;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
/**
 * IntegralConfiguration
 * 积分配置
 * Class IntegralConfigurationController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class IntegralConfigurationController extends Controller
{
    /**
     * IntegralConfigurationList
     * 积分配置列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        IntegralConfiguration::$withoutAppends = false;
        $q = IntegralConfiguration::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->title) {
            $q->where('name', 'like', '%' . $request->title . '%');
        }
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }
    /**
     * IntegralConfigurationCreate
     * 积分配置添加
     * @param SubmitIntegralConfigurationRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 配置名称
     * @queryParam  system string 系统变量：用于系统内部调用，一般以sys_开头
     * @queryParam  value string 配置值
     * @queryParam  explain string 配置说明
     * @queryParam  is_hidden int 是否隐藏:0=否-no,1=是-yes
     */
    public function create(SubmitIntegralConfigurationRequest $request)
    {
        DB::transaction(function () use ($request) {
            $IntegralConfiguration = new IntegralConfiguration();
            $IntegralConfiguration->name = $request->name;
            $IntegralConfiguration->system = $request->system;
            $IntegralConfiguration->value = $request->value;
            $IntegralConfiguration->explain = $request->explain;
            $IntegralConfiguration->is_hidden = $request->is_hidden;
            $IntegralConfiguration->save();
        }, 5);
        return resReturn(1, '添加成功');
    }
    /**
     * IntegralConfigurationDetail
     * 积分配置详情
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 积分配置ID
     */
    public function detail($id)
    {
        $IntegralConfiguration = IntegralConfiguration::find($id);
        return resReturn(1, $IntegralConfiguration);
    }
    /**
     * IntegralConfigurationEdit
     * 积分配置更新
     * @param SubmitIntegralConfigurationRequest $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 积分配置ID
     * @queryParam  name string 配置名称
     * @queryParam  system string 系统变量：用于系统内部调用，一般以sys_开头
     * @queryParam  value string 配置值
     * @queryParam  explain string 配置说明
     * @queryParam  is_hidden int 是否隐藏:0=否-no,1=是-yes
     */
    public function edit(SubmitIntegralConfigurationRequest $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $IntegralConfiguration = IntegralConfiguration::find($id);
            $IntegralConfiguration->name = $request->name;
            $IntegralConfiguration->system = $request->system;
            $IntegralConfiguration->value = $request->value;
            $IntegralConfiguration->explain = $request->explain;
            $IntegralConfiguration->is_hidden = $request->is_hidden;
            $IntegralConfiguration->save();
        }, 5);
        return resReturn(1, '更新成功');
    }
    /**
     * IntegralConfigurationDestroy
     * 积分配置删除
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 积分配置ID
     */
    public function destroy($id, Request $request)
    {
        DB::transaction(function () use ($request, $id) {
            if ($id > 0) {
                IntegralConfiguration::destroy($id);
            } else {
                if (!$request->all()) {
                    throw new \Exception('请选择内容', Code::CODE_WRONG);
                }
                $idData = collect($request->all())->pluck('id');
                IntegralConfiguration::destroy($idData);
            }
        }, 5);
        return resReturn(1, '删除成功');
    }
}
