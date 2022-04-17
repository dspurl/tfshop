<?php

namespace App\Http\Controllers\v1\Plugin\Client;

use App\Code;
use App\Models\v1\Article;
use App\Models\v1\Column;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * Article
 * 文章
 * Class ArticleController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class ArticleController extends Controller
{
    /**
     * ArticleList
     * 文章列表
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 栏目ID
     * @queryParam  limit int 每页显示条数
     * @queryParam  page string 页码
     */
    public function list($id, Request $request)
    {
        if (!$id) {
            return resReturn(0, '非法操作', Code::CODE_MISUSE);
        }
        $q = Article::query();
        $q->orderBy('sort', 'ASC')->orderBy('created_at', 'ASC');
        $limit = $request->limit;
        $q->where('column_id', $id);
        $q->select('id', 'name', 'pv', 'created_at');
        $paginate = $q->with(['resources'])->paginate($limit);
        // 获取栏目下的文章
        $return['paginate'] = $paginate;
        $ColumnAll = Column::where('is_show', Column::COLUMN_IS_SHOW_YES)
            ->where('is_list', Column::COLUMN_IS_LIST_YES)
            ->select('id', 'pid', 'name')
            ->get();
        // 获取当前栏目信息
        $return['column'] = Column::select('id', 'pid', 'name', 'template', 'keyword', 'describes', 'created_at')->with(['ColumnProperty' => function ($q) {
            $q->select('details', 'column_id');
        }, 'resources'])->find($id);
        // 获取面包碎屑(根据pid进行层级排序，故子级分类ID需小于父级，不然将导致排序错乱)
        if ($return['column']) {
            $return['breadcrumb'] = collect(getParentClassHierarchyData($return['column']->pid, $ColumnAll->toArray()))->sortBy('pid')->values();
            // 获取同级栏目列表
            $return['menu'] = Column::select('id', 'pid', 'name')->where('is_show', Column::COLUMN_IS_SHOW_YES)->where('pid', $return['column']->pid)->orderBy('sort', 'ASC')->orderBy('created_at', 'ASC')->get();
        }
        return resReturn(1, $return);
    }

    /**
     * ArticleDetail
     * 文章详情
     * @param $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 文章ID
     */
    public function detail($id)
    {
        $return = Article::select('id', 'column_id', 'name', 'template', 'keyword', 'describes', 'created_at', 'pv', 'updated_at')->with(['ArticleProperty' => function ($q) {
            $q->select('details', 'article_id');
        }, 'resources', 'Column' => function ($q) {
            $q->select('id', 'name');
        }])->find($id);
        return resReturn(1, $return);
    }

    /**
     * ArticlePv
     * 增加文章访问量
     * @param $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 文章ID
     */
    public function pv($id)
    {
        Article::where('id', $id)->increment('pv');
        return resReturn(1, '成功');
    }
}
