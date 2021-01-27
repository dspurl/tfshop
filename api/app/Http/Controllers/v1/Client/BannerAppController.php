<?php

namespace App\Http\Controllers\v1\Client;

use App\Http\Requests\v1\SubmitBannerRequest;
use App\Models\v1\Banner;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class BannerAppController extends Controller
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
        if($request->has('type')){
            $q->where('type',$request->type);
        }
        $limit=$request->limit;
        $paginate=$q->with(['resources'])->paginate($limit);
        return resReturn(1,$paginate);
    }

    //单条广告
    public function advertising(Request $request){
        $Banner=Banner::where('type',$request->type)->with(['resources'])->first();
        return resReturn(1,$Banner);
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
            if($request->resources['id'] && $request->img){
                $Resource=Resource::find($request->resources['id']);
                if($request->img != $Resource->img){
                    resourceAutoDelete($Resource->img);
                }
                $Resource->img = imgPathShift('banner',$request->img);
                $Resource->save();
            }else{
                if($request->img){
                    $Resource=new Resource();
                    $Resource->type = Resource::RESOURCE_TYPE_IMG;
                    $Resource->depict = 'banner_'.$Banner->id;
                    $Resource->image_id = $Banner->id;
                    $Resource->image_type = 'App\Models\v1\Banner';
                    $Resource->img = imgPathShift('banner',$request->img);
                    $Resource->save();
                }
            }
            $Banner->save();
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
            Banner::where('id',$id)->delete();
            if($request->resources){
                resourceAutoDelete($request->resources['img']);
                Resource::where('id',$request->resources['id'])->delete();
            }
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }
}
