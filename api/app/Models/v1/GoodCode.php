<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int id
 * @property int good_sku_id
 * @property string name
 * @property string code
 * @property int state
 */
class GoodCode extends Model
{
    protected $table = 'good_codes';
    const GOOD_CODE_STATE_NO = 0; //状态:未兑换
    const GOOD_CODE_STATE_YES = 1; //状态:已兑换
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

    public function getStateAttribute()
    {
        if (isset($this->attributes['state'])) {
            if (self::$withoutAppends) {
                return $this->attributes['state'];
            }
            $name = "";
            switch ($this->attributes['state']) {
                case static::GOOD_CODE_STATE_NO:
                    $name = '未兑换';
                    break;
                case static::GOOD_CODE_STATE_YES:
                    $name = '已兑换';
                    break;
            }
            return $name;
        }
    }
}
