<?php

namespace App\Http\Controllers\v1\Plugin\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitCommentRequest;
use App\Models\v1\Comment;
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
     * CommentList
     * 评价列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  model_id int 评论关联模型ID
     * @queryParam  model_type string 评论关联的模型
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = Comment::query();
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->model_id) {
            $q->where('model_id', $request->model_id);
        }
        if ($request->model_type) {
            $q->where('model_type', 'App\\Models\\v1\\' . $request->model_type);
        }
        Comment::$withoutAppends = false;
        $limit = $request->limit;
        $paginate = $q->where('parent_id', 0)->with(['resourcesMany', 'Reply'])->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * CommentCreate
     * 评价回复
     * @param Request $request
     * @return string
     * @queryParam  reply string 回复内容
     * @queryParam  parent_id int 父节点ID
     * @queryParam  model_id int 评论关联模型ID
     * @queryParam  model_type string 评论关联的模型
     */
    public function create(Request $request)
    {
        if (!$request->reply) {
            return resReturn(0, '回复内容不能为空', Code::CODE_PARAMETER_WRONG);
        }
        if (!$request->parent_id || !$request->model_id || !$request->model_type) {
            return resReturn(0, '参数有误', Code::CODE_PARAMETER_WRONG);
        }
        $Comment = new Comment();
        $Comment->parent_id = $request->parent_id;
        $Comment->details = $request->reply;
        $Comment->model_id = $request->model_id;
        $Comment->model_type = $request->model_type;
        $Comment->state = Comment::COMMENT_STATE_PASS;
        $Comment->save();
        return resReturn(1, '回复成功');
    }

    /**
     * CommentEdit
     * 评价操作
     * @param $state
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 审核结果
     */
    public function edit($state, Request $request)
    {
        if (!$state) {
            return resReturn(0, '参数有误', Code::CODE_PARAMETER_WRONG);
        }
        $Comment = Comment::find($request->id);
        $Comment->state = $state;
        $Comment->save();
        return resReturn(1, '审核成功');
    }

    /**
     * CommentDestroy
     * 评论删除
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 评论ID
     */
    public function destroy($id, Request $request)
    {
        $return = DB::transaction(function () use ($request, $id) {
            if ($id > 0) {
                Comment::destroy($id);
                Comment::where('parent_id', $id)->delete();
            } else {
                if (!$request->all()) {
                    return resReturn(0, '请选择内容', Code::CODE_WRONG);
                }
                $idData = collect($request->all())->pluck('id');
                Comment::destroy($idData);
                Comment::whereIn('parent_id', $idData)->delete();
            }
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '删除成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }
}
