<?php

namespace App\Http\Controllers\v1\Client;

use App\Code;
use App\common\RedisService;
use App\Http\Requests\v1\SubmitShippingRequest;
use App\Models\v1\Common;
use App\Models\v1\Freight;
use App\Models\v1\FreightWay;
use App\Models\v1\GoodLocation;
use App\Models\v1\Shipping;
use App\common\RedisLock;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;


class ShippingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Shipping::query();
        $limit=$request->limit;
        $q->where('user_id',auth('web')->user()->id);
        $paginate=$q->paginate($limit);
        return resReturn(1,$paginate);
    }

    public function one(Request $request)
    {
        $return['shipping'] = Shipping::where('defaults',Shipping::SHIPPING_DEFAULTS_YES)->where('user_id',auth('web')->user()->id)->first();
        if($return['shipping']){
            if(count(explode("省",$return['shipping']['address']))>1){
                $name=explode("省",$return['shipping']['address'])[0].'省';
            } else if(count(explode("自治区",$return['shipping']['address']))>1) {
                $name=explode("自治区",$return['shipping']['address'])[0].'自治区';
            } else {
                $name=explode("市",$return['shipping']['address'])[0].'市';
            }
            $provinces=config('provinces');
            $value='';
            foreach ($provinces as $p){
                if($p['label'] == $name){
                    $value=$p['value'];
                }
            }
            $carriage=0;
            $list=[];
            foreach($request->all() as $all){
                if(array_key_exists($all['freight_id'],$list)){
                    $list[$all['freight_id']]+= $all['number'];
                }else{
                    $list[$all['freight_id']]=$all['number'];
                }
            }
            if($value){
                foreach($list as $index=>$l){
                    Freight::$withoutAppends = false;
                    FreightWay::$withoutAppends = false;
                    $Freight=Freight::with(['FreightWay'])->find($index);
                    if(!in_array($value,$Freight['pinkage'])){ //不包邮
                        foreach ($Freight['FreightWay'] as $way){
                            if(in_array($value,$way->location)) { //获取不包邮实际运费
                                if($l== 1){ //只有一件
                                    $carriage+=$way->first_cost;
                                } else {
                                    if($l<=$way->first_piece){    //未超过首件
                                        $carriage+=$way->first_cost;
                                    } else {
                                        $number=ceil(($l-$way->first_piece)/$way->add_piece);
                                        $carriage+=$way->first_cost+$way->add_cost*$number;
                                    }

                                }
                                break;
                            }

                        }
                    }
                }
            }
            $return['carriage']=$carriage;
        }
        return resReturn(1,$return);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitShippingRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubmitShippingRequest $request)
    {
        $redis = new RedisService();
        $lock=RedisLock::lock($redis,'shipping');
        if($lock){
            $return=DB::transaction(function ()use($request){
                $count=Shipping::where('user_id',auth('web')->user()->id)->count();
                $Shipping=new Shipping();
                $Shipping->user_id=auth('web')->user()->id;
                $Shipping->cellphone=$request->cellphone;
                $Shipping->defaults=$count > 0 ? Shipping::SHIPPING_DEFAULTS_NO : Shipping::SHIPPING_DEFAULTS_YES;
                $Shipping->name=$request->name;
                $Shipping->location=$request->location;
                $Shipping->address=$request->address ? $request->address : '';
                $Shipping->latitude=$request->latitude;
                $Shipping->longitude=$request->longitude;
                $Shipping->house=$request->house;
                $Shipping->save();
                return [1,$Shipping];
            }, 5);
            RedisLock::unlock($redis,'shipping');
            if($return[0] == 1){
                return resReturn(1,$return[1]);
            }else{
                return resReturn(0,$return[0],$return[1]);
            }
        }else{
            return resReturn(0,'业务繁忙，请稍后再试',Code::CODE_SYSTEM_BUSY);
        }
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
        $apply=Common::applySecret($request->header('apply-secret'));
        $GoodLocation=GoodLocation::where('apply_id',$apply['id'])->find($id);
        return resReturn(1,$GoodLocation);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param SubmitShippingRequest $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubmitShippingRequest $request, $id)
    {
        $redis = new RedisService();
        $lock=RedisLock::lock($redis,'shipping');
        if($lock){
            $return=DB::transaction(function ()use($request,$id){
                $Shipping=Shipping::find($id);
                $Shipping->cellphone=$request->cellphone;
                $Shipping->name=$request->name;
                $Shipping->location=$request->location;
                $Shipping->address=$request->address ? $request->address : '';
                $Shipping->latitude=$request->latitude;
                $Shipping->longitude=$request->longitude;
                $Shipping->house=$request->house;
                $Shipping->save();
                return [1,Shipping::find($id)];
            }, 5);
            RedisLock::unlock($redis,'shipping');
            if($return[0] == 1){
                return resReturn(1,$return[1]);
            }else{
                return resReturn(0,$return[0],$return[1]);
            }
        }else{
            return resReturn(0,'业务繁忙，请稍后再试',Code::CODE_SYSTEM_BUSY);
        }

    }

    public function check(Request $request)
    {
        $return=DB::transaction(function ()use($request){
            Shipping::where('user_id',auth('web')->user()->id)->update(['defaults' => Shipping::SHIPPING_DEFAULTS_NO]);
            Shipping::where('id',$request->id)->update(['defaults' => Shipping::SHIPPING_DEFAULTS_YES]);
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'设置成功');
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
        if(!$id){
            return resReturn(0,'参数有误',Code::CODE_PARAMETER_WRONG);
        }
        $return=DB::transaction(function ()use($request,$id){
            Shipping::where('id',$id)->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,$return[0],$return[1]);
        }
    }
}
