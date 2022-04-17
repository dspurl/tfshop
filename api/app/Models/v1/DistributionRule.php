<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int id
 * @property int distribution_id
 * @property string name
 * @property int type
 * @property int level
 * @property int price
 */
class DistributionRule extends Model
{
    use SoftDeletes;
    const DISTRIBUTION_RULE_TYPE_FIXED_VALUE = 0; //返佣方式:按固定值
    const DISTRIBUTION_RULE_TYPE_PROPORTION = 1; //返佣方式:按比例
    const DISTRIBUTION_RULE_LEVEL_ONE_LEVEL = 1; //级别:一级
    const DISTRIBUTION_RULE_LEVEL_SECOND_LEVEL = 2; //级别:二级
    const DISTRIBUTION_RULE_LEVEL_THREE_LEVEL = 3; //级别:三级
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
     * 返佣方式
     * @return string
     */
    protected function getTypeAttribute()
    {
        if (isset($this->attributes['type'])) {
            if (self::$withoutAppends) {
                return $this->attributes['type'];
            } else {
                switch ($this->attributes['type']) {
                    case self::DISTRIBUTION_RULE_TYPE_FIXED_VALUE:
                        return '按固定值';
                        break;
                    case self::DISTRIBUTION_RULE_TYPE_PROPORTION:
                        return '按比例';
                        break;
                }
            }
        }
    }

    /**
     * 返佣值
     * @return float|int
     */
    public function getPriceAttribute()
    {
        if (isset($this->attributes['price'])) {
            if (self::$withoutAppends) {
                return $this->attributes['price'];
            } else {
                return $this->attributes['price'] / 100;
            }
        }
    }

    /**
     * 返佣值
     * @param $value
     */
    public function setPriceAttribute($value)
    {
        $this->attributes['price'] = sprintf("%01.2f", $value) * 100;
    }
}
