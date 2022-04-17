<?php
namespace App\Models\v1;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
/**
 * @property int id
 * @property int good_id
 * @property int type
 * @property int value
 * @property int is_hidden
 */
class IntegralCommodity extends Model
{
    protected $table = 'integral_commoditys';
    const INTEGRAL_MALL_TYPE_FIXED = 0; //积分抵扣方式:固定值
    const INTEGRAL_MALL_TYPE_PERCENTAGE = 1; //积分抵扣方式:百分比
    const INTEGRAL_MALL_IS_HIDDEN_NO = 0; //是否隐藏:否
    const INTEGRAL_MALL_IS_HIDDEN_YES = 1; //是否隐藏:是
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
    public function getTypeAttribute()
    {
        if (isset($this->attributes['type'])) {
            if (self::$withoutAppends) {
                return $this->attributes['type'];
            }
            $name = "";
            switch ($this->attributes['type']) {
                case static::INTEGRAL_MALL_TYPE_FIXED:
                    $name = '固定值';
                    break;
                case static::INTEGRAL_MALL_TYPE_PERCENTAGE:
                    $name = '百分比';
                    break;
            }
            return $name;
        }
    }
    public function getIsHiddenAttribute()
    {
        if (isset($this->attributes['is_hidden'])) {
            if (self::$withoutAppends) {
                return $this->attributes['is_hidden'];
            }
            $name = "";
            switch ($this->attributes['is_hidden']) {
                case static::INTEGRAL_MALL_IS_HIDDEN_NO:
                    $name = '否';
                    break;
                case static::INTEGRAL_MALL_IS_HIDDEN_YES:
                    $name = '是';
                    break;
            }
            return $name;
        }
    }

    public function Good()
    {
        return $this->hasOne(Good::class,'id','good_id');
    }
}
