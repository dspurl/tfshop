<?php

namespace App\Http\Controllers\v1\Plugin\Client;

use App\Models\v1\IntegralCommodity;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\v1\Integral;

/**
 * IntegralCommodity
 * 积分商品
 * Class IntegralCommodityController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class IntegralCommodityController extends Controller
{
    /**
     * IntegralCommodityList
     * 积分商品列表
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = IntegralCommodity::query();
        $q->orderBy('created_at', 'ASC');
        $limit = $request->limit;
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }
    /**
     * IntegralCommodityDetail
     * 积分商品信息
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 积分商品ID
     */
    public function detail(Request $request)
    {
        $Integral = Integral::select('available')->where('user_id', auth('web')->user()->id)->first();
        $IntegralCommodity = IntegralCommodity::whereIn('good_id', collect($request->all())->pluck('ids'))->get();
        $return = [
            'available' => $Integral->available, // 可用积分
            'deductible' => 0,  // 商品最高可抵扣积分
            // 'price' => 0, // 抵扣金额
            'parities' => config('integral.parities'), // 汇率
        ];
        if ($IntegralCommodity) {
            foreach ($IntegralCommodity as $i) {
                $data = collect($request->all())->firstWhere('ids', $i->good_id);
                if ($i->type === IntegralCommodity::INTEGRAL_MALL_TYPE_FIXED) {
                    $return['deductible'] += $i->value;
                } else {
                    $return['deductible'] += $data['price'] * $i->value / 100;
                }
            }
            // 计算出来的是金额，需要转成积分
            $return['deductible'] = $return['deductible']/config('integral.parities');
        }
        return resReturn(1, $return);
    }
}
