<?php
namespace App\Http\Controllers\v1\Plugin\Admin;
use App\Code;
use App\Http\Requests\v1\SubmitArticlePropertyRequest;
use App\Models\v1\ArticleProperty;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
/**
 * ArticleProperty
 * 文章属性
 * Class ArticlePropertyController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class ArticlePropertyController extends Controller
{
    /**
     * ArticlePropertyList
     * 文章属性列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = ArticleProperty::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }
    /**
     * ArticlePropertyCreate
     * 文章属性添加
     * @param SubmitArticlePropertyRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 
     * @queryParam  article_id int 文章ID
     * @queryParam  details string 详情
     */
    public function create(SubmitArticlePropertyRequest $request)
    {
        $return = DB::transaction(function () use ($request) {
            $ArticleProperty = new ArticleProperty();
            $ArticleProperty->id = $request->id;
            $ArticleProperty->article_id = $request->article_id;
            $ArticleProperty->details = $request->details;
            $ArticleProperty->save();
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '添加成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }
    /**
     * ArticlePropertyDetail
     * 文章属性详情
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 文章属性ID
     */
    public function detail($id)
    {
        ArticleProperty::$withoutAppends = false;
        $ArticleProperty = ArticleProperty::find($id);
        return resReturn(1, $ArticleProperty);
    }
    /**
     * ArticlePropertyEdit
     * 文章属性更新
     * @param SubmitArticlePropertyRequest $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 文章属性ID
     * @queryParam  id int 
     * @queryParam  article_id int 文章ID
     * @queryParam  details string 详情
     */
    public function edit(SubmitArticlePropertyRequest $request, $id)
    {
        $return = DB::transaction(function () use ($request, $id) {
            $ArticleProperty = ArticleProperty::find($id);
            $ArticleProperty->id = $request->id;
            $ArticleProperty->article_id = $request->article_id;
            $ArticleProperty->details = $request->details;
            $ArticleProperty->save();
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '更新成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }
    /**
     * ArticlePropertyDestroy
     * 文章属性删除
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 文章属性ID
     */
    public function destroy($id, Request $request)
    {
        DB::transaction(function () use ($request, $id) {
            if ($id > 0) {
                ArticleProperty::destroy($id);
            } else {
                if (!$request->all()) {
                    throw new \Exception('请选择内容', Code::CODE_WRONG);
                }
                $idData = collect($request->all())->pluck('id');
                ArticleProperty::destroy($idData);
            }
        }, 5);
        return resReturn(1, '删除成功');
    }
}
