<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Requests\v1\SubmitFreightRequest;
use App\Models\v1\Freight;
use App\Models\v1\FreightWay;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class FreightController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        FreightWay::$withoutAppends = false;
        $q = Freight::query();
        $q->with(['FreightWay']);
        $limit=$request->limit;
        $paginate=$q->paginate($limit);
        return resReturn(1,$paginate);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitFreightRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubmitFreightRequest $request)
    {
        $return=DB::transaction(function ()use($request){
            $Freight=new Freight();
            $Freight->name = $request->name;
            $Freight->location = $request->location;
            $Freight->pinkage = $request->pinkage;
            $Freight->valuation = $request->valuation;
            $Freight->save();
            if(count($request->freight_way)>0){
                foreach ($request->freight_way as $freight_way){
                    $FreightWay = new FreightWay();
                    $FreightWay->freight_id = $Freight->id;
                    $FreightWay->first_piece = $freight_way['first_piece'];
                    $FreightWay->first_cost = $freight_way['first_cost'];
                    $FreightWay->add_piece = $freight_way['add_piece'];
                    $FreightWay->add_cost = $freight_way['add_cost'];
                    $FreightWay->location = $freight_way['location'];
                    $FreightWay->save();
                }
            }
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
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        Freight::$withoutAppends = false;
        FreightWay::$withoutAppends = false;
        $Freight=Freight::with(['FreightWay'])->find($id);
        return resReturn(1,$Freight);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param SubmitFreightRequest $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubmitFreightRequest $request, $id)
    {
        $return=DB::transaction(function ()use($request,$id){
            $Freight = Freight::find($id);
            $Freight->name = $request->name;
            $Freight->location = $request->location;
            $Freight->pinkage = $request->pinkage;
            $Freight->valuation = $request->valuation;
            $Freight->save();
            if(count($request->freight_way)>0){
                $idDelete= [];
                foreach ($request->freight_way as $freight_way){
                    if(array_key_exists('id',$freight_way)){
                        $FreightWay = FreightWay::find($freight_way['id']);
                    }else{
                        $FreightWay = new FreightWay();
                    }
                    $FreightWay->freight_id = $Freight->id;
                    $FreightWay->first_piece = $freight_way['first_piece'];
                    $FreightWay->first_cost = $freight_way['first_cost'];
                    $FreightWay->add_piece = $freight_way['add_piece'];
                    $FreightWay->add_cost = $freight_way['add_cost'];
                    $FreightWay->location = $freight_way['location'];
                    $FreightWay->save();
                    $idDelete[]=$FreightWay->id;
                }
                //删除去掉的不包邮配送区域
                FreightWay::where('freight_id',$Freight->id)->whereNotIn('id',$idDelete)->delete();
            }
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
            Freight::where('id',$id)->delete();
            FreightWay::where('freight_id',$id)->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }
}
