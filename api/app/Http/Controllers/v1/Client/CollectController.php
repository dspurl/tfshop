<?php

namespace App\Http\Controllers\v1\Client;

use App\Code;
use App\Http\Requests\v1\SubmitCollectRequest;
use App\Models\v1\Collect;
use App\Models\v1\Good;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class CollectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Collect::query();
        Good::$withoutAppends = false;
        $q->where('user_id',auth('web')->user()->id);
        $limit=$request->limit;
        $paginate=$q->with(['Good'=>function($q){
            $q->select('id','order_price','name')->with(['resources']);
        }])->paginate($limit);
        return resReturn(1,$paginate);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitCollectRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubmitCollectRequest $request)
    {
        $return=DB::transaction(function ()use($request){
            $Collect=new Collect();
            $Collect->user_id = auth('web')->user()->id;
            $Collect->good_id = $request->id;
            $Collect->save();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'添加成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $Collect=Collect::where('user_id',auth('web')->user()->id)->where('good_id',$id)->count();
        return resReturn(1,$Collect);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        if(!$id){
            return resReturn(0,'参数有误',Code::CODE_MISUSE);
        }
        $return=DB::transaction(function ()use($request,$id){
            Collect::where('user_id',auth('web')->user()->id)->where('good_id',$id)->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }
}
