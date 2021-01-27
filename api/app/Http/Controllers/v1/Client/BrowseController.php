<?php

namespace App\Http\Controllers\v1\Client;

use App\Code;
use Carbon\Carbon;
use App\Http\Requests\v1\SubmitBrowseRequest;
use App\Models\v1\Browse;
use App\Models\v1\Good;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class BrowseController extends Controller
{
    public function index(Request $request)
    {
        $q = Browse::query();
        Good::$withoutAppends = false;
        $q->where('user_id',auth('web')->user()->id);
        $limit=$request->limit;
        $q->orderBy('updated_at','DESC');
        $paginate=$q->with(['Good'=>function($q){
            $q->select('id','order_price','name')->with(['resources']);
        }])->paginate($limit);
        return resReturn(1,$paginate);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitBrowseRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubmitBrowseRequest $request)
    {
        $return=DB::transaction(function ()use($request){
            $user_id = auth('web')->user()->id;

            // 浏览记录方式一：没有浏览记录的新增，有的更新
            $Browse=Browse::where('user_id',$user_id)->where('good_id',$request->id)->first();
            if(!$Browse){
                $Browse = new Browse();
            }else{
                $Browse->updated_at = Carbon::now()->toDateTimeString();
            }
            $Browse->user_id = $user_id;
            $Browse->good_id = $request->id;
            $Browse->save();
            // 浏览记录方式二：所有的浏览记录都添加，用于后期的用户行为分析
//            $Browse = new Browse();
//            $Browse->user_id = $user_id;
//            $Browse->good_id = $request->id;
//            $Browse->save();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'添加成功');
        }else{
            return resReturn(0,'添加失败',Code::CODE_MISUSE);
        }
    }
}
