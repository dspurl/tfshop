<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int id
 * @property int user_id
 * @property int coupon_id
 * @property string ticket
 * @property int state
 * @property string failure_time
 */
class UserCoupon extends Model
{
    const USER_COUPON_STATE_UNUSED = 0; //状态:未使用
    const USER_COUPON_STATE_USED = 1; //状态:已使用
    const USER_COUPON_STATE_INVALID = 2; //状态:已失效
    public static $withoutAppends = true;

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
     * 优惠券状态
     *
     * @return float|int
     */
    public function getStateAttribute()
    {
        if (isset($this->attributes['state'])) {
            if (self::$withoutAppends) {
                return $this->attributes['state'];
            } else {
                switch ($this->attributes['state']) {
                    case self::USER_COUPON_STATE_UNUSED:
                        return '未使用';
                        break;
                    case self::USER_COUPON_STATE_USED:
                        return '已使用';
                        break;
                    case self::USER_COUPON_STATE_INVALID:
                        return '已失效';
                        break;
                }
            }

        }
    }

    public function Coupon()
    {
        return $this->hasOne(Coupon::class, 'id', 'coupon_id');
    }
}
