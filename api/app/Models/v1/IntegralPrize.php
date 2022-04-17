<?php
namespace App\Models\v1;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
/**
 * @property int id
 * @property int integral_draw_id
 * @property int model_id
 * @property string model_type
 * @property string name
 * @property int value
 * @property int recycle
 * @property int quantity
 * @property int residue
 * @property int probability
 * @property int sort
 * @property int is_hidden
 */
class IntegralPrize extends Model
{
    use SoftDeletes;
    const INTEGRAL_PRIZE_IS_HIDDEN_NO = 0; //是否隐藏:否
    const INTEGRAL_PRIZE_IS_HIDDEN_YES = 1; //是否隐藏:是
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
                case static::INTEGRAL_PRIZE_IS_HIDDEN_NO:
                    $name = '否';
                    break;
                case static::INTEGRAL_PRIZE_IS_HIDDEN_YES:
                    $name = '是';
                    break;
            }
            return $name;
        }
    }

    public function model()
    {
        return $this->morphTo();
    }

    public function Resource()
    {
        return $this->morphOne(Resource::class, 'image');
    }
}
