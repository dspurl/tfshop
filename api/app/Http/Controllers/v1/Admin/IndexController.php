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

use App\Http\Controllers\Controller;
use App\Models\v1\Common;
use App\Models\v1\Good;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodSku;
use App\Models\v1\MoneyLog;
use App\Models\v1\User;
use Illuminate\Support\Facades\DB;

/**
 * @group [ADMIN]Index(首页)
 * Class IndentController
 * @package App\Http\Controllers\v1\Admin
 */
class IndexController extends Controller
{
    /**
     * Index
     * 首页
     * @return string
     */
    public function index()
    {
        $return['chart'] = array_merge(Common::getChartData(__('index.chart.register_quantity'), 1), Common::getChartData(__('index.chart.order_quantity'), 1), Common::getChartData(__('index.chart.sales_amount'), 1));
        $User = User::whereRaw('now()-created_at<86400')->get();
        foreach ($User as $u) {
            $return['chart'][__('index.chart.register_quantity') . date('Y-m-d H', strtotime($u->created_at))]['value'] += 1;
        }
        $return['user'] = $User->count();
        $GoodIndent = GoodIndent::whereRaw('now()-created_at<86400')->get();

        foreach ($GoodIndent as $g) {
            $return['chart'][__('index.chart.order_quantity') . date('Y-m-d H', strtotime($g->created_at))]['value'] += 1;
        }
        $return['indent'] = $GoodIndent->count();
        $MoneyLog = MoneyLog::whereRaw('now()-created_at<86400')
            ->where('type', MoneyLog::MONEY_LOG_TYPE_EXPEND)->get();
        foreach ($MoneyLog as $m) {
            $return['chart'][__('index.chart.sales_amount') . date('Y-m-d H', strtotime($m->created_at))]['value'] += $m->money_show;
        }
        $return['income'] = $MoneyLog->sum('money');
        $return['expend'] = MoneyLog::whereRaw('now()-created_at<86400')->where('type', MoneyLog::MONEY_LOG_TYPE_INCOME)->sum('money');
        $return['send'] = GoodIndent::whereRaw('now()-created_at<86400')->where('state', GoodIndent::GOOD_INDENT_STATE_DELIVER)->count();
        $return['accessList'] = Good::select('id', 'name')->withCount(['browse' => function ($q) {
            $q->whereRaw('now()-created_at<86400');
        }])->get()->sortByDesc('browse_count')->values()->take(10);
        $return['collectList'] = Good::select('id', 'name')->withCount(['collect' => function ($q) {
            $q->whereRaw('now()-created_at<86400');
        }])->get()->sortByDesc('collect_count')->values()->take(10);
        $return['salesList'] = Good::select('id', 'name')->withCount(['goodIndentCommodity as commodity_sum' => function ($query) {
            $query->whereRaw('now()-created_at<86400')->select(DB::raw("sum(number) as commodity_sum"));
        }])->get()->sortByDesc('commodity_sum')->values()->take(10);

        //$inventoryVal=Option::select('val')->where('id',4)->value('val'); (也可实现一个店铺配置机制)
        $inventoryVal = 10;//低库存
        $return['inventoryLess'] = GoodSku::select('goods.id')
            ->leftJoin('goods', 'good_skus.good_id', '=', 'goods.id')
            ->where('good_skus.inventory', '<', $inventoryVal)
            ->where('goods.deleted_at', null)
            ->count();
        $return['inventoryList'] = GoodSku::select('goods.id', 'goods.name')
            ->leftJoin('goods', 'good_skus.good_id', '=', 'goods.id')
            ->where('good_skus.inventory', '<', $inventoryVal)
            ->where('goods.deleted_at', null)
            ->get()->sortByDesc('inventory')->values()->take(20);
        $return['chart'] = array_values($return['chart']);
        return resReturn(1, $return);
    }
}
