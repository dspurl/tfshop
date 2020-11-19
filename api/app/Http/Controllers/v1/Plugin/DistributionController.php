<?php

namespace App\Http\Controllers\v1\Plugin;

use App\Code;
use App\Http\Requests\v1\SubmitDistributionRequest;
use App\Models\v1\Distribution;
use App\Models\v1\DistributionRule;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodIndentCommodity;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class DistributionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Distribution::query();
        $limit=$request->limit;
        $paginate=$q->paginate($limit);
        return resReturn(1,$paginate);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param SubmitDistributionRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubmitDistributionRequest $request)
    {
        $return=DB::transaction(function ()use($request){
            $Distribution=new Distribution();
            $Distribution->name = $request->name;
            $Distribution->identification = $request->identification;
            $Distribution->level = $request->level;
            $Distribution->save();
            foreach ($request->distribution_rule as $distribution_rule){
                $DistributionRule = new DistributionRule();
                $DistributionRule->name = $distribution_rule['name'];
                $DistributionRule->type = $distribution_rule['type'];
                $DistributionRule->price = $distribution_rule['price'];
                $DistributionRule->save();
            }
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'添加成功');
        }else{
            return resReturn(0,'添加失败',Code::CODE_PARAMETER_WRONG);
        }
    }

    /**
     *
     * @param  int $id
     * @param SubmitDistributionRequest $request
     * @return \Illuminate\Http\Response
     */
    public function update($id, SubmitDistributionRequest $request)
    {
        if(!$id){
            return resReturn(0,'参数有误',Code::CODE_PARAMETER_WRONG);
        }
        $return=DB::transaction(function ()use($request){
            $Distribution=Distribution::find($request->id);
            $Distribution->name = $request->name;
            $Distribution->identification = $request->identification;
            $Distribution->level = $request->level;
            $Distribution->save();
            $DistributionRuleAll=[];
            foreach ($request->distribution_rule as $distribution_rule){
                if($distribution_rule['id']){
                    $DistributionRule =DistributionRule::find($distribution_rule['id']);
                }else{
                    $DistributionRule = new DistributionRule();
                }
                $DistributionRule->name = $distribution_rule['name'];
                $DistributionRule->type = $distribution_rule['type'];
                $DistributionRule->price = $distribution_rule['price'];
                $DistributionRule->save();
                $DistributionRuleAll[]=$DistributionRule->id;
            }
            //删除去除的规则
            DistributionRule::where('distribution_id',$Distribution->id)->whereNotIn('id',$DistributionRuleAll)->delete();
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
        if(!$id){
            return resReturn(0,'参数有误',Code::CODE_MISUSE);
        }
        $return=DB::transaction(function ()use($request,$id){
            Distribution::where('id',$id)->delete();
            Distribution::where('distribution_id',$id)->delete();
            return 1;
        }, 5);
        if($return == 1){
            return resReturn(1,'删除成功');
        }else{
            return resReturn(0,'删除失败',Code::CODE_PARAMETER_WRONG);
        }
    }
}
