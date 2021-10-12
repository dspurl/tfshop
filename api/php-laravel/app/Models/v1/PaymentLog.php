<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;


/**
 * @property string type
 * @property string pay_type
 * @property int pay_id
 * @property string name
 * @property string number
 * @property string transaction_id
 * @property int money
 * @property string platform
 * @property string data
 * @property int state
 *
 */
class PaymentLog extends Model
{
    const PAYMENT_LOG_STATE_CREATE = 0; //状态:生成
    const PAYMENT_LOG_STATE_COMPLETE = 1; //状态:完成
    const PAYMENT_LOG_STATE_FAILURE = 2; //状态:失败
    const PAYMENT_LOG_TYPE_GOODS_INDENT = 'goodsIndent'; //支付类型:商品订单支付
    const PAYMENT_LOG_TYPE_GOODS_INDENT_REFUND = 'goodsIndentRefund'; //支付类型:商品订单退款
    const PAYMENT_LOG_TYPE_REFUND = 'refund'; //支付类型:退款
    const PAYMENT_LOG_PLATFORM_WEIXIN = 'weixin'; //支付平台:微信
    protected $appends = ['state_show', 'money_show', 'platform_show', 'type_show'];

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
            $name = '';
            switch ($this->attributes['state']) {
                case static::PAYMENT_LOG_STATE_CREATE:
                    $name = '未处理';
                    break;
                case static::PAYMENT_LOG_STATE_COMPLETE:
                    $name = '已完成';
                    break;
            }
            return $name;
        }
    }

    public function getMoneyShowAttribute()
    {
        if (isset($this->attributes['money'])) {
            return $this->attributes['money'] / 100;
        }
    }

    public function getPlatformShowAttribute()
    {
        if (isset($this->attributes['platform'])) {
            switch ($this->attributes['platform']) {
                case static::PAYMENT_LOG_PLATFORM_WEIXIN:
                    return '微信支付';
                    break;
            }
        }
    }

    public function getTypeShowAttribute()
    {
        if (isset($this->attributes['type'])) {
            switch ($this->attributes['type']) {
                case static::PAYMENT_LOG_TYPE_GOODS_INDENT:
                    return '订单支付';
                    break;
                case static::PAYMENT_LOG_TYPE_REFUND:
                    return '订单退款';
                    break;
            }
        }
    }
}
