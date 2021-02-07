<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @property string password
 * @property mixed name
 * @property mixed email
 *  @property int money
 * @property mixed portrait
 * @property int type
 * @property mixed cellphone
 * @property string api_token
 * @property string nickname
 * @property int state
 * @property int gender
 * @property string miniweixin
 * @property string uuid
 * @property string wechat
 */
class User extends Authenticatable implements HasLocalePreference
{
    use Notifiable;
    const USER_GENDER_UNKNOWN= 0; //性别:未知
    const USER_GENDER_MAN= 1; //性别:男
    const USER_GENDER_WOMAN= 2; //性别:女
    const USER_STATE_NORMAL= 1; //状态：正常
    const USER_STATE_FORBID= 2; //状态：禁止访问
    const USER_UNSUBSCRIBE_YES= 1; //注销状态：1是
    const USER_UNSUBSCRIBE_NO= 0; //注销状态：0否
    const USER_NOTIFICATION_EMAIL='email';  //通知类型：邮件
    const USER_NOTIFICATION_WECHAT='wechat';  //通知类型：微信公众号模板消息
    const USER_WECHAT_SUBSCRIBE_YES=1;  //是否关注微信公众平台：是
    const USER_WECHAT_SUBSCRIBE_NO=0;  //是否关注微信公众平台：否
    protected $appends = ['gender_show','state_show'];
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
     * Prepare a date for array / JSON serialization.
     *
     * @param  \DateTimeInterface  $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
    public function getGenderShowAttribute(){
        if(isset($this->attributes['gender'])){
            if($this->attributes['gender'] == static::USER_GENDER_UNKNOWN){
                return '未知';
            }else if($this->attributes['gender'] == static::USER_GENDER_MAN){
                return '男性';
            }else if($this->attributes['gender'] == static::USER_GENDER_WOMAN){
                return '女性';
            }
        }
    }

    public function getStateShowAttribute(){
        if(isset($this->attributes['state'])){
            if($this->attributes['state'] == static::USER_STATE_NORMAL){
                return '正常';
            }else if($this->attributes['state'] == static::USER_STATE_FORBID){
                return '禁止访问';
            }
        }
    }

    public  function getNotificationAttribute(){
        if(self::$withoutAppends){
            $return= $this->attributes['notification'];
        }else{
            if($this->attributes['notification']){
                $return= json_decode($this->attributes['notification'],true);
            }else{
                $return=[
                    static::USER_NOTIFICATION_EMAIL=>false,
                    static::USER_NOTIFICATION_WECHAT=>false,
                ];
            }
        }
        return $return;
    }

    public function setNotificationAttribute($value)
    {
        $this->attributes['notification'] =json_encode($value);
    }

    /**
     * 总额
     *
     * @return float|int
     */
    public function getMoneyAttribute()
    {
        if(isset($this->attributes['money'])){
            if(self::$withoutAppends){
                $return= $this->attributes['money'];
            }else{
                $return= $this->attributes['money']/100;
            }
            return $return>0 ? $return : 0;
        }
    }
}
