<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
/**
 * @property string name
 * @property int type
 * @property int price
 */
class DistributionRule extends Model
{
    public static $withoutAppends = true;
    const DISTRIBUTION_RULE_TYPE_FIXATION= 0; //返佣方式：固定金额
    const DISTRIBUTION_RULE_TYPE_PERCENT= 1; //返佣方式：百分比
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

    /**
     * 返佣值
     *
     * @return void
     */
    public function getPriceAttribute()
    {
        if(isset($this->attributes['price'])){
            if(self::$withoutAppends){
                $return= $this->attributes['price'];
            }else{
                $return= $this->attributes['price']/100;
            }
            return $return>0 ? $return : '';
        }
    }

    /**
     * 返佣值
     *
     * @param  string  $value
     * @return void
     */
    public function setPriceAttribute($value)
    {
        $this->attributes['price'] = sprintf("%01.2f",$value)*100;
    }
}
