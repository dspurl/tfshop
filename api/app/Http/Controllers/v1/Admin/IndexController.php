<?php

namespace App\Http\Controllers\v1\Admin;
use App\Http\Controllers\Controller;
use App\Models\v1\Common;
use App\Models\v1\Good;
use App\Models\v1\GoodIndent;
use App\Models\v1\MoneyLog;
use App\Models\v1\User;
use Illuminate\Support\Facades\DB;

class IndexController extends Controller
{
    //首页
    public function index(){
        $return['chart']=array_merge(Common::getChartData('注册量',1),Common::getChartData('订单量',1),Common::getChartData('销售金额',1));
        $User=User::where('created_at','>=',date("Y-m-d 00:00:00"))->where('created_at','<=',date("Y-m-d 23:59:59"))->get();
        foreach ($User as $u){
            $return['chart']['注册量'.date('Y-m-d H',strtotime($u->created_at))]['value']+=1;
        }
        $return['user']=$User->count();
        $GoodIndent=GoodIndent::where('created_at','>=',date("Y-m-d 00:00:00"))->where('created_at','<=',date("Y-m-d 23:59:59"))->get();

        foreach ($GoodIndent as $g){
            $return['chart']['订单量'.date('Y-m-d H',strtotime($g->created_at))]['value']+=1;
        }
        $return['indent']=$GoodIndent->count();
        $MoneyLog=MoneyLog::where('created_at','>=',date("Y-m-d 00:00:00"))->where('created_at','<=',date("Y-m-d 23:59:59"))->where('type',MoneyLog::MONEY_LOG_TYPE_EXPEND)->get();
        foreach ($MoneyLog as $m){
            $return['chart']['销售金额'.date('Y-m-d H',strtotime($m->created_at))]['value']+=$m->money_show;
        }
        $return['income']=$MoneyLog->sum('money');
        $return['expend']=MoneyLog::where('created_at','>=',date("Y-m-d 00:00:00"))->where('created_at','<=',date("Y-m-d 23:59:59"))->where('type',MoneyLog::MONEY_LOG_TYPE_INCOME)->sum('money');
        $return['send']=GoodIndent::where('created_at','>=',date("Y-m-d 00:00:00"))->where('created_at','<=',date("Y-m-d 23:59:59"))->where('state',GoodIndent::GOOD_INDENT_STATE_DELIVER)->count();
        $return['accessList']=Good::select('id','name')->withCount(['browse'=>function($q){
            $q->where('created_at','>=',date("Y-m-d 00:00:00"))->where('created_at','<=',date("Y-m-d 23:59:59"));
        }])->get()->sortByDesc('browse_count')->values()->take(10);
        $return['collectList']=Good::select('id','name')->withCount(['collect'=>function($q){
            $q->where('created_at','>=',date("Y-m-d 00:00:00"))->where('created_at','<=',date("Y-m-d 23:59:59"));
        }])->get()->sortByDesc('collect_count')->values()->take(10);
        $return['salesList']=Good::select('id','name')->withCount(['goodIndentCommodity as commodity_sum' =>function($query){
            $query->where('created_at','>=',date("Y-m-d 00:00:00"))->where('created_at','<=',date("Y-m-d 23:59:59"))->select(DB::raw("sum(number) as commodity_sum"));
        }])->get()->sortByDesc('commodity_sum')->values()->take(10);
        $return['chart']=array_values($return['chart']);
        return resReturn(1,$return);
    }
}
