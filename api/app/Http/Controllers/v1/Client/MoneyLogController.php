<?php

namespace App\Http\Controllers\v1\Client;

use App\Models\v1\MoneyLog;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MoneyLogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = MoneyLog::query();
        if($request->month){
            $start_date = date('Y-m-d 00:00:00', mktime(00, 00, 00, date('m', strtotime($request->month)), 01));
            $end_date = date('Y-m-d 23:59:59', mktime(23, 59, 59, date('m', strtotime($request->month))+1, 00));
            $q->where('created_at','>=',$start_date);
            $q->where('created_at','<=',$end_date);
        }
        $q->where('user_id',auth('web')->user()->id);
        $q->whereIn('type',[MoneyLog::MONEY_LOG_TYPE_INCOME,MoneyLog::MONEY_LOG_TYPE_EXPEND]);
        $q->orderBy('created_at','DESC');
        $limit=$request->limit;
        $get=$q->get();

        $return['paginate']=$q->paginate($limit);
        $return['income']=0;
        $return['expend']=0;
        foreach ($get as $g){
            if($g->type == MoneyLog::MONEY_LOG_TYPE_INCOME){
                $return['income']+=$g->money/100;
            }else{
                $return['expend']+=$g->money/100;
            }
        }
        return resReturn(1,$return);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function show($id,Request $request)
    {
        $MoneyLog=MoneyLog::where('user_id',auth('web')->user()->id)->find($id);
        return resReturn(1,$MoneyLog);
    }
}
