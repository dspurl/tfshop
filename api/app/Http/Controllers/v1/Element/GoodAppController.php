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
        if($request->has('pid') && !empty($request->pid)){
            $q->whereHas('category',function($query) use ($request){
                $query->whereIn('category_id', Category::getAllChildrenCategoryID((int)$request->pid));
            });
        }
        //搜索
        if($request->has('searchValue') && !empty($request->searchValue)) {
            $q->where('name', 'like', '%' . $request->searchValue . '%');
        }
        $paginate=$q->with(['resources'=>function($q){
            $q->where('depict','like','%_zimg');
        },'goodSku'=>function($q){
            $q->select('good_id','price', 'market_price','inventory');
        }])->select('updated_at','id','name','number','market_price','sales','order_price','brand_id','price','is_show','is_recommend','is_new','is_hot','sort','time')->paginate($limit);
        if($paginate){
            foreach ($paginate as $id=>$p){
                $paginate[$id]['price_show']=Good::getPriceShow($p);
                $paginate[$id]['inventory_show']=Good::getInventoryShow($p);
                $paginate[$id]['market_price_show']=Good::getMarketPriceShow($p);
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
            $q->with('resources')->where('inventory','>',0);
        }])->find($id);
        $Good['price_show']=Good::getPriceShow($Good);
        $Good['market_price_show']=Good::getMarketPriceShow($Good);
        $Good['inventory_show']=Good::getInventoryShow($Good);
        return resReturn(1,$Good);
    }

    /**
     * 商品详情
     *
     * @param  int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function details($id,Request $request)
    {
        $apply=Common::applySecret($request->header('apply-secret'));
        Good::$withoutAppends = false;
        GoodSku::$withoutAppends = false;
        $return= [];
        $return['goods']= [];
        if($id){
            $Good=Good::with(['resourcesMany','goodCategory','goodSku'=>function($q){
                $q->with('resources');
            }])->where('apply_id',$apply['id'])->find($id);
            if($Good->goodSku){
                foreach ($Good->goodSku as $id =>$goodSku){
                    $Good->goodSku[$id]->img='';
                    if($goodSku->resources){
                        $Good->goodSku[$id]->img=$goodSku->resources->img;
                    }
                }
            }
            $return['goods']=collect($Good)->merge((new Good())->getImg($Good->resourcesMany));
            //展示应用所在分类下的子类目
            $GoodCategory=GoodCategory::where('apply_id',$apply['id'])->get();

            $return['category']=getParentClassHierarchy($Good->goodCategory[0]->pid,$GoodCategory->toArray());
            array_push($return['category'],$Good->goodCategory[0]->id);

        }


        return resReturn(1,$return);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitGoodRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubmitGoodRequest $request)
    {
        if(!$request->header('apply-secret') || $request->header('apply-secret') =='undefined'){
            return resReturn(0,'非法操作',Code::CODE_MISUSE);
        }
        if(!$request->imgArr['img']){
            return resReturn(0,'主图必须',Code::CODE_MISUSE);
        }
        $apply=Common::applySecret($request->header('apply-secret'));
        $return=DB::transaction(function ()use($request, $apply){
            $Good=new Good();
            $Good->apply_id = $apply['id'];
            $Good->identification = orderNumber();
            $Good->name = $request->name;
            $Good->number = $request->number;
            $Good->details = $request->details ?? imgFindReplaceUpdate($request->details,'good_details');
            $Good->is_show = $request->is_show;
            $Good->sort = $request->sort;
            $Good->time = Carbon::now()->toDateTimeString();
            $Good->save();
            // 商品主图处理
            if($request->imgArr['img']){
                $Resource=new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'goods_'.$Good->id.'_zimg';
                $Resource->image_id = $Good->id;
                $Resource->image_type = 'App\Models\v1\Good';
                $Resource->img = imgPathShift('good',$request->imgArr['img']);
                $Resource->save();
            }
            // 图片列表处理
            if($request->imgList > 0) {
                foreach ($request->imgList as $id =>$imgList){
                    $Resource=new Resource();
                    $Resource->type = Resource::RESOURCE_TYPE_IMG;
                    $Resource->depict = 'goods_'.$Good->id;
                    $Resource->image_id = $Good->id;
                    $Resource->image_type = 'App\Models\v1\Good';
                    $Resource->img = imgPathShift('good',$imgList['response']);
                    $Resource->save();
                }
            }
            //自定义分类
            $GoodGoodCategory=new GoodGoodCategory();
            $GoodGoodCategory->good_id = $Good->id;
            $GoodGoodCategory->good_category_id = $request->category;
            $GoodGoodCategory->save();
            // sku处理
            $order_price=0;
            if(count($request->good_sku) > 0) {
                foreach ($request->good_sku as $id =>$good_sku){
                    //获取最低售价
                    if($order_price == 0 || $order_price >$good_sku['price']){
                        $order_price = $good_sku['price'];
                    }
                    $GoodSku=new GoodSku();
                    $GoodSku->apply_id = $Good->apply_id;
                    $GoodSku->good_id = $Good->id;
                    $GoodSku->market_price = $good_sku['market_price'];
                    $GoodSku->cost_price = $good_sku['cost_price'];
                    $GoodSku->price = $good_sku['price'];
                    $GoodSku->inventory = $good_sku['inventory'];
                    $GoodSku->product_sku = $good_sku['product_sku'];
                    $GoodSku->save();
                    if(array_key_exists("img",$good_sku)){
                        $Resource=new Resource();
                        $Resource->type = Resource::RESOURCE_TYPE_IMG;
                        $Resource->depict = 'product_sku_'.$GoodSku->id;
                        $Resource->image_id = $GoodSku->id;
                        $Resource->image_type = 'App\Models\v1\GoodSku';
                        $Resource->img = imgPathShift('product_sku',$good_sku['img']);
                        $Resource->save();
                    }
                }
                $Good->order_price = $order_price;
                $Good->save();
            }
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'添加成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param SubmitGoodRequest $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubmitGoodRequest $request, $id)
    {
        if(!$request->header('apply-secret') || $request->header('apply-secret') =='undefined'){
            return resReturn(0,'非法操作',Code::CODE_MISUSE);
        }
        if(!$id){
            return resReturn(0,'参数有误',Code::CODE_PARAMETER_WRONG);
        }
        $apply=Common::applySecret($request->header('apply-secret'));
        $Good=Good::where('apply_id',$apply['id'])->find($id);
        $return=DB::transaction(function ()use($request, $Good){
            $Good->name = $request->name;
            $Good->number = $request->number;
            $Good->details = $request->details ?? imgFindReplaceUpdate($request->details,'good_details');
            $Good->is_show = $request->is_show;
            $Good->sort = $request->sort;
            $Good->save();
            // 商品主图处理
            if($request->imgArr['id']){
                $Resource=Resource::find($request->imgArr['id']);
                if($request->imgArr['img'] !=$Resource->img){
                    imgPathDelete('good',$Resource->img);
                }
                $Resource->img = imgPathShift('good',$request->imgArr['img']);
                $Resource->save();

            }

            // 图片列表处理
            if($request->imgList > 0) {
                $ResourceAll=[];
                foreach ($request->imgList as $id =>$imgList){
                    if(array_key_exists("id",$imgList)){
                        $Resource=Resource::find($imgList['id']);
                        if($imgList['response'] !=$Resource->img){
                            imgPathDelete('good',$Resource->img);
                        }
                    }else{
                        $Resource=new Resource();
                        $Resource->type = Resource::RESOURCE_TYPE_IMG;
                        $Resource->depict = 'goods_'.$Good->id;
                        $Resource->image_id = $Good->id;
                        $Resource->image_type = 'App\Models\v1\Good';
                    }
                    $Resource->img = imgPathShift('good',$imgList['response']);
                    $Resource->save();
                    $ResourceAll[]=$Resource->id;
                }
                //删除去除的资源
                $ResourceDelete=Resource::where('image_id',$Good->id)->where('image_type','App\Models\v1\Good')->where('depict','not like','%_zimg')->whereNotIn('id',$ResourceAll)->get();
                if($ResourceDelete){
                    foreach ($ResourceDelete as $r){
                        imgPathDelete('good',$r->img);
                    }
                }
                Resource::where('image_id',$Good->id)->where('image_type','App\Models\v1\Good')->where('depict','not like','%_zimg')->whereNotIn('id',$ResourceAll)->delete();
            }
            //自定义分类
            $GoodGoodCategory = GoodGoodCategory::where('good_id',$request->good_category[0]['pivot']['good_id'])->where('good_category_id',$request->good_category[0]['pivot']['good_category_id'])->first();
            $GoodGoodCategory->good_category_id = $request->category;
            $GoodGoodCategory->save();

            // sku处理
            if(count($request->good_sku) > 0) {
                $GoodSkuAll=[];
                $ResourceAll=[];
                $order_price = 0;
                foreach ($request->good_sku as $id =>$good_sku){
                    //获取最低售价
                    if($order_price == 0 || $order_price >$good_sku['price']){
                        $order_price = $good_sku['price'];
                    }
                    if(array_key_exists("id",$good_sku)){
                        $GoodSku=GoodSku::find($good_sku['id']);
                    }else{
                        $GoodSku=new GoodSku();
                        $GoodSku->apply_id = $Good->apply_id;
                        $GoodSku->apply_user_id = $Good->apply_user_id;
                        $GoodSku->good_id = $Good->id;
                    }
                    $GoodSku->market_price = $good_sku['market_price'];
                    $GoodSku->cost_price = $good_sku['cost_price'];
                    $GoodSku->price = $good_sku['price'];
                    $GoodSku->inventory = $good_sku['inventory'];
                    $GoodSku->product_sku = $good_sku['product_sku'];
                    $GoodSku->save();
                    $GoodSkuAll[]=$GoodSku->id;
                    if(array_key_exists("img",$good_sku) && $good_sku['img']){
                        if(array_key_exists("resources",$good_sku)){
                            $Resource=Resource::find($good_sku['resources']['id']);
                            if($good_sku['img'] !=$Resource->img){
                                imgPathDelete('good',$Resource->img);
                            }
                        }else{
                            $Resource=new Resource();
                            $Resource->type = Resource::RESOURCE_TYPE_IMG;
                            $Resource->depict = 'product_sku_'.$GoodSku->id;
                            $Resource->image_id = $GoodSku->id;
                            $Resource->image_type = 'App\Models\v1\GoodSku';
                        }
                        $Resource->img = imgPathShift('product_sku',$good_sku['img']);
                        $Resource->save();
                        $ResourceAll[]=$Resource->id;
                    }
                }
                $Good->order_price = $order_price;
                $Good->save();
                //删除去除的SKU
                GoodSku::where('good_id',$Good->id)->whereNotIn('id',$GoodSkuAll)->delete();
                //删除去除的资源
                $ResourceDelete=Resource::where('image_type','App\Models\v1\GoodSku')->where('depict','not like','%_zimg')->whereNotIn('id',$ResourceAll)->get();
                if($ResourceDelete){
                    foreach ($ResourceDelete as $r){
                        imgPathDelete('good',$r->img);
                    }
                }
                Resource::where('image_type','App\Models\v1\GoodSku')->where('depict','not like','%_zimg')->whereNotIn('id',$ResourceAll)->delete();
            }
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'更新成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }

    /**
     * 选择商品分类
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function selectGoodCategory(Request $request)
    {
        if(!$request->header('apply-secret') || $request->header('apply-secret') =='undefined'){
            return resReturn(0,'非法操作',Code::CODE_MISUSE);
        }
        $apply=Common::applySecret($request->header('apply-secret'));
        $q = GoodCategory::query();
        $q->where('apply_id',$apply['id'])->where('state',GoodCategory::CATEGORY_STATE_YES);
        $q->orderBy('sort','ASC');
        $data=$q->select('id','pid','name')->get();

        $fromData=genTree($data->toArray(),'pid');
        return resReturn(1,$fromData);
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
        $q->orderBy('sort','ASC');
        $paginate=$q->with(['resources'])->get();
        return resReturn(1,$paginate);
    }

    /**
     * 商品分类添加
     *
     * @param SubmitGoodCategoryRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function goodCategoryStore(SubmitGoodCategoryRequest $request)
    {
        if(!$request->header('apply-secret') || $request->header('apply-secret') =='undefined'){
            return resReturn(0,'非法操作',Code::CODE_MISUSE);
        }
        $apply=Common::applySecret($request->header('apply-secret'));
        $return=DB::transaction(function ()use($request,$apply){
            $GoodCategory=new GoodCategory();
            $GoodCategory->apply_id = $apply['id'];
            $GoodCategory->name=$request->name;
            $GoodCategory->pid=$request->pid;
            $GoodCategory->sort=$request->sort;
            $GoodCategory->state=GoodCategory::CATEGORY_STATE_YES;
            $GoodCategory->save();
            if($request->resources['img']){
                $Resource=new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'good_category_'.$GoodCategory->id;
                $Resource->image_id = $GoodCategory->id;
                $Resource->image_type = 'App\Models\v1\GoodCategory';
                $Resource->img = imgPathShift('goodCategory',$request->resources['img']);
                $Resource->save();
            }
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'成功');
        }else{
            return resReturn(0,'添加失败',Code::CODE_PARAMETER_WRONG);
        }
    }

    /**
     * 商品分类更新
     *
     * @param SubmitGoodCategoryRequest|Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function goodCategoryUpdate(SubmitGoodCategoryRequest $request, $id)
    {
        $return=DB::transaction(function ()use($request,$id){
            $GoodCategory=GoodCategory::find($id);
            $GoodCategory->name=$request->name;
            $GoodCategory->sort=$request->sort;
            $GoodCategory->save();
            if($request->resources){
                $Resource=Resource::find($request->resources['id']);
                if($request->resources['img'] != $Resource->img){
                    resourceAutoDelete($Resource->img);
                }
                $Resource->img = imgPathShift('goodCategory',$request->resources['img']);
                $Resource->save();
            }
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'更新成功');
        }else{
            return resReturn(0,'更新失败',Code::CODE_PARAMETER_WRONG);
        }
    }

    /**
     * 删除商品分类
     *
     * @param  int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function goodCategoryDestroy($id, Request $request)
    {
        $return=DB::transaction(function ()use($request,$id){
            GoodCategory::where('id',$id)->delete();
            if($request->resources){
                resourceAutoDelete($request->resources['img']);
                Resource::where('id',$request->resources['id'])->delete();
            }
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,'删除失败',Code::CODE_PARAMETER_WRONG);
        }
    }
}
