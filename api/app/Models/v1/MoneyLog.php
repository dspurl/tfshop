<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int user_id
 * @property int type
 * @property int money
 * @property string remark
 */
class MoneyLog extends Model
{
    const MONEY_LOG_TYPE_INCOME = 0; //收入
    const MONEY_LOG_TYPE_EXPEND = 1; //支出
    protected $appends = ['type_show', 'money_show'];

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

    public function getTypeShowAttribute()
    {
        if (isset($this->attributes['type'])) {
            $name = '';
            switch ($this->attributes['type']) {
                case static::MONEY_LOG_TYPE_INCOME:
                    $name = __('money_log.type.income');
                    break;
                case static::MONEY_LOG_TYPE_EXPEND:
                    $name = __('money_log.type.expend');
                    break;
            }
            return $name;
        }
    }

    public function getMoneyShowAttribute()
    {
        if (isset($this->attributes['money'])) {
            return $this->attributes['money'] / 100;
        }
    }
}
