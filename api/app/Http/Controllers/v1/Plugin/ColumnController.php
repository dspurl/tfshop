<?php

namespace App\Http\Controllers\v1\Plugin;

use App\Http\Requests\v1\SubmitColumnRequest;
use App\Models\v1\Article;
use App\Models\v1\ArticleProperty;
use App\Models\v1\Column;
use App\Models\v1\ColumnProperty;
use App\Models\v1\Resource;
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
        $q->querySort($request->sort);
        $limit=$request->limit;
        if($request->title){
            $q->where('name',$request->title);
        }
        $paginate=$q->with(['Column'])->paginate($limit);
        return resReturn(1,$paginate);
    }

    /**
     * APP栏目列表
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function appIndex(Request $request)
    {
        $q = Column::query();
        $q->orderBy('sort','ASC')->orderBy('created_at','ASC');
        $limit=$request->limit;
        $paginate=$q->with(['resources'])->paginate($limit);
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
            $Column->name = $request->name;
            $Column->pid = $request->pid;
            $Column->keyword = $request->keyword;
            $Column->describes = $request->describes;
            $Column->show = $request->show ? Column::COLUMN_SHOW_YES : Column::COLUMN_SHOW_NO;
            $Column->list = $request->list;
            $Column->sort = $request->sort;
            $Column->save();
            $ColumnProperty=new ColumnProperty();
            $ColumnProperty->column_id = $Column->id;
            $ColumnProperty->details = $request->column_property['details'];
            $ColumnProperty->save();
            if($request->resources['img']){
                $Resource=new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'column_'.$Column->id;
                $Resource->image_id = $Column->id;
                $Resource->image_type = 'App\Models\v1\Column';
                $Resource->img = imgPathShift('column',$request->resources['img']);
                $Resource->save();
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $return=[];
        $return['column']=Column::with(['ColumnProperty','resources'])->find($id);
        $Column=Column::where('pid',0)->where('id','!=',$id)->get();
        if($Column){
            $return['pidList']=collect($Column)->prepend(array(
                'id'=>0,
                'name'=>'顶级分组'
            ));
        }
        return resReturn(1,$return);
    }

    /**
     * APP栏目详情
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function appShow($id)
    {
        $return=Column::with(['ColumnProperty','resources'])->find($id);
        return resReturn(1,$return);
    }

    /**
     * 增加栏目访问量
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function pv($id)
    {
        Column::where('id', $id)->increment('pv');
        return resReturn(1,'成功');
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
            $Column->show = $request->show ? Column::COLUMN_SHOW_YES : Column::COLUMN_SHOW_NO;
            $Column->list = $request->list;
            $Column->sort = $request->sort;
            $Column->save();
            $ColumnProperty=ColumnProperty::where('column_id',$Column->id)->first();
            $ColumnProperty->details = $request->column_property['details'];
            $ColumnProperty->save();
            if($request->resources){
                if(array_key_exists('id',$request->resources)){
                    $Resource=Resource::find($request->resources['id']);
                    if($request->resources['img'] !=$Resource->img){
                        imgPathDelete('column',$Resource->img);
                    }
                    $Resource->img = imgPathShift('column',$request->resources['img']);
                    $Resource->save();
                }else{
                    if($request->resources['img']){
                        $Resource=new Resource();
                        $Resource->type = Resource::RESOURCE_TYPE_IMG;
                        $Resource->depict = 'column_'.$Column->id;
                        $Resource->image_id = $Column->id;
                        $Resource->image_type = 'App\Models\v1\Column';
                        $Resource->img = imgPathShift('column',$request->resources['img']);
                        $Resource->save();
                    }
                }
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
            imgPathDelete('column',$request->img);
            Column::where('id',$id)->delete();
            ColumnProperty::where('column_id',$id)->delete();
            //删除栏目下的文章
            $Article = Article::where('column_id',$id)->with(['resources'])->get();
            foreach ($Article as $a){
                imgPathDelete('article',$a->resources->img);
                Article::where('id',$a->id)->delete();
                ArticleProperty::where('article_id',$a-id)->delete();
            }
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }
}
