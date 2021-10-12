<?php

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
                    $name = '收入';
                    break;
                case static::MONEY_LOG_TYPE_EXPEND:
                    $name = '支出';
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
