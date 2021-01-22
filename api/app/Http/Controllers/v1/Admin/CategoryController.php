<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitCategoryRequest;
use App\Models\v1\Specification;
use App\Models\v1\Brand;
use App\Models\v1\Category;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Category::query();
        $limit=$request->limit;
        $q->orderBy('sort','ASC')->orderBy('id','ASC');
        if($request->has('title')){
            $q->where('name','like','%'.$request->title.'%');
        }
        $pid = $request->pid;
        if($pid){
            $q->where('pid',end($pid));
        }else{
            $q->where('pid',0);
        }
        $paginate=$q->with(['resources','SpecificationOn','BrandOn'])->paginate($limit);
        foreach ($paginate as $id =>$p){
            $paginate[$id]['specification']=$p->SpecificationOn->pluck('id');
            $paginate[$id]['brand']=$p->BrandOn->pluck('id');
        }
        $return['options'] = Category::getAllCategory();
        $return['brand'] = Brand::with(['resources'])->select('id','name')->get();
        $return['paginate']=$paginate;
        $return['specification']=Specification::orderBy('sort','ASC')->orderBy('id','ASC')->get();
        return resReturn(1,$return);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitCategoryRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(SubmitCategoryRequest $request)
    {
        $return=DB::transaction(function ()use($request){
            $Category=new Category();
            $Category->name=$request->name;
            $Category->pid=$request->pid;
            $Category->sort=$request->sort;
            $Category->is_recommend=$request->is_recommend;
            $Category->state=$request->state;
            $Category->save();
            if($request->logo){
                $Resource=new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'category_'.$Category->id;
                $Resource->image_id = $Category->id;
                $Resource->image_type = 'App\Models\v1\Category';
                $Resource->img = imgPathShift('category',$request->logo);
                $Resource->save();
            }
            if($request->specification){
                foreach ($request->specification as $id => $r){
                    $data[]=array(
                        'specification_id'=>$r,
                        'category_id'=>$Category->id,
                    );
                }
                DB::table('category_specifications')->insert($data);
            }
            unset($data);
            if($request->brand){
                foreach ($request->brand as $id => $r){
                    $data[]=array(
                        'brand_id'=>$r,
                        'category_id'=>$Category->id,
                    );
                }
                DB::table('category_brands')->insert($data);
            }
            unset($data);
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'成功');
        }else{
            return resReturn(0,'添加失败',Code::CODE_PARAMETER_WRONG);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param SubmitCategoryRequest|Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubmitCategoryRequest $request, $id)
    {
        $return=DB::transaction(function ()use($request,$id){
            $Category=Category::find($id);
            $Category->name=$request->name;
            $Category->pid=$request->pid;
            $Category->sort=$request->sort;
            $Category->state=$request->state;
            $Category->is_recommend=$request->is_recommend;
            $Category->save();
            if($request->resources['id'] && $request->logo){
                $Resource=Resource::find($request->resources['id']);
                if($request->logo != $Resource->img){
                    resourceAutoDelete($Resource->img);
                }
                $Resource->img = imgPathShift('category',$request->logo);
                $Resource->save();
            }else{
                if($request->logo){
                    $Resource=new Resource();
                    $Resource->type = Resource::RESOURCE_TYPE_IMG;
                    $Resource->depict = 'category_'.$Category->id;
                    $Resource->image_id = $Category->id;
                    $Resource->image_type = 'App\Models\v1\Category';
                    $Resource->img = imgPathShift('category',$request->logo);
                    $Resource->save();
                }
            }

            //获取已存在数据库的规格ID
            $category_specification=DB::table('category_specifications')->where('category_id',$Category->id)->get()->pluck('specification_id');
            $delete=[];
            $specification = $request->specification;

            foreach ($category_specification as $c){
                $key = array_search($c,$specification);
                if($key === false){ //已经被删除
                    $delete[]=$c;
                }else{  //已存在
                    unset($specification[$key]);
                }
            }
            // 没有添加的规格进行添加
            if(count($specification)){
                foreach ($specification as $id => $r){
                    $data[]=array(
                        'specification_id'=>$r,
                        'category_id'=>$Category->id,
                    );
                }
                DB::table('category_specifications')->insert($data);
            }
            //删除掉被删除掉的规格
            if(count($delete) > 0){
                DB::table('category_specifications')->where('category_id',$Category->id)->whereIn('specification_id',$delete)->delete();
            }
            //获取已存在数据库的品牌ID
            $category_brand=DB::table('category_brands')->where('category_id',$Category->id)->get()->pluck('brand_id');
            $delete=[];
            $brand = $request->brand;

            foreach ($category_brand as $c){
                $key = array_search($c,$brand);
                if($key === false){ //已经被删除
                    $delete[]=$c;
                }else{  //已存在
                    unset($brand[$key]);
                }
            }
            // 没有添加的品牌进行添加
            $data=[];
            if(count($brand)){
                foreach ($brand as $id => $r){
                    $data[]=array(
                        'brand_id'=>$r,
                        'category_id'=>$Category->id,
                    );
                }
                DB::table('category_brands')->insert($data);
            }
            //删除掉被删除掉的品牌
            if(count($delete) > 0){
                DB::table('category_brands')->where('category_id',$Category->id)->whereIn('brand_id',$delete)->delete();
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
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        $return=DB::transaction(function ()use($request,$id){
            Category::where('id',$id)->delete();
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
