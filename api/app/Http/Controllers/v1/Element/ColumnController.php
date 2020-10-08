<?php

namespace App\Http\Controllers\v1\Element;

use App\Http\Requests\v1\SubmitColumnRequest;
use App\Models\v1\Column;
use App\Models\v1\ColumnProperty;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ColumnController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Column::query();
        $limit=$request->limit;
        if($request->title){
            $q->where('name',$request->title);
        }
        $paginate=$q->paginate($limit);
        foreach ($paginate as $id=>$p){
            if($p['pid'] == 0){
                $paginate[$id]['type_show']='顶级类目';
            }else{
                $pidData=Column::find($p['pid']);
                $paginate[$id]['type_show']=$pidData->name;
            }

        }
        return resReturn(1,$paginate);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitColumnRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubmitColumnRequest $request)
    {
        $return=DB::transaction(function ()use($request){
            $Column=new Column();
            $Column->apply_id = $request->header('applyid');
            $Column->name = $request->name;
            $Column->pid = $request->pid;
            $Column->keyword = $request->keyword;
            $Column->describes = $request->describes;
            $Column->shows = $request->shows;
            $Column->list = $request->list;
            $Column->sort = $request->sort;
            $Column->save();
            $ColumnProperty=new ColumnProperty();
            $ColumnProperty->column_id = $Column->id;
            $ColumnProperty->details = imgFindReplaceUpdate($request->column_property['details'],'column_details');
            $ColumnProperty->img = imgPathShift('column',$request->column_property['img']);
            $ColumnProperty->save();
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
        $return=[];
        $return['column']=Column::with('ColumnProperty')->find($id);
        $return['pidList']=Column::where('pid',0)->get();
        $Column=Column::where('pid',0)->get();
        if($Column){
            $return['pidList']=collect(genTree($Column,'pid'))->prepend(array(
                'id'=>0,
                'name'=>'顶级分组'
            ));
        }
        return resReturn(1,$return);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param SubmitColumnRequest $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubmitColumnRequest $request, $id)
    {
        $return=DB::transaction(function ()use($request,$id){
            $Column=Column::find($id);
            $Column->name = $request->name;
            $Column->pid = $request->pid;
            $Column->keyword = $request->keyword;
            $Column->describes = $request->describes;
            $Column->shows = $request->shows;
            $Column->list = $request->list;
            $Column->sort = $request->sort;
            $Column->save();
            $ColumnProperty=ColumnProperty::where('column_id',$Column->id)->first();
            $ColumnProperty->details = imgFindReplaceUpdate($request->column_property['details'],'column_details');
            $ColumnProperty->img = imgPathShift('column',$request->column_property['img']);
            $ColumnProperty->save();
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
            Column::where('id',$id)->delete();
            ColumnProperty::where('column_id',$id)->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }
}
