<?php

namespace App\Http\Controllers\v1\Element;

use App\Code;
use App\Http\Requests\v1\SubmitGoodCategoryRequest;
use App\Http\Requests\v1\SubmitGoodRequest;
use App\Models\v1\Common;
use App\Models\v1\GoodGoodCategory;
use App\Models\v1\GoodSku;
use App\Models\v1\Resource;
use App\Models\v1\Category;
use App\Models\v1\Good;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * 商城APP
 * @package App\Http\Controllers\v1\Element
 */
class GoodAppController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Good::$withoutAppends = false;
        GoodSku::$withoutAppends = false;
        $q = Good::query();
        $limit=$request->limit;
        //管理页
        if($request->has('index')){
            if($request->index == 1){
                $q->where('is_show',Good::GOOD_SHOW_PUTAWAY);
            } else if($request->index == 2){
                $q->where('is_show',Good::GOOD_SHOW_ENTREPOT);
            }
        }else {
            $q->where('is_show',Good::GOOD_SHOW_PUTAWAY);
        }
        //是否推荐
        if($request->has('is_recommend')){
            $q->where('is_recommend',$request->is_recommend);
        }
        $q->where('is_delete',Good::GOOD_DELETE_NO);
         //全文搜索
        if($request->title){
            $q->where(function($q1) use($request){
                /* MySQL<5.7 请使用这种方式, 如果商品数量多, 请自己分词解决搜索效率问题
                $q1->orWhere('name','like','%'.$request->title.'%')
                    ->orWhere('number',$request->title)
                    ->orWhere('keywords','like','%'.$request->title.'%');
                */
                $q1->orWhereRaw('MATCH (name,keywords,number) AGAINST (\''.$request->title.'\' IN NATURAL LANGUAGE MODE)')
                    ->orWhere('number',$request->title);
            });           
        } 
        //排序
        if($request->has('order')){
            if($request->order == 1){   //销量
                $q->orderBy('sales','DESC');
            }else if($request->order == 2){   //排序价格
                if($request->priceOrder == 1){
                    $q->orderBy('order_price','ASC');
                }else{
                    $q->orderBy('order_price','DESC');
                }
            }else{
                //默认排序
                $q->orderBy('is_recommend','DESC')
                    ->orderBy('is_hot','DESC')
                    ->orderBy('is_new','DESC')
                    ->orderBy('sort','ASC')
                    ->orderBy('time','DESC');
            }
        }else{
            //默认排序
            $q->orderBy('is_recommend','DESC')
                ->orderBy('is_hot','DESC')
                ->orderBy('is_new','DESC')
                ->orderBy('sort','ASC')
                ->orderBy('time','DESC');
        }
        // 自定义类目
        if($request->has('pid')){
            $q->whereHas('category',function($query) use ($request){
                $query->where('category_id', $request->pid);
            });
        }
        $paginate=$q->with(['resources'=>function($q){
            $q->where('depict','like','%_zimg');
        },'goodSku'=>function($q){
            $q->select('good_id','price','inventory');
        }])->select('updated_at','id','name','number','market_price','sales','order_price','brand_id','price','is_show','is_recommend','is_new','is_hot','sort','time')->paginate($limit);
        if($paginate){
            foreach ($paginate as $id=>$p){
                $paginate[$id]['price_show']=Good::getPriceShow($p);
                $paginate[$id]['inventory_show']=Good::getInventoryShow($p);
            }
        }
        return resReturn(1,$paginate);
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
        if(!$request->header('apply-secret') || $request->header('apply-secret') =='undefined'){
            return resReturn(0,'非法操作',Code::CODE_MISUSE);
        }
        Good::$withoutAppends = false;
        GoodSku::$withoutAppends = false;
        $Good=Good::with(['resourcesMany','resources','goodSku'=>function($q){
            $q->where('is_delete',GoodSku::GOOD_SKU_DELETE_NO)->with('resources')->where('inventory','>',0);
        }])->find($id);
        $Good['price_show']=Good::getPriceShow($Good);
        $Good['market_price_show']=Good::getMarketPriceShow($Good);
        $Good['inventory_show']=Good::getInventoryShow($Good);
        return resReturn(1,$Good);
    }

    /**
     * 商品分类展示
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function goodCategory(Request $request)
    {
        $q = Category::query();
        $q->where('state',Category::CATEGORY_STATE_YES);
        if($request->has('is_recommend')){
            $q->where('is_recommend',$request->is_recommend);
            $q->with(['Category'=>function($q){
                $q->select('id','pid');
            }]);
        }
        $q->orderBy('sort','ASC');
        $paginate=$q->with(['resources'])->get();
        return resReturn(1,$paginate);
    }
}
