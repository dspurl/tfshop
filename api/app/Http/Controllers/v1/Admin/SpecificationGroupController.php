<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitSpecificationGroupRequest;
use App\Models\v1\SpecificationGroup;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class SpecificationGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = SpecificationGroup::query();
        $limit=$request->limit;
        $q->orderBy('id','ASC');
        if($request->title){
            $q->where('name','like','%'.$request->title.'%');
        }
        $paginate=$q->paginate($limit);
        return resReturn(1,$paginate);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitSpecificationGroupRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(SubmitSpecificationGroupRequest $request)
    {
        $return=DB::transaction(function ()use($request){
            $Specification=new SpecificationGroup();
            $Specification->name=$request->name;
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
     * @param SubmitSpecificationGroupRequest|Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubmitSpecificationGroupRequest $request, $id)
    {
        $return=DB::transaction(function ()use($request,$id){
            $Specification=SpecificationGroup::find($id);
            $Specification->name=$request->name;
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
            SpecificationGroup::where('id',$id)->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,'删除失败',Code::CODE_PARAMETER_WRONG);
        }
    }
}
