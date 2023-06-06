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
    const BANNER_TYPE_INDEX_LOGIN = 2; //类型：登录页广告
    const BANNER_TYPE_INDEX_LINK = 3; //类型：友情链接
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
                return $this->attributes['type'];
            } else {
                if ($this->attributes['type'] == static::BANNER_TYPE_INDEX_CAROUSEL) {
                    return __('banner.type.carousel');
                } else if ($this->attributes['type'] == static::BANNER_TYPE_INDEX_ADVERTISING) {
                    return __('banner.type.advertising');
                } else if ($this->attributes['type'] == static::BANNER_TYPE_INDEX_LOGIN) {
                    return __('banner.type.login');
                } else if ($this->attributes['type'] == static::BANNER_TYPE_INDEX_LINK) {
                    return __('banner.type.link');
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
                    return __('common.is_show');
                } else if ($this->attributes['state'] == static::BANNER_STAE_HIDE) {
                    return __('common.is_hide');
                }
            }
        }
    }
}
