<?php

namespace App\Http\Controllers\v1\Client;

use App\Code;
use App\Http\Requests\v1\SubmitTemplateRequest;
use App\Models\v1\Common;
use App\Models\v1\Template;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class TemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if(!$request->header('apply-secret') || $request->header('apply-secret') =='undefined'){
            return resReturn(0,'非法操作',Code::CODE_MISUSE);
        }
        $apply=Common::applySecret($request->header('apply-secret'));
        $q = Template::query();
        $q->where('apply_id',$apply['id']);
        $limit=$request->limit;
        $paginate=$q->paginate($limit);
        return resReturn(1,$paginate);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitTemplateRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubmitTemplateRequest $request)
    {
        if(!$request->header('apply-secret') || $request->header('apply-secret') =='undefined'){
            return resReturn(0,'非法操作',Code::CODE_MISUSE);
        }
        $apply=Common::applySecret($request->header('apply-secret'));
        $return=DB::transaction(function ()use($request,$apply){
            $Template=new Template();
            $Template->apply_id = $apply['id'];
            $Template->save();
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
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function show($id,Request $request)
    {
        if(!$request->header('apply-secret') || $request->header('apply-secret') =='undefined'){
            return resReturn(0,'非法操作',Code::CODE_MISUSE);
        }
        $apply=Common::applySecret($request->header('apply-secret'));
        $Template=Template::where('apply_id',$apply['id'])->find($id);
        return resReturn(1,$Template);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param SubmitTemplateRequest $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubmitTemplateRequest $request, $id)
    {
        if(!$request->header('apply-secret') || $request->header('apply-secret') =='undefined'){
            return resReturn(0,'非法操作',Code::CODE_MISUSE);
        }
        $apply=Common::applySecret($request->header('apply-secret'));
        $return=DB::transaction(function ()use($request,$id,$apply){
            $Template=Template::where('apply_id',$apply['id'])->find($id);
            $Template->save();
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
        if(!$request->header('apply-secret') || $request->header('apply-secret') =='undefined'){
            return resReturn(0,'非法操作',Code::CODE_MISUSE);
        }
        $apply=Common::applySecret($request->header('apply-secret'));
        $return=DB::transaction(function ()use($request,$id,$apply){
            Template::where('apply_id',$apply['id'])->where('id',$id)->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }
}
