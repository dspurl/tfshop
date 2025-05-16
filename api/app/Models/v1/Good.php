<?php

/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */

namespace App\Models\v1;

use App\Traits\CommonTrait;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int id
 * @property int apply_id
 * @property int apply_user_id
 * @property string identification
 * @property string name
 * @property int category_id
 * @property string number
 * @property int brand_id
 * @property int inventory
 * @property int market_price
 * @property int cost_price
 * @property int price
 * @property int order_price
 * @property string keywords
 * @property string short_description
 * @property string details
 * @property int is_show
 * @property int is_delete
 * @property int is_recommend
 * @property int is_inventory
 * @property int is_new
 * @property int is_hot
 * @property int sort
 * @property string time
 * @property string timing
 * @property int freight_id
 * @property string lang
 * @property int lang_parent_id
 * @property int freight_type
 * @property int freight
 */
class Good extends Model
{
    use SoftDeletes;
    use CommonTrait;

    public static $withoutAppends = true;
    const GOOD_TYPE_COMMON = 0; //类型：普通商品
    const GOOD_TYPE_VIRTUAL = 1; //类型：虚拟商品
    const GOOD_TYPE_KEYS = 2; //类型：卡密/网盘
    const GOOD_TYPE_DOWNLOAD = 3; //类型：下载商品
    const GOOD_SHOW_ENTREPOT = 0; //状态：仓库
    const GOOD_SHOW_PUTAWAY = 1; //状态：上架
    const GOOD_SHOW_TIMING = 2; //状态：定时
    const GOOD_RECOMMEND_NO = 0; //推荐：否
    const GOOD_RECOMMEND_YES = 1; //推荐：是
    const GOOD_NEW_NO = 0; //新品：否
    const GOOD_NEW_YES = 1; //新品：是
    const GOOD_HOT_NO = 0; //热销：否
    const GOOD_HOT_YES = 1; //热销：是
    const GOOD_IS_INVENTORY_NO = 0; //减库存方式：拍下减库存
    const GOOD_IS_INVENTORY_FILM = 1; //减库存方式：付款减库存
    const GOOD_FREIGHT_TYPE_FIXED = 0; //运费方式：固定邮费
    const GOOD_FREIGHT_TYPE_TEMPLATE = 1; //运费方式：运费模板

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
     * 获取商品访问记录
     */
    public function browse()
    {
        return $this->hasMany(Browse::class);
    }

    /**
     * 获取商品收藏
     */
    public function collect()
    {
        return $this->hasMany(Collect::class);
    }

    /**
     * 获取商品销量
     */
    public function goodIndentCommodity()
    {
        return $this->hasMany(GoodIndentCommodity::class);
    }

    /**
     * 获取商品SKU
     */
    public function goodSku()
    {
        return $this->hasMany(GoodSku::class);
    }


