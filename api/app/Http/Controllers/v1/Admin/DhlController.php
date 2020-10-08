<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Requests\v1\SubmitDhlRequest;
use App\Models\v1\Dhl;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class DhlController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Dhl::$withoutAppends = false;
        $q = Dhl::query();
        $limit=$request->limit;
        $paginate=$q->paginate($limit);
        return resReturn(1,$paginate);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitDhlRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubmitDhlRequest $request)
    {
        $return=DB::transaction(function ()use($request){
            $Dhl=new Dhl();
            $Dhl->name = $request->name;
            $Dhl->abbreviation = $request->abbreviation;
            $Dhl->state = $request->state;
            $Dhl->sort = $request->sort;
            $Dhl->save();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'添加成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param SubmitDhlRequest $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubmitDhlRequest $request, $id)
    {
        $return=DB::transaction(function ()use($request,$id){
            $Dhl = Dhl::find($id);
            $Dhl->name = $request->name;
            $Dhl->abbreviation = $request->abbreviation;
            $Dhl->state = $request->state;
            $Dhl->sort = $request->sort;
            $Dhl->save();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'更新成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
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
        $return=DB::transaction(function ()use($request,$id){
            Dhl::where('id',$id)->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }

    public function list()
    {
        $Dhl=Dhl::get();
        return resReturn(1,$Dhl);
    }
}
