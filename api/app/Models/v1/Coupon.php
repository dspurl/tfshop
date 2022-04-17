<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int id
 * @property string name
 * @property int cost
 * @property int type
 * @property int amount
 * @property int residue
 * @property int sill
 * @property string start_time
 * @property string end_time
 * @property int limit_get
 * @property int state
 */
class Coupon extends Model
{
    use SoftDeletes;
    const COUPON_TYPE_FULL_REDUCTION = 1; //优惠券类型:满减
    const COUPON_TYPE_RANDOM = 2; //优惠券类型:随机
    const COUPON_TYPE_DISCOUNT = 3; //优惠券类型:折扣
    const COUPON_STATE_NOT_START = 0; //状态:未开始
    const COUPON_STATE_UNDERWAY = 1; //状态:进行中
    const COUPON_STATE_FINISHED = 2; //状态:已结束
    public static $withoutAppends = true;
    protected $appends = ['explain'];

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
     * 价值
     *
     * @return float|int
     */
    public function getCostAttribute()
    {
        if (isset($this->attributes['cost'])) {
            if (self::$withoutAppends) {
                $return = $this->attributes['cost'];
            } else {
                $return = $this->attributes['cost'] / 100;
            }
            return $return > 0 ? $return : '';
        }
    }

    /**
     * 价值
     *
     * @param $value
     * @return void
     */
    public function setCostAttribute($value)
    {
        $this->attributes['cost'] = sprintf("%01.2f", $value) * 100;
    }

    /**
     * 门槛
     *
     * @return float|int
     */
    public function getSillAttribute()
    {
        if (isset($this->attributes['sill'])) {
            if (self::$withoutAppends) {
                $return = $this->attributes['sill'];
            } else {
                $return = $this->attributes['sill'] / 100;
            }
            return $return > 0 ? $return : '';
        }
    }

    /**
     * 门槛
     *
     * @param $value
     * @return void
     */
    public function setSillAttribute($value)
    {
        $this->attributes['sill'] = sprintf("%01.2f", $value) * 100;
    }

    /**
     * 优惠券类型
     *
     * @return float|int
     */
    public function getTypeAttribute()
    {
        if (isset($this->attributes['type'])) {
            if (self::$withoutAppends) {
                return $this->attributes['type'];
            } else {
                switch ($this->attributes['type']) {
                    case self::COUPON_TYPE_FULL_REDUCTION:
                        return '满减优惠券';
                        break;
                    case self::COUPON_TYPE_RANDOM:
                        return '随机优惠券';
                        break;
                    case self::COUPON_TYPE_DISCOUNT:
                        return '折扣优惠券';
                        break;
                }
            }

        }
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
                    case self::COUPON_STATE_NOT_START:
                        return '未开始';
                        break;
                    case self::COUPON_STATE_UNDERWAY:
                        return '进行中';
                        break;
                    case self::COUPON_STATE_FINISHED:
                        return '已结束';
                        break;
                }
            }

        }
    }

    /**
     * 优惠券说明
     *
     * @return float|int
     */
    public function getExplainAttribute()
    {
        if (isset($this->attributes['type'])) {
            if (self::$withoutAppends) {
                switch ($this->attributes['type']) {
                    case self::COUPON_TYPE_RANDOM:
                    case self::COUPON_TYPE_FULL_REDUCTION:
                        if ($this->attributes['sill']) {
                            return '满' . ($this->attributes['sill'] / 100) . '元减' . ($this->attributes['cost'] / 100) . '元';
                        } else {
                            return '无门槛';
                        }
                        break;
                    case self::COUPON_TYPE_DISCOUNT:
                        if ($this->attributes['sill']) {
                            return '满' . ($this->attributes['sill'] / 100) . '元可用';
                        } else {
                            return '无门槛';
                        }
                        break;
                }
            }
        }
    }

    /**
     * 获取用户优惠券
     */
    public function UserCoupon()
    {
        return $this->hasMany(UserCoupon::class);
    }
}
