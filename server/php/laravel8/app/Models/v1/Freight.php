<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string name
 * @property array location
 * @property array pinkage
 * @property int valuation
 */
class Freight extends Model
{
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
     * 运送方式
     */
    public function FreightWay()
    {
        return $this->hasMany(FreightWay::class);
    }

    /**
     * 宝贝地址
     * @return void
     */
    public function getLocationAttribute()
    {
        if (!self::$withoutAppends) {
            if (isset($this->attributes['location'])) {
                return json_decode($this->attributes['location'], true);
            }
        } else {
            return $this->attributes['location'];
        }

    }

    /**
     * 包邮地区
     * @return void
     */
    public function getPinkageAttribute()
    {
        if (!self::$withoutAppends) {
            if (isset($this->attributes['pinkage'])) {
                return json_decode($this->attributes['pinkage'], true);
            }
        } else {
            return $this->attributes['pinkage'];
        }

    }

    /**
     * 宝贝地址
     *
     * @param string $value
     * @return void
     */
    public function setLocationAttribute($value)
    {
        $this->attributes['location'] = json_encode($value);
    }

    /**
     * 包邮地区
     *
     * @param string $value
     * @return void
     */
    public function setPinkageAttribute($value)
    {
        $this->attributes['pinkage'] = json_encode($value);
    }
}
