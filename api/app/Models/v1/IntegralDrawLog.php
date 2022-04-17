<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int id
 * @property int integral_draw_id
 * @property int user_id
 * @property int model_id
 * @property string model_type
 * @property int integral_prize_id
 * @property int state
 */
class IntegralDrawLog extends Model
{
    public static $withoutAppends = true;
    const INTEGRAL_DRAW_LOG_UNTREATED = 0; //状态:未兑换
    const INTEGRAL_DRAW_LOG_PROCESSED = 1; //状态:已兑换
    const INTEGRAL_DRAW_LOG_RECYCLE = 2; //状态:已回收

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

    public function getStateAttribute()
    {
        if (isset($this->attributes['state'])) {
            if (self::$withoutAppends) {
                return $this->attributes['state'];
            }
            $name = "";
            switch ($this->attributes['state']) {
                case static::INTEGRAL_DRAW_LOG_UNTREATED:
                    $name = '未兑换';
                    break;
                case static::INTEGRAL_DRAW_LOG_PROCESSED:
                    $name = '已兑换';
                    break;
                case static::INTEGRAL_DRAW_LOG_RECYCLE:
                    $name = '已回收';
                    break;
            }
            return $name;
        }
    }

    public function IntegralDraw()
    {
        return $this->hasOne(IntegralDraw::class, 'id', 'integral_draw_id');
    }

    public function IntegralPrize()
    {
        return $this->hasOne(IntegralPrize::class, 'id', 'integral_prize_id');
    }

    public function User()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
