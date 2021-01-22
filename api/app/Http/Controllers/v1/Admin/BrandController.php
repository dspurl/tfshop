<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitBrandTemplateRequest;
use App\Models\v1\Brand;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Brand::query();
        $limit=$request->limit;
        $q->orderBy('id','ASC');
        if($request->name){
            $q->where('name','like','%'.$request->name.'%');
        }
        $paginate=$q->with('resources')->paginate($limit);
        return resReturn(1,$paginate);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitBrandTemplateRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(SubmitBrandTemplateRequest $request)
    {
        $return=DB::transaction(function ()use($request){
            $Brand=new Brand();
            $Brand->name=$request->name;
            $Brand->sort=$request->sort;
            $Brand->save();
            if($request->logo){
                $Resource=new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'brand_'.$Brand->id;
                $Resource->image_id = $Brand->id;
                $Resource->image_type = 'App\Models\v1\Brand';
                $Resource->img = imgPathShift('brand',$request->logo);
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
     * Update the specified resource in storage.
     *
     * @param SubmitBrandTemplateRequest|Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubmitBrandTemplateRequest $request, $id)
    {
        $return=DB::transaction(function ()use($request,$id){
            $Brand=Brand::find($id);
            $Brand->name=$request->name;
            $Brand->sort=$request->sort;
            $Brand->save();
            if($request->resources['id'] && $request->logo){
                $Resource=Resource::find($request->resources['id']);
                if($request->logo != $Resource->img){
                    resourceAutoDelete($Resource->img);
                }
                $Resource->img = imgPathShift('brand',$request->logo);
            }else{
                if($request->logo){
                    $Resource=new Resource();
                    $Resource->type = Resource::RESOURCE_TYPE_IMG;
                    $Resource->depict = 'brand_'.$Brand->id;
                    $Resource->image_id = $Brand->id;
                    $Resource->image_type = 'App\Models\v1\Brand';
                    $Resource->img = imgPathShift('brand',$request->logo);
                    $Resource->save();
                }
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
            Brand::where('id',$id)->delete();
            resourceAutoDelete($request->resources['img']);
            Resource::where('id',$request->resources['id'])->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,'删除失败',Code::CODE_PARAMETER_WRONG);
        }
    }
}
