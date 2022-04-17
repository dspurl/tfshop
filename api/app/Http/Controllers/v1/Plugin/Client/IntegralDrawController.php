<?php

namespace App\Http\Controllers\v1\Plugin\Client;

use App\Code;
use App\common\RedisService;
use App\Models\v1\Integral;
use App\Models\v1\IntegralDraw;
use App\Models\v1\IntegralDrawLog;
use App\Models\v1\IntegralLog;
use App\Models\v1\IntegralPrize;
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
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = IntegralDraw::query();
        $q->orderByDesc('is_hidden')->orderBy('start_time');
        $limit = $request->limit;
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * IntegralDrawDetail
     * 积分抽奖详情
     * @param $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 积分抽奖ID
     */
    public function detail($id)
    {
        $IntegralDraw = IntegralDraw::with(['IntegralPrize' => function ($q) {
            $q->where('is_hidden', IntegralDraw::INTEGRAL_DRAW_IS_HIDDEN_NO)->with(['Resource'])->orderByDesc('sort')->orderBy('id');
        }])->find($id);
        $IntegralDraw->has_draw = IntegralDrawLog::where('user_id', auth('web')->user()->id)->where('created_at', '>=', date('Y-m-d 00:00:00'))->where('created_at', '<=', date('Y-m-d H:i:s'))->count();
        return resReturn(1, $IntegralDraw);
    }

    /**
     * IntegralWinning
     * 中奖结果
     * @param $id
     * @return string
     * @throws \Exception
     */
    public function winning($id)
    {
        $redis = new RedisService();
        $IntegralDraw = IntegralDraw::with(['IntegralPrize' => function ($q) {
            $q->where('is_hidden', IntegralDraw::INTEGRAL_DRAW_IS_HIDDEN_NO)->orderByDesc('sort')->orderBy('id');
        }])->find($id);
        if (!$IntegralDraw->id) {
            throw new \Exception('非法操作', Code::CODE_MISUSE);
        }
        $Integral = Integral::where('user_id', auth('web')->user()->id)->first();
        if ($Integral->available < $IntegralDraw->integral) {
            throw new \Exception('可用积分不足', Code::CODE_WRONG);
        }
        if ($IntegralDraw->tries) {
            $count = IntegralDrawLog::where('user_id', auth('web')->user()->id)->where('created_at', '>=', date('Y-m-d 00:00:00'))->where('created_at', '<=', date('Y-m-d H:i:s'))->count();
            if ($count > $IntegralDraw->tries) {
                throw new \Exception('当日抽奖已超过' . $IntegralDraw->tries . '次，请明日再来', Code::CODE_WRONG);
            }
        }
        $prize = $redis->get('integralDraw' . $id);
        if (!$prize) {
            throw new \Exception('未找到抽奖数据', Code::CODE_INEXISTENCE);
        }
        // 随机抽取奖品
        $prize = json_decode($prize, true);
        $returnKey = array_rand($prize);
        $return = $prize[$returnKey];
        if ($IntegralDraw->type == IntegralDraw::INTEGRAL_DRAW_TYPE_SLOT_MACHINE) {
            if ($return[0] == $return[1] && $return[0] == $return[2]) {
                $IntegralPrize = $IntegralDraw->IntegralPrize[$return[0]];
            } else {
                $IntegralPrize = (object)array(
                    'id' => 0,
                    'residue' => -1
                );
            }
        } else {
            $IntegralPrize = $IntegralDraw->IntegralPrize[$return];
        }
        // 如果奖品已经被抽完，则取数组第一个奖品
        if ($IntegralPrize->residue == 0) {
            if ($IntegralDraw->type == IntegralDraw::INTEGRAL_DRAW_TYPE_SLOT_MACHINE) {
                $return = [0, 0, 1];  //如果用户抽中其它已经抽中的项目，则取不会中的值
            } else {
                $return = 0;
            }
        }
        DB::transaction(function () use ($id, $redis, $IntegralDraw, $return, $prize, $IntegralPrize) {
            if ($IntegralPrize->residue > 0) {
                // 更新奖品剩余次数
                IntegralPrize::where('id', $IntegralPrize->id)->decrement('residue');
                // 更新抽中奖品的剩余数量
                if ($IntegralDraw->type == IntegralDraw::INTEGRAL_DRAW_TYPE_SLOT_MACHINE) {
                    $IntegralDraw->IntegralPrize[$return[0]]->residue = $IntegralPrize->residue - 1;
                } else {
                    $IntegralDraw->IntegralPrize[$return]->residue = $IntegralPrize->residue - 1;
                }
            }
            // 抽奖记录
            $IntegralDrawLog = new IntegralDrawLog();
            $IntegralDrawLog->integral_draw_id = $IntegralDraw->id;
            $IntegralDrawLog->user_id = auth('web')->user()->id;
            $IntegralDrawLog->integral_prize_id = $IntegralPrize->id;
            $IntegralDrawLog->state = IntegralDrawLog::INTEGRAL_DRAW_LOG_UNTREATED;
            $IntegralDrawLog->save();
            // 积分处理
            $IntegralLog = new IntegralLog();
            $IntegralLog->user_id = auth('web')->user()->id;
            $IntegralLog->type = IntegralLog::INTEGRAL_LOG_TYPE_EXPEND;
            $IntegralLog->operation = $IntegralDraw->integral;
            $IntegralLog->remark = "参与 $IntegralDraw->name 消耗" . $IntegralLog->operation . "积分";
            $IntegralLog->integralable_id = $IntegralDraw->id;
            $IntegralLog->integralable_type = "/api/app/Models/v1/IntegralDraw";
            $IntegralLog->integralable_identification = 0;
            $IntegralLog->save();
            Integral::where('user_id', $IntegralLog->user_id)->decrement('available', $IntegralLog->operation);
            // 获取除-1外的奖品剩余总数，如果等于0的话，即代表结束
            $residueCount = $IntegralDraw->IntegralPrize->where('quantity', '>=', 0)->sum('residue');
            if ($residueCount == 0) {
                $redis->del('integralDraw' . $id);
                $IntegralDraw->is_hidden = IntegralDraw::INTEGRAL_DRAW_IS_HIDDEN_NO;
                $IntegralDraw->save();
            }
        }, 5);
        return resReturn(1, $return);
    }
}
