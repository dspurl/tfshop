<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
/**
 * @property string name
 * @property string identification
 * @property int level
 */
class Distribution extends Model
{
    public static $withoutAppends = true;
    const DISTRIBUTION_LEVEL_ONE= 1; //分销级别：一级
    const DISTRIBUTION_LEVEL_TWO= 2; //分销级别：二级
    const DISTRIBUTION_LEVEL_THREE= 3; //分销级别：三级
    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param  \DateTimeInterface  $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
