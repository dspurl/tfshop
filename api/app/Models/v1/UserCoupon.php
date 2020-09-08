<?php

namespace App\Models\v1;

use Illuminate\Database\Eloquent\Model;
/**
 * @property int user_id
 * @property int coupon_id
 * @property string ticket
 */
class UserCoupon extends Model
{
    public static $withoutAppends = true;
    const USER_COUPON_STATE_UNUSED= 0; //状态：未使用
    const USER_COUPON_STATE_USED= 1; //状态：已使用
    const USER_COUPON_STATE_XSE= 2; //状态：已失效

    /**
     * 优惠券状态
     *
     * @return float|int
     */
    public function getStateAttribute()
    {
        if(isset($this->attributes['state'])){
            if(self::$withoutAppends){
                return $this->attributes['state'];
            }else{
                switch ($this->attributes['state']){
                    case self::USER_COUPON_STATE_UNUSED:
                        return '未使用';
                        break;
                    case self::USER_COUPON_STATE_USED:
                        return '已使用';
                        break;
                    case self::USER_COUPON_STATE_XSE:
                        return '已失效';
                        break;
                }
            }

        }
    }

    public function Coupon(){
        return $this->hasOne(Coupon::class,'id','coupon_id');
    }
}
