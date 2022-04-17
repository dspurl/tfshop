<?php

namespace App\Http\Controllers\v1\Plugin\Admin;

use App\Code;
use App\common\RedisService;
use App\Http\Requests\v1\SubmitIntegralDrawRequest;
use App\Models\v1\GoodSku;
use App\Models\v1\IntegralDraw;
use App\Models\v1\IntegralPrize;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * IntegralDraw
 * 积分抽奖
 * Class IntegralDrawController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class IntegralDrawController extends Controller
{
    /**
     * IntegralDrawList
     * 积分抽奖列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        IntegralDraw::$withoutAppends = false;
        $q = IntegralDraw::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * IntegralDrawList
     * 积分抽奖商品
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function good(Request $request)
    {
        GoodSku::$withoutAppends = false;
        $q = GoodSku::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->title) {
            $q->whereHas('good', function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->title . '%');
            });
        }
        $q->with(['good' => function ($q) {
            $q->select('id', 'name')->with(['resources' => function ($q) {
                $q->where('depict', 'like', '%_zimg');
            }]);
        }, 'Resource']);
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * IntegralDrawCreate
     * 积分抽奖添加
     * @param SubmitIntegralDrawRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  name string 名称
     * @queryParam  type int 抽奖类型:1=大转盘-turntable,2=九宫格-sudoku,3=老虎机-slot_machine
     * @queryParam  is_hidden int 是否隐藏:0=否-no,1=是-yes
     * @queryParam  explain string 说明
     * @queryParam  style string 自定义样式
     * @queryParam  start_time string 开始时间
     * @queryParam  end_time string 结束时间
     */
    public function create(SubmitIntegralDrawRequest $request)
    {
        DB::transaction(function () use ($request) {
            $redis = new RedisService();
            $IntegralDraw = new IntegralDraw();
            $IntegralDraw->name = $request->name;
            $IntegralDraw->type = $request->type;
            $IntegralDraw->explain = $request->explain ?? '';
            $IntegralDraw->style = $request->style ?? '';
            $IntegralDraw->integral = $request->integral;
            $IntegralDraw->tries = $request->tries;
            $IntegralDraw->start_time = $request->time[0] . ' 00:00:00';
            $IntegralDraw->end_time = $request->time[1] . ' 23:59:59';
            $IntegralDraw->save();
            if ($request->integral_prize) {
                $prize = [];
                $collect_integral_prize = collect($request->integral_prize)->sortByDesc('sort')->values()->toArray();
                foreach ($collect_integral_prize as $id => $integral_prize) {
                    $IntegralPrize = new IntegralPrize();
                    $IntegralPrize->integral_draw_id = $IntegralDraw->id;
                    $IntegralPrize->model_id = $integral_prize['model_id'];
                    $IntegralPrize->model_type = $integral_prize['model_type'];
                    $IntegralPrize->name = $integral_prize['name'];
                    $IntegralPrize->value = $integral_prize['value'];
                    $IntegralPrize->recycle = $integral_prize['recycle'] ?? 0;
                    $IntegralPrize->quantity = $integral_prize['quantity'];
                    $IntegralPrize->residue = $IntegralPrize->quantity;
                    $IntegralPrize->probability = $integral_prize['probability'];
                    $IntegralPrize->sort = $integral_prize['sort'];
                    $IntegralPrize->is_hidden = $integral_prize['is_hidden'];
                    $IntegralPrize->save();
                    if ($integral_prize['img']) {
                        $Resource = new Resource();
                        $Resource->type = Resource::RESOURCE_TYPE_IMG;
                        $Resource->depict = 'integralDraw';
                        $Resource->image_id = $IntegralPrize->id;
                        $Resource->image_type = 'App\Models\v1\IntegralPrize';
                        $Resource->img = imgPathShift('integralDraw', $integral_prize['img']);
                        $Resource->save();
                    }
                    for ($i = 0; $i < $IntegralPrize->probability; $i++) {
                        $prize[] = $id;
                    }
                }
                if ($IntegralDraw->type == IntegralDraw::INTEGRAL_DRAW_TYPE_SLOT_MACHINE) {
                    //  老虎机
                    for ($i = 0; $i < count($request->integral_prize); $i++) {
                        $prize[] = $i;
                    }
                    $redis->set('integralDraw' . $IntegralDraw->id, collect($prize)->crossJoin($prize, $prize)->shuffle()->toJson());
                } else {
                    // 非老虎机
                    $prize = collect($prize)->shuffle()->toJson();  //对生成的数组随机打乱一次，增加随机复杂性
                    $redis->set('integralDraw' . $IntegralDraw->id, $prize);
                }
            }
        }, 5);
        return resReturn(1, '添加成功');
    }

    /**
     * IntegralDrawDetail
     * 积分抽奖详情
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 积分抽奖ID
     */
    public function detail($id)
    {
        $IntegralDraw = IntegralDraw::with(['IntegralPrize' => function ($q) {
            $q->with(['Resource']);
        }])->find($id);
        return resReturn(1, $IntegralDraw);
    }

    /**
     * IntegralDrawEdit
     * 积分抽奖更新
     * @param SubmitIntegralDrawRequest $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 积分抽奖ID
     * @queryParam  name string 名称
     * @queryParam  type int 抽奖类型:1=大转盘-turntable,2=九宫格-sudoku,3=老虎机-slot_machine
     * @queryParam  is_hidden int 是否隐藏:0=否-no,1=是-yes
     * @queryParam  explain string 说明
     * @queryParam  style string 自定义样式
     * @queryParam  start_time string 开始时间
     * @queryParam  end_time string 结束时间
     */
    public function edit(SubmitIntegralDrawRequest $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $redis = new RedisService();
            $IntegralDraw = IntegralDraw::find($id);
            $IntegralDraw->name = $request->name;
            $IntegralDraw->type = $request->type;
            $IntegralDraw->explain = $request->explain;
            $IntegralDraw->style = $request->style;
            $IntegralDraw->integral = $request->integral;
            $IntegralDraw->tries = $request->tries;
            $IntegralDraw->start_time = $request->start_time;
            $IntegralDraw->end_time = $request->end_time;
            $IntegralDraw->save();
            if ($request->integral_prize) {
                $IntegralPrizeId = [];
                $prize = [];
                $collect_integral_prize = collect($request->integral_prize)->sortByDesc('sort')->values()->toArray();
                foreach ($collect_integral_prize as $id => $integral_prize) {
                    if (array_key_exists('id', $integral_prize)) {
                        $IntegralPrize = IntegralPrize::find($integral_prize['id']);
                    } else {
                        $IntegralPrize = new IntegralPrize();
                    }
                    $IntegralPrize->integral_draw_id = $IntegralDraw->id;
                    $IntegralPrize->model_id = $integral_prize['model_id'];
                    $IntegralPrize->model_type = $integral_prize['model_type'];
                    $IntegralPrize->name = $integral_prize['name'];
                    $IntegralPrize->value = $integral_prize['value'];
                    $IntegralPrize->recycle = $integral_prize['recycle'] ?? 0;
                    $IntegralPrize->quantity = $integral_prize['quantity'];
                    $IntegralPrize->residue = $integral_prize['residue'];
                    $IntegralPrize->probability = $integral_prize['probability'];
                    $IntegralPrize->sort = $integral_prize['sort'];
                    $IntegralPrize->is_hidden = $integral_prize['is_hidden'];
                    $IntegralPrize->save();
                    $ResourceAll = [];
                    if (array_key_exists('img', $integral_prize)) {
                        if ($integral_prize['img']) {
                            if (array_key_exists('resource', $integral_prize)) {
                                if ($integral_prize['resource']) {
                                    $Resource = Resource::find($integral_prize['resource']['id']);
                                } else {
                                    $Resource = new Resource();
                                    $Resource->type = Resource::RESOURCE_TYPE_IMG;
                                    $Resource->depict = 'integralDraw';
                                    $Resource->image_id = $IntegralPrize->id;
                                    $Resource->image_type = 'App\Models\v1\IntegralPrize';
                                }
                            } else {
                                $Resource = new Resource();
                                $Resource->type = Resource::RESOURCE_TYPE_IMG;
                                $Resource->depict = 'integralDraw';
                                $Resource->image_id = $IntegralPrize->id;
                                $Resource->image_type = 'App\Models\v1\IntegralPrize';
                            }
                            $Resource->img = imgPathShift('integralDraw', $integral_prize['img']);
                            $Resource->save();
                            $ResourceAll[] = $Resource->id;
                        }
                    }
                    $IntegralPrizeId[] = $IntegralPrize->id;
                    for ($i = 0; $i < $IntegralPrize->probability; $i++) {
                        $prize[] = $id;
                    }
                }
                if ($IntegralDraw->type == IntegralDraw::INTEGRAL_DRAW_TYPE_SLOT_MACHINE) {
                    //  老虎机
                    for ($i = 0; $i < count($request->integral_prize); $i++) {
                        $prize[] = $i;
                    }
                    $redis->set('integralDraw' . $IntegralDraw->id, collect($prize)->crossJoin($prize, $prize)->shuffle()->toJson());
                } else {
                    // 非老虎机
                    $prize = collect($prize)->shuffle()->toJson();  //对生成的数组随机打乱一次，增加随机复杂性
                    $redis->set('integralDraw' . $IntegralDraw->id, $prize);
                }
            }
            IntegralPrize::where('integral_draw_id', $IntegralDraw->id)->whereNotIn('id', $IntegralPrizeId)->delete();
            Resource::whereNotIn('image_id', $IntegralPrizeId)->where('image_type', 'App\Models\v1\IntegralPrize')->where('image_id', $IntegralDraw->id)->delete();
        }, 5);
        return resReturn(1, '更新成功');
    }

    /**
     * IntegralDrawDestroy
     * 积分抽奖删除
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 积分抽奖ID
     */
    public function destroy($id, Request $request)
    {
        DB::transaction(function () use ($request, $id) {
            if ($id > 0) {
                IntegralDraw::destroy($id);
            } else {
                if (!$request->all()) {
                    throw new \Exception('请选择内容', Code::CODE_WRONG);
                }
                $idData = collect($request->all())->pluck('id');
                IntegralDraw::destroy($idData);
            }
        }, 5);
        return resReturn(1, '删除成功');
    }
}
