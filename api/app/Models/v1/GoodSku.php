<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use PhpParser\Node\Expr\Cast\Object_;

/**
 * @property int id
 * @property int apply_id
 * @property int apply_user_id
 * @property int good_id
 * @property string market_price
 * @property string cost_price
 * @property string price
 * @property string inventory
 * @property int code_type
 * @property int is_fixed
 * @property Object_ product_sku
 * @property int is_delete
 *
 */
class GoodSku extends Model
{
    use SoftDeletes;

    public static $withoutAppends = true;

    const GOOD_SKU_IS_FIXED_NO = 0; //是否固定卡密：否
    const GOOD_SKU_IS_FIXED_YES = 1; //是否固定卡密：是
    const GOOD_SKU_CODE_TYPE_CDKEY = 0; //卡密类型：卡密
    const GOOD_SKU_CODE_TYPE_NET_DISK = 1; //卡密类型：网盘

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

    //规格json转换
    public function getProductSkuAttribute()
    {
        if (isset($this->attributes['product_sku'])) {
            return json_decode($this->attributes['product_sku']);
        }
    }

    /**
     * 规格json转换
     *
     * @param string $value
     * @return void
     */
    public function setProductSkuAttribute($value)
    {
        if ($value) {
            $this->attributes['product_sku'] = json_encode($value);
        }

    }

    /**
     * 获取单张图片
     */
    public function resources()
    {
        return $this->morphOne('App\Models\v1\Resource', 'image');
    }

    public function resourcesMany()
    {
        return $this->morphMany(Resource::class, 'image');
    }

    /**
     * 市场价
     *
     * @return float|int
     */
    public function getMarketPriceAttribute()
    {
        if (isset($this->attributes['market_price'])) {
            if (self::$withoutAppends) {
                return $this->attributes['market_price'];
            } else {
                return $this->attributes['market_price'] / 100;
            }
        }
    }

    /**
     * 成本价
     *
     * @return float|int
     */
    public function getCostPriceAttribute()
    {
        if (isset($this->attributes['cost_price'])) {
            if (self::$withoutAppends) {
                return $this->attributes['cost_price'];
            } else {
                return $this->attributes['cost_price'] / 100;
            }
        }
    }

    /**
     * 销售价
     *
     * @return float|int
     */
    public function getPriceAttribute()
    {
        if (isset($this->attributes['price'])) {
            if (self::$withoutAppends) {
                return $this->attributes['price'];
            } else {
                return $this->attributes['price'] / 100;
            }
        }
    }


    /**
     * 市场价
     *
     * @param string $value
     * @return void
     */
    public function setMarketPriceAttribute($value)
    {
        $this->attributes['market_price'] = sprintf("%01.2f", $value) * 100;
    }

    /**
     * 成本价
     *
     * @param string $value
     * @return void
     */
    public function setCostPriceAttribute($value)
    {
        $this->attributes['cost_price'] = sprintf("%01.2f", $value) * 100;
    }

    /**
     * 销售价
     *
     * @param string $value
     * @return void
     */
    public function setPriceAttribute($value)
    {
        $this->attributes['price'] = sprintf("%01.2f", $value) * 100;
    }

    public function GoodCode()
    {
        return $this->hasMany(GoodCode::class);
    }
}
