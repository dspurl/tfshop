<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitSpecificationRequest;
use App\Models\v1\Specification;
use App\Models\v1\SpecificationGroup;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class SpecificationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Specification::query();
        $limit=$request->limit;
        $q->orderBy('id','ASC');
        if($request->title){
            $q->where('name','like','%'.$request->title.'%');
        }
        $paginate=$q->with(['SpecificationGroup'])->paginate($limit);
        $return= [];
        $return['paginate'] = $paginate;
        $return['SpecificationGroup'] = SpecificationGroup::select('id','name')->get();
        return resReturn(1,$return);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitSpecificationRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(SubmitSpecificationRequest $request)
    {
        $return=DB::transaction(function ()use($request){
            $Specification=new Specification();
            $Specification->name=$request->name;
            $Specification->label=$request->label ? $request->label : $request->name;
            $Specification->type=$request->type;
            $Specification->is_search=$request->is_search;
            $Specification->location=$request->location;
            $Specification->specification_group_id=$request->specification_group_id;
            $Specification->value=$request->value;
            $Specification->sort=$request->sort;
            $Specification->save();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'成功');
        }else{
            return resReturn(0,'添加失败',Code::CODE_PARAMETER_WRONG);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param SubmitSpecificationRequest|Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubmitSpecificationRequest $request, $id)
    {
        $return=DB::transaction(function ()use($request,$id){
            $Specification=Specification::find($id);
            $Specification->name=$request->name;
            $Specification->label=$request->label ? $request->label : $request->name;
            $Specification->type=$request->type;
            $Specification->is_search=$request->is_search;
            $Specification->location=$request->location;
            $Specification->specification_group_id=$request->specification_group_id;
            $Specification->value=$request->value;
            $Specification->sort=$request->sort;
            $Specification->save();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'更新成功');
        }else{
            return resReturn(0,'更新失败',Code::CODE_PARAMETER_WRONG);
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
            Specification::where('id',$id)->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,'删除失败',Code::CODE_PARAMETER_WRONG);
        }
    }
}