    /**
     * 分类
     */
    public function Category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getTypeAttribute()
    {
        if (isset($this->attributes['type'])) {
            if (self::$withoutAppends) {
                return $this->attributes['type'];
            }
            $name = "";
            switch ($this->attributes['type']) {
                case static::GOOD_TYPE_COMMON:
                    $name = __('good.type.common');
                    break;
                case static::GOOD_TYPE_VIRTUAL:
                    $name = __('good.type.virtual');
                    break;
                case static::GOOD_TYPE_KEYS:
                    $name = __('good.type.keys');
                    break;
                case static::GOOD_TYPE_DOWNLOAD:
                    $name = __('good.type.download');
                    break;
            }
            return $name;
        }
    }
    public function getIsRecommendAttribute()
    {
        if (isset($this->attributes['is_recommend'])) {
            if (self::$withoutAppends) {
                return $this->attributes['is_recommend'];
            }
            $name = "";
            switch ($this->attributes['is_recommend']) {
                case static::GOOD_RECOMMEND_NO:
                    $name = "否";
                    break;
                case static::GOOD_RECOMMEND_YES:
                    $name = "是";
                    break;
            }
            return $name;
        }
    }
    public function getIsShowAttribute()
    {
        if (isset($this->attributes['is_show'])) {
            if (self::$withoutAppends) {
                return $this->attributes['is_show'];
            } else {
                $name = "";
                switch ($this->attributes['is_show']) {
                    case static::GOOD_SHOW_ENTREPOT:
                        $name = "仓库中";
                        break;
                    case static::GOOD_SHOW_PUTAWAY:
                        $name = "已上架";
                        break;
                    case static::GOOD_SHOW_TIMING:
                        $name = "定时上架";
                        break;
                }
                return $name;
            }
        }
    }
    public function getFreightTypeAttribute()
    {
        if (isset($this->attributes['freight_type'])) {
            if (self::$withoutAppends) {
                return $this->attributes['freight_type'];
            } else {
                $name = "";
                switch ($this->attributes['freight_type']) {
                    case static::GOOD_FREIGHT_TYPE_FIXED:
                        $name = "固定邮费";
                        break;
                    case static::GOOD_FREIGHT_TYPE_TEMPLATE:
                        $name = "运费模板";
                        break;
                }
                return $name;
            }
        }
    }
    public function getIsInventoryAttribute()
    {
        if (isset($this->attributes['is_inventory'])) {
            if (self::$withoutAppends) {
                return $this->attributes['is_inventory'];
            } else {
                $name = "";
                switch ($this->attributes['is_inventory']) {
                    case static::GOOD_IS_INVENTORY_NO:
                        $name = "拍下减库存";
                        break;
                    case static::GOOD_IS_INVENTORY_FILM:
                        $name = "付款减库存";
                        break;
                }
                return $name;
            }
        }
    }

    /**
     * 商品展示库存
     *
     * @param $row
     * @return int
     */
    public function getInventory($row)
    {
        if (count($row->goodSku) > 0) {
            $return = $row->goodSku->sum('inventory');
        } else {
            $return = $row->inventory;
        }
        return $return;
    }

    /**
     * 减库存方式
     *
     */
    protected function getIsInventoryShowAttribute()
    {
        if (isset($this->attributes['is_inventory'])) {
            if (self::$withoutAppends) {
                return '';
            } else {
                switch ($this->attributes['is_inventory']) {
                    case self::GOOD_IS_INVENTORY_NO:
                        return __('good.is_inventory.no');
                        break;
                    case self::GOOD_IS_INVENTORY_FILM:
                        return __('good.is_inventory.film');
                        break;
                }
            }
        }
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
                $return = $this->attributes['market_price'];
            } else {
                $return = $this->attributes['market_price'] / 100;
            }
            return $return > 0 ? $return : '';
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
                $return = $this->attributes['cost_price'];
            } else {
                $return = $this->attributes['cost_price'] / 100;
            }
            return $return > 0 ? $return : '';
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
                $return = $this->attributes['price'];
            } else {
                $return = $this->attributes['price'] / 100;
            }
            return $return > 0 ? $return : 0;
        }
    }

    /**
     * 商品排序价格
     *
     * @return float|int
     */
    public function getOrderPriceAttribute()
    {
        if (isset($this->attributes['order_price'])) {
            if (self::$withoutAppends) {
                $return = $this->attributes['order_price'];
            } else {
                $return = $this->attributes['order_price'] / 100;
            }
            return $return > 0 ? $return : '';
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

    /**
     * 商品排序价格
     *
     * @param string $value
     * @return void
     */
    public function setOrderPriceAttribute($value)
    {
        $this->attributes['order_price'] = sprintf("%01.2f", $value) * 100;
    }
    public function setImgAttribute($value)
    {
        if ($value) {
            $this->attributes['img'] = json_encode($value);
        }
    }

    public function getImgAttribute()
    {
        if (isset($this->attributes['img'])) {
            return json_decode($this->attributes['img']);
        }
    }
}
