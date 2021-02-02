<?php

namespace App\Http\Controllers\v1\Admin;

use App\Models\v1\GoodIndent;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use EasyWeChat\Factory;

/**
 * statistics
 * 统计
 * Class StatisticsController
 * @package App\Http\Controllers\v1\Admin
 */
class StatisticsController extends Controller
{
    protected $app = null;

    public function __construct()
    {
        $config = config('wechat.mini_program.default');
        $this->app = Factory::miniProgram($config);

    }

    /**
     * StatisticsBehavior
     * 使用分析
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function behavior(Request $request)
    {
        $return = [];
        $date = $request->has('date') ? $request->date : 7;

        for ($i = $date; $i >= 1; $i--) {
            $summaryTrend = $this->app->data_cube->summaryTrend(date("Ymd", strtotime("-$i day")), date("Ymd", strtotime("-$i day")));
            if (array_key_exists('list', $summaryTrend)) {
                $return[] = array(
                    'country' => '累计访问人数',
                    'date' => $summaryTrend['list'][0]['ref_date'],
                    'value' => $summaryTrend['list'][0]['visit_total'],
                );
                $return[] = array(
                    'country' => '转发次数',
                    'date' => $summaryTrend['list'][0]['ref_date'],
                    'value' => $summaryTrend['list'][0]['share_pv'],
                );
                $return[] = array(
                    'country' => '转发人数',
                    'date' => $summaryTrend['list'][0]['ref_date'],
                    'value' => $summaryTrend['list'][0]['share_uv'],
                );
            }
        }
        return resReturn(1, array_values($return));
    }

    /**
     * StatisticsKeep
     * 留存趋势
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function keep(Request $request)
    {
        $return = [];
        $date = $request->has('date') ? $request->date : 7;
        for ($i = $date; $i >= 1; $i--) {
            $summaryTrend = $this->app->data_cube->dailyVisitTrend(date("Ymd", strtotime("-$i day")), date("Ymd", strtotime("-$i day")));
            $return[] = array(
                'country' => '新增用户留存',
                'date' => $summaryTrend['list'][0]['ref_date'],
                'value' => $summaryTrend['list'][0]['visit_uv_new'],
            );
            $return[] = array(
                'country' => '活跃用户留存',
                'date' => $summaryTrend['list'][0]['ref_date'],
                'value' => $summaryTrend['list'][0]['visit_uv'],
            );
        }
        return resReturn(1, array_values($return));
    }

    /**
     * StatisticsSource
     * 来源分析
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function source(Request $request)
    {
        $return = [];
        $date = $request->has('date') ? $request->date : 7;
        $access_source_session_cnt = config('wechat.access_source_session_cnt');
        for ($i = $date; $i >= 1; $i--) {
            $summaryTrend = $this->app->data_cube->visitDistribution(date("Ymd", strtotime("-$i day")), date("Ymd", strtotime("-$i day")));

            $item_list = $summaryTrend['list'][0]['item_list'];
            if ($item_list) {
                foreach ($item_list as $list) {
                    if (array_key_exists($access_source_session_cnt[$list['key']], $return)) {
                        $return[$access_source_session_cnt[$list['key']]]['value'] += $list['value'];
                    } else {
                        $return[$access_source_session_cnt[$list['key']]] = array(
                            'type' => $access_source_session_cnt[$list['key']],
                            'value' => $list['value']
                        );
                    }
                }
            }
        }
        return resReturn(1, array_values($return));
    }

    /**
     * StatisticAgeAndSex
     * 画像分布
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function ageAndSex(Request $request)
    {
        $date = $request->has('date') ? $request->date : 1;
        $userPortrait = $this->app->data_cube->userPortrait(date("Ymd", strtotime("-$date day")), date("Ymd", strtotime("-1 day")));
        return resReturn(1, $userPortrait);
    }

    /**
     * StatisticsAgeAndSex
     * 交易分析
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function pay(Request $request)
    {
        /**
         * 下单笔数
         * 付款笔数
         * 付款金额
         * 退款笔数
         * 退款金额
         */
        $date = $request->has('date') ? $request->date : 0;
        $start = date('Y-m-d 00:00:00', strtotime("-$date day"));
        $end = date('Y-m-d 23:59:59');
        GoodIndent::$withoutAppends = false;
        $GoodIndent = GoodIndent::where('created_at', '>=', $start)->where('created_at', '<=', $end)->get();
        $return = [];
        foreach ($GoodIndent as $G) {
            $time = $date ? date('Y-m-d', strtotime($G->created_at)) : date('Y-m-d H:00', strtotime($G->created_at));
            if (array_key_exists('下单笔数' . $time, $return)) {
                $return['下单笔数' . $time]['value'] += 1;
            } else {
                $return['下单笔数' . $time] = array(
                    'country' => '下单笔数',
                    'date' => $time,
                    'value' => 1
                );
            }
            if ($G->pay_time) {  //付款笔数
                if (array_key_exists('付款笔数' . $time, $return)) {
                    $return['付款笔数' . $time]['value'] += 1;
                    $return['付款金额' . $time]['value'] += $G->total;
                } else {
                    $return['付款笔数' . $time] = array(
                        'country' => '付款笔数',
                        'date' => $time,
                        'value' => 1
                    );
                    $return['付款金额' . $time] = array(
                        'country' => '付款金额',
                        'date' => $time,
                        'value' => $G->total
                    );
                }
            }
            if ($G->refund_time) {  //退款笔数
                if (array_key_exists('退款笔数' . $time, $return)) {
                    $return['退款笔数' . $time]['value'] += 1;
                    $return['退款金额' . $time]['value'] += $G->total;
                } else {
                    $return['退款笔数' . $time] = array(
                        'country' => '退款笔数',
                        'date' => $time,
                        'value' => 1
                    );
                    $return['退款金额' . $time] = array(
                        'country' => '退款金额',
                        'date' => $time,
                        'value' => $G->total
                    );
                }
            }
        }
        return resReturn(1, array_values($return));
    }
}
