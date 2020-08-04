<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;


/**
 * @property int user_id
 * @property string pay_type
 * @property int pay_id
 * @property string name
 * @property string number
 * @property string transaction_id
 * @property int money
 * @property string data
 * @property int state
 *
 */
class PaymentLog extends Model
{
    const PAYMENT_LOG_WX= 1; //支付类型:1微信支付
    const PAYMENT_LOG_STATE_CREATE= 0; //状态:未支付
    const PAYMENT_LOG_STATE_COMPLETE= 1; //状态:完成
    protected $appends = ['state_show','money_show'];
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
    public function getStateShowAttribute(){
        if(isset($this->attributes['state'])){
            $name='';
            switch ($this->attributes['state']){
                case static::PAYMENT_LOG_STATE_CREATE:
                    $name= '未支付';
                    break;
                case static::PAYMENT_LOG_STATE_COMPLETE:
                    $name= '已完成';
                    break;
            }
            return $name;
        }
    }

    public function getMoneyShowAttribute(){
        if(isset($this->attributes['money'])){
            return $this->attributes['money']/100;
        }
    }

    // 关联用户
    public function ApplyUser()
    {
        return $this->hasOne(ApplyUser::class,'id','apply_user_id');
    }
}
