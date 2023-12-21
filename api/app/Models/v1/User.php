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
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\HasApiTokens;

/**
 * @property mixed email
 * @property int money
 * @property mixed portrait
 * @property mixed cellphone
 * @property string nickname
 * @property int state
 * @property int gender
 * @property string portrait
 * @property string uuid
 * @property string openid
 */
class User extends Authenticatable implements HasLocalePreference
{
    use HasApiTokens, Notifiable;
    const USER_GENDER_UNKNOWN = 0; //性别:未知
    const USER_GENDER_MAN = 1; //性别:男
    const USER_GENDER_WOMAN = 2; //性别:女
    const USER_STATE_NORMAL = 1; //状态：正常
    const USER_STATE_FORBID = 2; //状态：禁止访问
    const USER_UNSUBSCRIBE_YES = 1; //注销状态：1是
    const USER_UNSUBSCRIBE_NO = 0; //注销状态：0否
    const USER_NOTIFICATION_EMAIL = 'email';  //通知类型：邮件
    const USER_NOTIFICATION_WECHAT = 'wechat';  //通知类型：微信公众号模板消息
    const USER_PLATFORM_MINI_WEIXIN = 'miniweixin'; //平台标识:微信小程序
    const USER_PLATFORM_MINI_ALIPAY = 'minialipay'; //平台标识:支付宝小程序
    const USER_PLATFORM_MINI_TOUTIAO = 'minitoutiao'; //平台标识:头条小程序
    protected $appends = ['gender_show', 'state_show'];
    public static $withoutAppends = true;

    /**
     * 获取用户首选区域设置
     *
     * @return string
     */
    public function preferredLocale()
    {
        return $this->locale;
    }

    /**
     * 通过用户名找到对应的用户信息
     *
     * @param string $username
     * @return \App\User
     */
    public function findForPassport($username)
    {
        return $this->where('name', $username)->first();
    }

    /**
     * 自定义密码验证
     * 因授权登录无法获取用户输入的密码，所以允许密码为加密后的密码
     * @param $password
     * @return bool
     */
    public function validateForPassportPasswordGrant($password)
    {
        return Hash::check($password, $this->password) || $password == $this->password;
    }

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

    public function getGenderShowAttribute()
    {
        if (isset($this->attributes['gender'])) {
            if ($this->attributes['gender'] == static::USER_GENDER_UNKNOWN) {
                return __('user.gender.unknown');
            } else if ($this->attributes['gender'] == static::USER_GENDER_MAN) {
                return __('user.gender.man');
            } else if ($this->attributes['gender'] == static::USER_GENDER_WOMAN) {
                return __('user.gender.woman');
            }
        }
    }

    public function getStateShowAttribute()
    {
        if (isset($this->attributes['state'])) {
            if ($this->attributes['state'] == static::USER_STATE_NORMAL) {
                return __('user.state.normal');
            } else if ($this->attributes['state'] == static::USER_STATE_FORBID) {
                return __('user.state.forbid');
            }
        }
    }

    public function getNotificationAttribute()
    {
        if (self::$withoutAppends) {
            $return = $this->attributes['notification'];
        } else {
            if ($this->attributes['notification']) {
                $return = json_decode($this->attributes['notification'], true);
            } else {
                $return = [
                    static::USER_NOTIFICATION_EMAIL => false,
                    static::USER_NOTIFICATION_WECHAT => false,
                ];
            }
        }
        return $return;
    }

    public function setNotificationAttribute($value)
    {
        $this->attributes['notification'] = json_encode($value);
    }

    /**
     * 总额
     *
     * @return float|int
     */
    public function getMoneyAttribute()
    {
        if (isset($this->attributes['money'])) {
            if (self::$withoutAppends) {
                $return = $this->attributes['money'];
            } else {
                $return = $this->attributes['money'] / 100;
            }
            return $return > 0 ? $return : 0;
        }
    }
    public function getPlatformAttribute()
    {
        if (isset($this->attributes['platform'])) {
            if ($this->attributes['platform'] == static::USER_PLATFORM_MINI_WEIXIN) {
                return '微信小程序';
            } else if ($this->attributes['platform'] == static::USER_PLATFORM_MINI_ALIPAY) {
                return '支付宝小程序';
            } else if ($this->attributes['platform'] == static::USER_PLATFORM_MINI_TOUTIAO) {
                return '头条小程序';
            }
        }
    }

    public function Language(){
        return $this->hasOne(Language::class, 'code','lang');
    }
}
