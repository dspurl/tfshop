<?php
namespace App\Models\v1;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
/**
 * @property int id
 * @property string name
 * @property int type
 * @property int is_hidden
 * @property string explain
 * @property string style
 * @property int integral
 * @property int tries
 * @property string start_time
 * @property string end_time
 */
class IntegralDraw extends Model
{
    use SoftDeletes;
    const INTEGRAL_DRAW_TYPE_TURNTABLE = 1; //抽奖类型:大转盘
    const INTEGRAL_DRAW_TYPE_SUDOKU = 2; //抽奖类型:九宫格
    const INTEGRAL_DRAW_TYPE_SLOT_MACHINE = 3; //抽奖类型:老虎机
    const INTEGRAL_DRAW_IS_HIDDEN_NO = 0; //状态:关闭
    const INTEGRAL_DRAW_IS_HIDDEN_YES = 1; //状态:开启
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
                case static::INTEGRAL_DRAW_TYPE_TURNTABLE:
                    $name = '大转盘';
                    break;
                case static::INTEGRAL_DRAW_TYPE_SUDOKU:
                    $name = '九宫格';
                    break;
                case static::INTEGRAL_DRAW_TYPE_SLOT_MACHINE:
                    $name = '老虎机';
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
                case static::INTEGRAL_DRAW_IS_HIDDEN_NO:
                    $name = '关闭';
                    break;
                case static::INTEGRAL_DRAW_IS_HIDDEN_YES:
                    $name = '开启';
                    break;
            }
            return $name;
        }
    }

    public function IntegralPrize(){
        return $this->hasMany(IntegralPrize::class);
    }
}
