<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string name
 * @property int sort
 * @property int pid
 * @property int state
 * @property string resources
 * @property int is_recommend
 */
class Category extends Model
{
    use SoftDeletes;
    public static $withoutAppends = false;
    const CATEGORY_STATE_YES = 0; //状态：正常
    const CATEGORY_STATE_NO = 1; //状态：隐藏
    const CATEGORY_IS_RECONMEND_NO = 0; //首页推荐：否
    const CATEGORY_IS_RECONMEND_YES = 1; //首页推荐：是
    protected $table = 'categorys';

    protected $appends = ['state_show'];

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

    public function getStateShowAttribute()
    {
        if (isset($this->attributes['state'])) {
            if (self::$withoutAppends) {
                return ' ';
            } else {
                if ($this->attributes['state'] == static::CATEGORY_STATE_YES) {
                    return __('common.is_show');
                } else if ($this->attributes['state'] == static::CATEGORY_STATE_NO) {
                    return __('common.is_hide');
                }
            }
        }
    }

    /**
     * 获取分类图片
     */
    public function resources()
    {
        return $this->morphOne('App\Models\v1\Resource', 'image');
    }

    /**
     * 获取父分类
     */
    public function Category()
    {
        return $this->hasOne('App\Models\v1\Category', 'id', 'pid');
    }

    /**
     * 已选的规格
     */
    public function SpecificationOn()
    {
        return $this->belongsToMany(Specification::class, 'category_specifications');
    }

    /**
     * 已选的品牌
     */
    public function BrandOn()
    {
        return $this->belongsToMany(Brand::class, 'category_brands');
    }

    /**
     * 获取所有的分类
     */
    public function getAllCategory()
    {
        $Category = static::get();
        $options = [];
        if ($Category) {
            foreach ($Category as $p) {
                $options[] = array(
                    'value' => $p['id'],
                    'label' => $p['name'],
                    'pid' => $p['pid'],
                    'id' => $p['id']
                );
            }
            return collect(genTree($options, 'pid'))->prepend(array(
                'value' => 0,
                'label' => __('category.top')
            ));
        } else {
            return true;
        }

    }
}
