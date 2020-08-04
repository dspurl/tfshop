<?php

namespace App\Http\Controllers\v1\Element;

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
            $Browse=new Browse();
            $Browse->user_id = auth('web')->user()->id;
            $Browse->good_id = $request->id;
            $Browse->save();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'添加成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }
}
