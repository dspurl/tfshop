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

use App\Http\Requests\v1\SubmitDhlRequest;
use App\Models\v1\Dhl;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

/**
 * @group [ADMIN]Dhl(快递公司管理)
 * Class DhlController
 * @package App\Http\Controllers\v1\Admin
 */
class DhlController extends Controller
{
    /**
     * DhlList
     * 快递公司列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  title string 公司名称
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        if ($request->has('page')) {
            Dhl::$withoutAppends = false;
            $q = Dhl::query();
            if ($request->has('sort')) {
                $sortFormatConversion = sortFormatConversion($request->sort);
                $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
            }
            if ($request->title) {
                $q->where('name', 'like', '%' . $request->title . '%');
            }
            $limit = $request->limit;
            $q->where('lang', App::getLocale());
            $q->with(['Language']);
            $paginate = $q->paginate($limit);
        } else {
            $paginate = Dhl::where('lang', App::getLocale())->get();
        }
        return resReturn(1, $paginate);
    }

    /**
     * DhlCreate
     * 创建快递公司
     * @param SubmitDhlRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 快递公司名称
     * @queryParam  abbreviation string 快递公司英文缩写
     * @queryParam  state string 状态
     * @queryParam  sort string 排序
     */
    public function create(SubmitDhlRequest $request)
    {
        if ($request->is_default) {
            Dhl::where('is_default', Dhl::DHL_IS_DEFAULT_YES)->update(['is_default' => Dhl::DHL_IS_DEFAULT_NO]);
        }
        $Dhl = new Dhl();
        $Dhl->name = $request->name;
        $Dhl->abbreviation = $request->abbreviation;
        $Dhl->state = $request->state;
        $Dhl->is_default = $request->is_default;
        $Dhl->sort = $request->sort;
        $Dhl->lang = $request->lang ?? App::getLocale();
        $Dhl->lang_parent_id = $request->lang_parent_id ?? 0;
        $Dhl->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.add')]));
    }

    /**
     * DhlEdit
     * 保存快递公司
     * @param SubmitDhlRequest $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  name string 快递公司名称
     * @queryParam  abbreviation string 快递公司英文缩写
     * @queryParam  state string 状态
     * @queryParam  sort string 排序
     */
    public function edit(SubmitDhlRequest $request, $id)
    {
        if ($request->is_default) {
            Dhl::where('is_default', Dhl::DHL_IS_DEFAULT_YES)->update(['is_default' => Dhl::DHL_IS_DEFAULT_NO]);
        }
        $Dhl = Dhl::find($id);
        $Dhl->name = $request->name;
        $Dhl->abbreviation = $request->abbreviation;
        $Dhl->state = $request->state;
        $Dhl->is_default = $request->is_default;
        $Dhl->sort = $request->sort;
        $Dhl->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.update')]));
    }

    /**
     * DhlDestroy
     * 删除快递公司
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 快递公司ID
     */
    public function destroy($id)
    {
        Dhl::destroy($id);
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
    }
}
