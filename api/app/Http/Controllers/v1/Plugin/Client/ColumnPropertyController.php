<?php
namespace App\Http\Controllers\v1\Plugin\Client;
use App\Models\v1\ColumnProperty;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
/**
 * ColumnProperty
 * 栏目属性
 * Class ColumnPropertyController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class ColumnPropertyController extends Controller
{
    /**
     * ColumnPropertyList
     * 栏目属性列表
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = ColumnProperty::query();
        $q->orderBy('created_at', 'ASC');
        $limit = $request->limit;
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }
    /**
     * ColumnPropertyDetail
     * 栏目属性详情
     * @param $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 栏目属性ID
     */
    public function detail($id)
    {
        $return = ColumnProperty::find($id);
        return resReturn(1, $return);
    }
}
