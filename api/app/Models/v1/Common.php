<?php
/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class Common extends Model
{
    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param \DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    /**
     * 数据转成图表数据
     * @param $name
     * @param $day // 1：当天 2：一周 3：月
     * @return array
     */
    protected function getChartData($name, $day)
    {
        $return = [];
        switch ($day) {
            case 1: //当天

                for ($i = 0; $i <= 24; $i++) {
                    if ($i < 10) {
                        $time = $name . date("Y-m-d 0$i");
                        $date = '0' . $i . ':00';
                    } else {
                        $date = $i . ':00';
                        $time = $name . date("Y-m-d $i");
                    }
                    $return[$time] = array(
                        'date' => $date,
                        'type' => $name,
                        'value' => 0,
                    );
                }
                break;
            case 7: //一周
                $week = date('w', time());
                for ($i = 0; $i < 7; $i++) {
                    $time[] = date('Y-m-d', strtotime('+' . ($i + 1 - $week) . 'days', time()));
                }
                break;
            /*default:
                for ($i = $day; $i >= 0; $i--) {
                    if (date('y') == date('y', strtotime("-$i day", strtotime($request->date[1])))) {
                        $date[] = date('m月d日', strtotime("-$i day", strtotime($request->date[1])));
                    } else {
                        $date[] = date('m月d日(y年)', strtotime("-$i day", strtotime($request->date[1])));
                    }
                    $time[] = date('Y-m-d', strtotime("-$i day", strtotime($request->date[1])));
                }*/
        }
        return $return;
    }
}
