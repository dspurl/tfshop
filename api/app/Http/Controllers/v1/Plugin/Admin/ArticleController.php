<?php

namespace App\Http\Controllers\v1\Plugin\Admin;

use App\Http\Requests\v1\SubmitArticleRequest;
use App\Models\v1\Article;
use App\Models\v1\ArticleProperty;
use App\Models\v1\Column;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

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
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  title string 文章名称
     * @queryParam  type int 栏目
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = Article::query();
        $limit = $request->limit;
        $Column = Column::where('is_show', Column::COLUMN_IS_SHOW_YES)->where('is_list', Column::COLUMN_IS_LIST_YES)->get();
        foreach ($Column as $id => $c) {
            $Column[$id]->label = $c->name;
            $Column[$id]->value = $c->id;
        }
        if ($request->title) {
            $q->where('name', 'like', '%' . $request->title . '%');
        }
        if ($request->has('type')) {
            if ($request->type) {
                $type = $request->type[count($request->type) - 1];
                $allSublevel = allSublevel($Column->toArray(), [$type]);
                $q->whereIn('column_id', $allSublevel);
            }
        }
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $paginate = $q->with(['Column'])->paginate($limit);
        $return['paginate'] = $paginate;
        $return['column'] = collect(genTree($Column->toArray(), 'pid'));
        return resReturn(1, $return);
    }

    /**
     * ArticleCreate
     * 文章添加
     * @param SubmitArticleRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 文章名称
     * @queryParam  column_id int 栏目ID
     * @queryParam  keyword string 关键字
     * @queryParam  describes string 描述
     * @queryParam  template string 模板
     * @queryParam  show int 是否显示
     * @queryParam  sort int 排序
     */
    public function create(SubmitArticleRequest $request)
    {
        $return = DB::transaction(function () use ($request) {
            $Article = new Article();
            $Article->name = $request->name;
            $Article->keyword = $request->keyword;
            $Article->describes = $request->describes;
            $Article->template = $request->template;
            $Article->is_show = $request->is_show;
            $Article->column_id = is_array($request->column_id) ? $request->column_id[count($request->column_id) - 1] : $request->column_id;
            $Article->sort = $request->sort;
            $Article->save();
            $ArticleProperty = new ArticleProperty();
            $ArticleProperty->article_id = $Article->id;
            $ArticleProperty->details = imgFindReplaceUpdate($request->article_property['details'], 'article');
            $ArticleProperty->save();
            if ($request->resources['img']) {
                $Resource = new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'article_' . $Article->id;
                $Resource->image_id = $Article->id;
                $Resource->image_type = 'App\Models\v1\Article';
                $Resource->img = imgPathShift('article', $request->resources['img']);
                $Resource->save();
            }
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '添加成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }

    /**
     * ArticleDetail
     * 文章详情
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 文章ID
     */
    public function detail($id)
    {
        Article::$withoutAppends = false;
        $return['article'] = Article::with('ArticleProperty', 'resources')->find($id);
        $Column = Column::where('is_list', Column::COLUMN_IS_LIST_YES)->get();
        $return['column'] = genTree($Column->toArray(), 'pid');
        return resReturn(1, $return);
    }

    /**
     * ArticleEdit
     * 文章更新
     * @param SubmitArticleRequest $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 文章ID
     * @queryParam  name string 文章名称
     * @queryParam  column_id int 栏目ID
     * @queryParam  keyword string 关键字
     * @queryParam  describes string 描述
     * @queryParam  template string 模板
     * @queryParam  show int 是否显示
     * @queryParam  sort int 排序
     */
    public function edit(SubmitArticleRequest $request, $id)
    {
        $return = DB::transaction(function () use ($request, $id) {
            $Article = Article::find($id);
            $Article->name = $request->name;
            $Article->keyword = $request->keyword;
            $Article->describes = $request->describes;
            $Article->template = $request->template;
            $Article->is_show = $request->is_show;
            $Article->column_id = is_array($request->column_id) ? $request->column_id[count($request->column_id) - 1] : $request->column_id;
            $Article->sort = $request->sort;
            $Article->save();
            $ArticleProperty = ArticleProperty::where('article_id', $Article->id)->first();
            $ArticleProperty->details = imgFindReplaceUpdate($request->article_property['details'], 'article');
            $ArticleProperty->save();
            if ($request->resources) {
                if (array_key_exists('id', $request->resources)) {
                    $Resource = Resource::find($request->resources['id']);
                    if ($request->resources['img'] != $Resource->img) {
                        imgPathDelete('article', $Resource->img);
                    }
                    $Resource->img = imgPathShift('article', $request->resources['img']);
                    $Resource->save();
                } else {
                    if ($request->resources['img']) {
                        $Resource = new Resource();
                        $Resource->type = Resource::RESOURCE_TYPE_IMG;
                        $Resource->depict = 'article_' . $Article->id;
                        $Resource->image_id = $Article->id;
                        $Resource->image_type = 'App\Models\v1\Article';
                        $Resource->img = imgPathShift('article', $request->resources['img']);
                        $Resource->save();
                    }
                }
            }
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '更新成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }

    /**
     * ArticleDestroy
     * 文章删除
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 文章ID
     */
    public function destroy($id, Request $request)
    {
        $return = DB::transaction(function () use ($id, $request) {
            if ($id == 0) {
                foreach ($request->all() as $r) {
                    $Resource = Resource::where('image_type', 'App\Models\v1\Article')->where('image_id', $r['id'])->first();
                    if ($Resource) {
                        Resource::destroy($Resource->id);
                        imgPathDelete('article', $Resource->img);
                    }
                    Article::destroy($r['id']);
                }
            } else {
                $Resource = Resource::where('image_type', 'App\Models\v1\Article')->where('image_id', $id)->first();
                if ($Resource) {
                    Resource::destroy($Resource->id);
                    imgPathDelete('article', $Resource->img);
                }
                Article::destroy($id);
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
