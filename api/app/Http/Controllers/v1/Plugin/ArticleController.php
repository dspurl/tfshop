<?php

namespace App\Http\Controllers\v1\Plugin;

use App\Code;
use App\Http\Requests\v1\SubmitArticleRequest;
use App\Models\v1\Article;
use App\Models\v1\ArticleProperty;
use App\Models\v1\Column;
use App\Models\v1\Resource;
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
            $q->where('name','like','%'.$request->title.'%');
        }
        if($request->type){
            $q->where('column_id',$request->type);
        }
        $q->orderBy('id','DESC');
        $paginate=$q->with(['Column'])->paginate($limit);
        $return['paginate']=$paginate;
        $return['column']=Column::where('list',Column::COLUMN_LIST_YES)->get();
        return resReturn(1,$return);
    }

    /**
     * APP文章列表
     *
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function appIndex($id,Request $request)
    {
        if(!$id){
            return resReturn(0,'非法操作',Code::CODE_MISUSE);
        }
        $q = Article::query();
        $q->orderBy('sort','ASC')->orderBy('created_at','ASC');
        $limit=$request->limit;
        $q->where('column_id',$id);
        $paginate=$q->with(['resources'])->paginate($limit);
        return resReturn(1,$paginate);
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
            $Article->name = $request->name;
            $Article->keyword = $request->keyword;
            $Article->describes = $request->describes;
            $Article->show = $request->show ? Article::ARTICLE_SHOW_YES : Article::ARTICLE_SHOW_NO;
            $Article->column_id = $request->column_id[count($request->column_id)-1];
            $Article->sort = $request->sort;
            $Article->save();
            $ArticleProperty=new ArticleProperty();
            $ArticleProperty->article_id = $Article->id;
            $ArticleProperty->details = $request->article_property['details'];
            $ArticleProperty->save();
            if($request->resources['img']){
                $Resource=new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'article_'.$Article->id;
                $Resource->image_id = $Article->id;
                $Resource->image_type = 'App\Models\v1\Article';
                $Resource->img = imgPathShift('article',$request->resources['img']);
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
     * @param  int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function show($id,Request $request)
    {
        Article::$withoutAppends = false;
        $return['article']=Article::with('ArticleProperty','resources')->find($id);
        $Column=Column::where('list',Column::COLUMN_LIST_YES)->get();
        $return['column']=genTree($Column->toArray(),'pid');
        return resReturn(1,$return);
    }

    /**
     * APP文章详情
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function appShow($id)
    {
        $return=Article::with(['ArticleProperty','resources'])->find($id);
        return resReturn(1,$return);
    }

    /**
     * 增加文章访问量
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function pv($id)
    {
        Article::where('id', $id)->increment('pv');
        return resReturn(1,'成功');
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
            $Article->show = $request->show ? Article::ARTICLE_SHOW_YES : Article::ARTICLE_SHOW_NO;
            $Article->column_id = $request->column_id[count($request->column_id)-1];
            $Article->sort = $request->sort;
            $Article->save();
            $ArticleProperty=ArticleProperty::where('article_id',$Article->id)->first();
            $ArticleProperty->details = $request->article_property['details'];
            $ArticleProperty->save();
            if($request->resources){
                if(array_key_exists('id',$request->resources)){
                    $Resource=Resource::find($request->resources['id']);
                    if($request->resources['img'] !=$Resource->img){
                        imgPathDelete('article',$Resource->img);
                    }
                    $Resource->img = imgPathShift('article',$request->resources['img']);
                    $Resource->save();
                }else{
                    if($request->resources['img']){
                        $Resource=new Resource();
                        $Resource->type = Resource::RESOURCE_TYPE_IMG;
                        $Resource->depict = 'article_'.$Article->id;
                        $Resource->image_id = $Article->id;
                        $Resource->image_type = 'App\Models\v1\Article';
                        $Resource->img = imgPathShift('article',$request->resources['img']);
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
            imgPathDelete('article',$request->img);
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
