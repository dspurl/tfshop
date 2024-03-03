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
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\HasApiTokens;

/**
 * @property string lang
 * @property int user_id
 * @property string platform
 * @property string openid
 */
class UserPlatform extends Model
{

    const USER_PLATFORM_PLATFORM_MINI_WEIXIN = 'miniweixin'; //平台标识:微信小程序
    const USER_PLATFORM_PLATFORM_MINI_ALIPAY = 'minialipay'; //平台标识:支付宝小程序
    const USER_PLATFORM_PLATFORM_MINI_TOUTIAO = 'minitoutiao'; //平台标识:头条小程序
    const USER_PLATFORM_PLATFORM_PC = 'pc'; //平台标识:网站
    const USER_PLATFORM_PLATFORM_H5 = 'h5'; //平台标识:H5
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
    public function getPlatformAttribute()
    {
        if (isset($this->attributes['platform'])) {
            if ($this->attributes['platform'] == static::USER_PLATFORM_PLATFORM_MINI_WEIXIN) {
                return '微信小程序';
            } else if ($this->attributes['platform'] == static::USER_PLATFORM_PLATFORM_MINI_ALIPAY) {
                return '支付宝小程序';
            } else if ($this->attributes['platform'] == static::USER_PLATFORM_PLATFORM_MINI_TOUTIAO) {
                return '头条小程序';
            } else if ($this->attributes['platform'] == static::USER_PLATFORM_PLATFORM_PC) {
                return '网站';
            } else if ($this->attributes['platform'] == static::USER_PLATFORM_PLATFORM_H5) {
                return 'H5';
            }
        }
    }

}
