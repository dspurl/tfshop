<?php

namespace App\Http\Controllers\v1\Plugin\Client;

use App\Models\v1\IntegralDrawLog;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * IntegralDrawLog
 * 积分抽奖记录
 * Class IntegralDrawLogController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class IntegralDrawLogController extends Controller
{
    /**
     * IntegralDrawLogList
     * 积分抽奖记录列表
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int   每页显示条数
     * @queryParam  page string 页码
     * @queryParam  integral_draw_id int    积分抽奖ID
     * @queryParam  sort string 排序
     */
    public function list(Request $request)
    {
        $q = IntegralDrawLog::query();
        if ($request->has('integral_draw_id')) {
            $q->where('integral_draw_id', $request->integral_draw_id);
            $q->whereHas('IntegralPrize', function ($query) use ($request) {
                $query->where('quantity', '!=', -1);
            });
            $q->with(['IntegralPrize', 'User']);
        }
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        if ($request->has('user')) {
            IntegralDrawLog::$withoutAppends = false;
            $q->where('user_id', auth('web')->user()->id)->where('integral_prize_id', '>', 0);
            $q->whereHas('IntegralPrize', function ($query) use ($request) {
                $query->where('quantity', '!=', -1);
            });
            $q->with(['IntegralDraw', 'IntegralPrize' => function ($q) {
                $q->with(['Resource']);
            }]);
            $q->orderBy('state')->orderByDesc('created_at');
        }
        $limit = $request->limit;
        $paginate = $q->paginate($limit);
        if ($request->has('integral_draw_id')) {
            foreach ($paginate as $id => $p) {
                $paginate[$id]->username = $p->User->nickname ?
                    substr($p->User->nickname, 0, 1) . '**' . substr($p->User->nickname, -1, 1)
                    : substr($p->User->cellphone, 0, 3) . '****' . substr($p->User->cellphone, -4, 4);
                unset($paginate[$id]->User);
            }
        }
        return resReturn(1, $paginate);
    }

    /**
     * 积分抽奖记录中奖商品
     * IntegralDrawLogGood
     * @param $id
     * @return string
     */
    public function good($id)
    {
        $IntegralDrawLog = IntegralDrawLog::with(['IntegralPrize' => function ($q) {
            $q->with(['model' => function ($q) {
                $q->with(['good' => function ($q) {
                    $q->select('id', 'name', 'freight_id')->with(['resources' => function ($q) {
                        $q->where('depict', 'like', '%_zimg');
                    }]);
                }, 'resources']);
            }]);
        }])->find($id);
        $return = [];
        $return[] = [
            'number' => 1,
            'good_id' => $IntegralDrawLog->IntegralPrize->model->good_id,
            'good' => $IntegralDrawLog->IntegralPrize->model->good,
            'good_sku_id' => $IntegralDrawLog->IntegralPrize->model->id,
            'price' => $IntegralDrawLog->IntegralPrize->model->price / 100,
            'product_sku' => $IntegralDrawLog->IntegralPrize->model->product_sku,
            'name' => $IntegralDrawLog->IntegralPrize->model->good->name,
            'img' => $IntegralDrawLog->IntegralPrize->model->resources ? $IntegralDrawLog->IntegralPrize->model->resources->img : $IntegralDrawLog->IntegralPrize->model->good->resources->img
        ];
        return resReturn(1, $return);
    }
}
