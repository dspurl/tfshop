<?php
namespace App\Models\v1;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
/**
 * @property int id
 * @property string value
 * @property int is_hide
 */
class GoodParameter extends Model
{
    const GOOD_PARAMETER_IS_HIDE_NO = 0; //是否隐藏:否
    const GOOD_PARAMETER_IS_HIDE_YES = 1; //是否隐藏:是
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
    public function getIsHideAttribute()
    {
        if (isset($this->attributes['is_hide'])) {
            if (self::$withoutAppends) {
                return $this->attributes['is_hide'];
            }
            $name = "";
            switch ($this->attributes['is_hide']) {
                case static::GOOD_PARAMETER_IS_HIDE_NO:
                    $name = '否';
                    break;
                case static::GOOD_PARAMETER_IS_HIDE_YES:
                    $name = '是';
                    break;
            }
            return $name;
        }
    }
}
