<?php
namespace App\Http\Controllers\v1\Plugin\Client;
use App\Models\v1\Column;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
/**
 * Column
 * 栏目
 * Class ColumnController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class ColumnController extends Controller
{
    /**
     * ColumnList
     * 栏目列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  title string 栏目名称
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = Column::query();
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }else{
            $q->orderBy('sort','ASC')->orderBy('created_at','ASC');
        }
        $limit=$request->limit;
        $paginate=$q->with(['resources'])->paginate($limit);
        return resReturn(1,$paginate);
    }

    /**
     * ColumnDetail
     * 栏目详情
     * @param $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 栏目ID
     */
    public function detail($id)
    {
        $return=Column::with(['ColumnProperty','resources'])->find($id);
        return resReturn(1,$return);
    }

    /**
     * ColumnPv
     * 增加栏目访问量
     * @param $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 栏目ID
     */
    public function pv($id)
    {
        Column::where('id', $id)->select('id', 'column_id', 'name', 'template', 'keyword', 'describes', 'created_at', 'pv', 'updated_at')->increment('pv');
        return resReturn(1,'成功');
    }
}
