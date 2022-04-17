<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int id
 * @property int user_id
 * @property int children_id
 * @property string name
 * @property int type
 * @property int level
 * @property int price
 * @property int state
 */
class DistributionLog extends Model
{
    use SoftDeletes;
    const DISTRIBUTION_LOG_TYPE_FIXED_VALUE = 0; //返佣方式:按固定值
    const DISTRIBUTION_LOG_TYPE_PROPORTION = 1; //返佣方式:按比例
    const DISTRIBUTION_LOG_LEVEL_ONE_LEVEL = 1; //级别:一级
    const DISTRIBUTION_LOG_LEVEL_SECOND_LEVEL = 2; //级别:二级
    const DISTRIBUTION_LOG_LEVEL_THREE_LEVEL = 3; //级别:三级
    const DISTRIBUTION_LOG_STATE_TRIGGER = 0; //分销状态:触发
    const DISTRIBUTION_LOG_STATE_SUCCEED = 1; //分销状态:成功
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
     * 返佣金额
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
}
