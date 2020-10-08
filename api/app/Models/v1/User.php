<?php

namespace App\Models\v1;

use DateTimeInterface;
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
 * @property int miniweixin
 */
class User extends Authenticatable
{
    use Notifiable;
    const USER_GENDER_UNKNOWN= 0; //性别:未知
    const USER_GENDER_MAN= 1; //性别:男
    const USER_GENDER_WOMAN= 2; //性别:女
    const USER_STATE_NORMAL= 1; //状态：正常
    const USER_STATE_FORBID= 2; //状态：禁止访问
    protected $appends = ['gender_show','state_show'];
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
    //应用
    public function Apply()
    {
        return $this->hasMany(Common::class);
    }
}
