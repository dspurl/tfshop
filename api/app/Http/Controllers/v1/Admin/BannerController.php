<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Requests\v1\SubmitBannerRequest;
use App\Models\v1\Banner;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Banner::$withoutAppends = false;
        $q = Banner::query();
        if($request->name){
            $q->where('name','like','%'.$request->name.'%');
        }
        if($request->type){
            $q->where('type',$request->type);
        }
        $q->with(['resources']);
        $limit=$request->limit;
        if($request->order){
            $q->orderBy('sort','desc');
            $q->orderBy('id','desc');
        }
        $paginate=$q->paginate($limit);
        return resReturn(1,$paginate);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitBannerRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubmitBannerRequest $request)
    {
        $return=DB::transaction(function ()use($request){
            $Banner=new Banner();
            $Banner->name = $request->name;
            $Banner->type = $request->type;
            $Banner->url = $request->url;
            $Banner->sort = $request->sort;
            $Banner->state = $request->state;
            $Banner->save();
            if($request->img){
                $Resource=new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'banner_'.$Banner->id;
                $Resource->image_id = $Banner->id;
                $Resource->image_type = 'App\Models\v1\Banner';
                $Resource->img = imgPathShift('banner',$request->img);
                $Resource->save();
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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $Banner=Banner::find($id);
        return resReturn(1,$Banner);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param SubmitBannerRequest $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubmitBannerRequest $request, $id)
    {
        $return=DB::transaction(function ()use($request,$id){
            $Banner=Banner::find($id);
            $Banner->name = $request->name;
            $Banner->type = $request->type;
            $Banner->url = $request->url;
            $Banner->sort = $request->sort;
            $Banner->state = $request->state;
            $Banner->save();
           //如果有旧图, 替换
            if($request->resources && $request->img){
                $Resource=Resource::find($request->resources['id']);
                if($request->img !=$Resource->img){
                    imgPathDelete('banner',$Resource->img);
                }
                $Resource->img = imgPathShift('banner',$request->img);
                $Resource->save();
                return 1;
            }
            //如果无旧图, 上传新图
            if($request->img){
                $Resource=new Resource();
                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                $Resource->depict = 'banner_'.$Banner->id;
                $Resource->image_id = $Banner->id;
                $Resource->image_type = 'App\Models\v1\Banner';
                $Resource->img = imgPathShift('banner',$request->img);
                $Resource->save();
                return 1;
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
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        $return=DB::transaction(function ()use($request,$id){
            imgPathDelete('banner',$request->img);
            Banner::where('id',$id)->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }
}
