<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string name
 * @property int id
 * @property int sort
 * @property string resources
 * @property int type
 * @property string url
 * @property int state
 */
class Banner extends Model
{
    public static $withoutAppends = true;
    const BANNER_TYPE_INDEX_CAROUSEL = 0; //类型：首页轮播
    const BANNER_TYPE_INDEX_ADVERTISING = 1; //类型：首页广告
    const BANNER_STAE_SHOW = 0; //状态：显示
    const BANNER_STAE_HIDE = 1; //状态：隐藏
    protected $appends = ['type_show', 'state_show'];

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
     * 获取单张图片
     */
    public function resources()
    {
        return $this->morphOne('App\Models\v1\Resource', 'image');
    }

    /**
     * 类型
     * @return string
     */
    protected function getTypeShowAttribute()
    {
        if (isset($this->attributes['type'])) {
            if (self::$withoutAppends) {
                return null;
            } else {
                if ($this->attributes['type'] == static::BANNER_TYPE_INDEX_CAROUSEL) {
                    return '首页轮播';
                } else if ($this->attributes['type'] == static::BANNER_TYPE_INDEX_ADVERTISING) {
                    return '首页广告';
                }
            }
        }
    }

    /**
     * 状态
     * @return string
     */
    protected function getStateShowAttribute()
    {
        if (isset($this->attributes['state'])) {
            if (self::$withoutAppends) {
                return null;
            } else {
                if ($this->attributes['state'] == static::BANNER_STAE_SHOW) {
                    return '显示';
                } else if ($this->attributes['state'] == static::BANNER_STAE_HIDE) {
                    return '隐藏';
                }
            }
        }
    }
}
