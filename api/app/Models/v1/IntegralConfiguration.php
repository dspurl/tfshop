<?php
namespace App\Models\v1;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
/**
 * @property int id
 * @property string name
 * @property string system
 * @property string value
 * @property string explain
 * @property int is_hidden
 * @property int integralable_id
 * @property string integralable_type
 */
class IntegralConfiguration extends Model
{
    use SoftDeletes;
    const INTEGRAL_CONFIGURATION_IS_HIDDEN_NO = 0; //是否隐藏:否
    const INTEGRAL_CONFIGURATION_IS_HIDDEN_YES = 1; //是否隐藏:是
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
    public function getIsHiddenAttribute()
    {
        if (isset($this->attributes['is_hidden'])) {
            if (self::$withoutAppends) {
                return $this->attributes['is_hidden'];
            }
            $name = "";
            switch ($this->attributes['is_hidden']) {
                case static::INTEGRAL_CONFIGURATION_IS_HIDDEN_NO:
                    $name = '否';
                    break;
                case static::INTEGRAL_CONFIGURATION_IS_HIDDEN_YES:
                    $name = '是';
                    break;
            }
            return $name;
        }
    }
}
