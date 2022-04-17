<?php
namespace App\Http\Controllers\v1\Plugin\Client;
use App\Models\v1\ArticleProperty;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = ArticleProperty::query();
        $q->orderBy('created_at', 'ASC');
        $limit = $request->limit;
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }
    /**
     * ArticlePropertyDetail
     * 文章属性详情
     * @param $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 文章属性ID
     */
    public function detail($id)
    {
        $return = ArticleProperty::find($id);
        return resReturn(1, $return);
    }
}
