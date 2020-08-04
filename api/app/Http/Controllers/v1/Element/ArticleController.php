<?php

namespace App\Http\Controllers\v1\Element;

use App\Http\Requests\v1\SubmitArticleRequest;
use App\Models\v1\Article;
use App\Models\v1\ArticleProperty;
use App\Models\v1\Column;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Article::query();
        $limit=$request->limit;
        if($request->title){
            $q->where('name',$request->title);
        }
        if($request->type){
            $q->where('column_id',$request->type);
        }
        $paginate=$q->with(['Column'])->paginate($limit);
        $return['paginate']=$paginate;
        $return['column']=Column::where('list',Column::ARTICLE_LIST_YES)->get();
        return resReturn(1,$return);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitArticleRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubmitArticleRequest $request)
    {
        $return=DB::transaction(function ()use($request){
            $Article=new Article();
            $Article->apply_id = $request->header('applyid');
            $Article->name = $request->name;
            $Article->keyword = $request->keyword;
            $Article->describes = $request->describes;
            $Article->shows = $request->shows;
            $Article->column_id = $request->column_id;
            $Article->sort = $request->sort;
            $Article->save();
            $ArticleProperty=new ArticleProperty();
            $ArticleProperty->article_id = $Article->id;
            $ArticleProperty->details = imgFindReplaceUpdate($request->article_property['details'],'article_details');
            $ArticleProperty->img = imgPathShift('article',$request->article_property['img']);
            $ArticleProperty->save();
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
        $return['article']=Article::with('ArticleProperty')->find($id);
        $return['column']=Column::where('list',Column::ARTICLE_LIST_YES)->get();
        return resReturn(1,$return);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param SubmitArticleRequest $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubmitArticleRequest $request, $id)
    {
        $return=DB::transaction(function ()use($request,$id){
            $Article=Article::find($id);
            $Article->name = $request->name;
            $Article->keyword = $request->keyword;
            $Article->describes = $request->describes;
            $Article->shows = $request->shows;
            $Article->column_id = $request->column_id;
            $Article->sort = $request->sort;
            $Article->save();
            $ArticleProperty=ArticleProperty::where('article_id',$Article->id)->first();
            $ArticleProperty->details = imgFindReplaceUpdate($request->article_property['details'],'article_details');
            $ArticleProperty->img = imgPathShift('article',$request->article_property['img']);
            $ArticleProperty->save();
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
            Article::where('id',$id)->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }
}
