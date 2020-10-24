<?php

namespace App\Http\Controllers\v1\Plugin;

use App\Code;
use App\Models\v1\Comment;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodIndentCommodity;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Comment::query();
        if($request->model_id){
            $q->where('model_id',$request->model_id);
        }
        if($request->model_type){
            $q->where('model_type','App\\Models\\v1\\'.$request->model_type);
        }
        Comment::$withoutAppends = false;
        $limit=$request->limit;
        $paginate=$q->where('parent_id',0)->with(['resourcesMany','Reply'])->paginate($limit);
        return resReturn(1,$paginate);
    }

    public function reply(Request $request){
        if(!$request->reply){
            return resReturn(0,'回复内容不能为空',Code::CODE_PARAMETER_WRONG);
        }
        if(!$request->parent_id || !$request->model_id || !$request->model_type){
            return resReturn(0,'参数有误',Code::CODE_PARAMETER_WRONG);
        }
        $Comment = new Comment();
        $Comment->parent_id = $request->parent_id;
        $Comment->details = $request->reply;
        $Comment->model_id = $request->model_id;
        $Comment->model_type = $request->model_type;
        $Comment->state = Comment::COMMENT_STATE_PASS;
        $Comment->save();
        return resReturn(1,'回复成功');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store($id,Request $request)
    {
        $return=DB::transaction(function ()use($request,$id){
            foreach ($request->all() as $data){
                $Comment=new Comment();
                if(!$data['id']){
                    return ['参数有误',Code::CODE_PARAMETER_WRONG];
                }
                if(!$data['score']){
                    return ['星级评分不能为空',Code::CODE_PARAMETER_WRONG];
                }
                if(!$data['details']){
                    return ['评价内容不能为空',Code::CODE_PARAMETER_WRONG];
                }
                $Comment->user_id = auth('web')->user()->id;
                $Comment->model_id= $data['id'];
                $Comment->score= $data['score'];
                $Comment->model_type = 'App\Models\v1\GoodIndentCommodity';
                $Comment->details = $data['details'];
                $Comment->state= Comment::COMMENT_STATE_PASS;
                $Comment->anonymity = $data['anonymity'];
                $Comment->save();
                if($data['resources']){
                    foreach ($data['resources'] as $id =>$img){
                        $Resource=new Resource();
                        $Resource->type = Resource::RESOURCE_TYPE_IMG;
                        $Resource->depict = 'comment_'.$Comment->id;
                        $Resource->image_id = $Comment->id;
                        $Resource->image_type = 'App\Models\v1\Comment';
                        $Resource->img = imgPathShift('comment',$img);
                        $Resource->save();
                    }
                }
                $GoodIndent=GoodIndent::find($id);
                $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH;
                $GoodIndent->save();
            }
            return array(1);
        }, 5);
        if($return[0] == 1){
            return resReturn(1,'添加成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }

    /**
     *
     * @param  int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function update($id, Request $request)
    {
        if(!$id){
            return resReturn(0,'参数有误',Code::CODE_PARAMETER_WRONG);
        }
        $Comment=Comment::find($request->id);
        $Comment->state = $id;
        $Comment->save();
        return resReturn(1,'审核成功');
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
            Comment::where('id',$id)->delete();
            Comment::where('parent_id',$id)->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }

    /**
     * 获取需要评价的商品列表
     * @param $id
     * @return string
     */
    public function goodIndentCommodity($id)
    {
        GoodIndentCommodity::$withoutAppends = false;
        $GoodIndentCommodity = GoodIndentCommodity::where('good_indent_id',$id)->orderBy('created_at','ASC')->get();
        return resReturn(1,$GoodIndentCommodity);
    }

    /**
     * 商品评价
     * @param $id
     * @param Request $request
     * @return string
     */
    public function goodEvaluate(Request $request){
        $q = GoodIndentCommodity::query();
        $limit=$request->limit;
        $paginate=$q->where('good_id',$request->good_id)->whereHas('GoodIndent',function($q){
            $q->where('state',GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH);
        })->with(['goodSku'=>function($q){
            $q->select('id','product_sku');
        },'Comment'=>function($q){
            $q->with(['User'=>function($q){
                $q->select('portrait','id','cellphone','nickname');
            },'resourcesMany','Reply'=>function($q){
                $q->select('id','parent_id','details');
            }]);
        }])->orderBy('created_at','DESC')->paginate($limit);
        foreach ($paginate as $id=>$p){
            if($p->Comment->anonymity == Comment::COMMENT_ANONYMITY_YES){
                $p->Comment->name = '匿名用户';
            }else{
                if($p->Comment->User->nickname){    //有昵称则为昵称
                    $p->Comment->name = mb_substr($p->Comment->User->nickname, 0, 1,'utf-8').'**'.mb_substr($p->Comment->User->nickname,-1, 1,'utf-8');
                }else{  //手机号
                    $p->Comment->name = mb_substr($p->Comment->User->cellphone, 0, 3,'utf-8').'**'.mb_substr($p->Comment->User->cellphone,-3,3,'utf-8');
                }
            }
            $p->Comment->portrait=$p->Comment->User->portrait;
            unset($p->Comment->User);
        }
        return resReturn(1,$paginate);
    }
}
