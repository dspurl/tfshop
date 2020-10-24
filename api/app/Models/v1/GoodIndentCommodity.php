<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int good_indent_id
 * @property int apply_id
 * @property int good_id
 * @property int good_sku_id
 * @property string img
 * @property string name
 * @property string price
 * @property int number
 * @property string good_sku
 *
 */
class GoodIndentCommodity extends Model
{
    protected $table = 'good_indent_commoditys';
    public static $withoutAppends = true;
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
     * 销售价
     *
     * @return float|int
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
     * 销售价
     *
     * @param  string  $value
     * @return void
     */
    public function setPriceAttribute($value)
    {
        $this->attributes['price'] = sprintf("%01.2f",$value)*100;
    }

    /**
     * 获取商品
     */
    public function good(){
        return $this->hasOne(Good::class,'id','good_id');
    }

    /**
     * 获取商品SKU
     */
    public function goodSku(){
        return $this->hasOne(GoodSku::class,'id','good_sku_id');
    }

    /**
     * 获取订单
     */
    public function goodIndent(){
        return $this->hasOne(GoodIndent::class,'id','good_indent_id');
    }

    /**
     * 获取评价
     */
    public function Comment(){
        return $this->morphOne('App\Models\v1\Comment', 'model');
    }
}
