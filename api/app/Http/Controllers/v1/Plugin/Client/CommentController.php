<?php

namespace App\Http\Controllers\v1\Plugin\Client;

use App\Code;
use App\Models\v1\Comment;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodIndentCommodity;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * Comment
 * 评论
 * Class CommentController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class CommentController extends Controller
{
    /**
     * CommentCreate
     * 评论评价
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 订单ID
     */
    public function create($id, Request $request)
    {
        $return = DB::transaction(function () use ($request, $id) {
            foreach ($request->all() as $data) {
                $Comment = new Comment();
                if (!$data['id']) {
                    return ['参数有误', Code::CODE_PARAMETER_WRONG];
                }
                if (!$data['score']) {
                    return ['星级评分不能为空', Code::CODE_PARAMETER_WRONG];
                }
                if (!$data['details']) {
                    return ['评价内容不能为空', Code::CODE_PARAMETER_WRONG];
                }
                $Comment->user_id = auth('web')->user()->id;
                $Comment->model_id = $data['id'];
                $Comment->score = $data['score'];
                $Comment->model_type = 'App\Models\v1\GoodIndentCommodity';
                $Comment->details = $data['details'];
                $Comment->state = Comment::COMMENT_STATE_PASS;
                $Comment->anonymity = $data['anonymity'];
                $Comment->save();
                if ($data['resources']) {
                    foreach ($data['resources'] as $rid => $img) {
                        $Resource = new Resource();
                        $Resource->type = Resource::RESOURCE_TYPE_IMG;
                        $Resource->depict = 'comment_' . $Comment->id;
                        $Resource->image_id = $Comment->id;
                        $Resource->image_type = 'App\Models\v1\Comment';
                        $Resource->img = imgPathShift('comment', $img);
                        $Resource->save();
                    }
                }
            }
            return array(1);
        }, 5);
        if ($return[0] == 1) {
            return resReturn(1, '添加成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }

    /**
     * CommentDetail
     * 评论详情
     * @param $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 商品ID
     */
    public function detail($id)
    {
        GoodIndentCommodity::$withoutAppends = false;
        $GoodIndentCommodity = GoodIndentCommodity::where('good_indent_id', $id)->orderBy('created_at', 'ASC')->get();
        return resReturn(1, $GoodIndentCommodity);
    }

    /**
     * 商品评价列表
     * @param Request $request
     * @return string
     * @queryParam  good_id int 商品ID
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function good(Request $request)
    {
        $q = GoodIndentCommodity::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $paginate = $q->where('good_id', $request->good_id)->whereHas('GoodIndent', function ($q) {
            $q->where('state', GoodIndent::GOOD_INDENT_STATE_HAVE_EVALUATION);
        })->with(['goodSku' => function ($q) {
            $q->select('id', 'product_sku');
        }, 'Comment' => function ($q) {
            $q->with(['User' => function ($q) {
                $q->select('portrait', 'id', 'cellphone', 'nickname');
            }, 'resourcesMany', 'Reply' => function ($q) {
                $q->select('id', 'parent_id', 'details');
            }]);
        }])->paginate($limit);
        foreach ($paginate as $id => $p) {
            if (isset($p->Comment->anonymity) && $p->Comment->anonymity == Comment::COMMENT_ANONYMITY_YES) {
                $p->Comment->name = '匿名用户';
            } else {
                if (isset($p->Comment->User->nickname)) {    //有昵称则为昵称
                    $p->Comment->name = mb_substr($p->Comment->User->nickname, 0, 1, 'utf-8') . '**' . mb_substr($p->Comment->User->nickname, -1, 1, 'utf-8');
                } else if (isset($p->Comment->User->cellphone)) {  //手机号
                    $p->Comment->name = mb_substr($p->Comment->User->cellphone, 0, 3, 'utf-8') . '**' . mb_substr($p->Comment->User->cellphone, -3, 3, 'utf-8');
                }
            }
            if (isset($p->Comment->User->portrait)) {
                $p->Comment->portrait = $p->Comment->User->portrait;
            }
            unset($p->Comment->User);
        }
        return resReturn(1, $paginate);
    }
}
