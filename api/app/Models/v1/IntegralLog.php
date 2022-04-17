<?php
namespace App\Models\v1;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
/**
 * @property int id
 * @property int user_id
 * @property int type
 * @property int operation
 * @property string remark
 * @property int integralable_id
 * @property string integralable_type
 * @property string integralable_identification
 */
class IntegralLog extends Model
{
    const INTEGRAL_LOG_TYPE_INCOME = 0; //类型:收入
    const INTEGRAL_LOG_TYPE_EXPEND = 1; //类型:支出
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
                case static::INTEGRAL_LOG_TYPE_INCOME:
                    $name = '收入';
                    break;
                case static::INTEGRAL_LOG_TYPE_EXPEND:
                    $name = '支出';
                    break;
            }
            return $name;
        }
    }

    public function User()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
