<?php
/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Models\v1;

use App\common\RedisService;
use App\Traits\CommonTrait;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int user_id
 * @property int identification
 * @property int state
 * @property int odd
 * @property int dhl_id
 * @property string endtime
 * @property string total
 * @property string remark
 * @property int carriage
 * @property int refund_money
 * @property int refund_way
 * @property string pay_time
 * @property int refund_reason
 * @property int is_automatic_receiving
 * @property string shipping_time
 * @property string receiving_time
 * @property string created_at
 * @property string confirm_time
 * @property string refund_time
 * @property string overtime
 * @property int pay_way
 */
class GoodIndent extends Model
{
    use SoftDeletes;
    use CommonTrait;

    const GOOD_INDENT_STATE_PAY = 1; //状态：待付款
    const GOOD_INDENT_STATE_DELIVER = 2; //状态：待发货
    const GOOD_INDENT_STATE_TAKE = 3; //状态：待收货
    const GOOD_INDENT_STATE_FAILURE = 4; //状态：已失效
    const GOOD_INDENT_STATE_ACCOMPLISH = 5; //状态：已完成
    const GOOD_INDENT_STATE_CANCEL = 6; //状态：已取消
    const GOOD_INDENT_STATE_REFUND = 7; //状态：已退款
    const GOOD_INDENT_STATE_REFUND_PROCESSING = 8; //状态：退款处理中
    const GOOD_INDENT_STATE_REFUND_FAILURE = 9; //状态：退款失败
    const GOOD_INDENT_REFUND_WAY_BALANCE = 0; //退款方式：退到余额
    const GOOD_INDENT_REFUND_WAY_BACK = 1; //退款方式：原路退回
    const GOOD_INDENT_IS_AUTOMATIC_RECEIVING_YES = 1; //自动发货：是
    const GOOD_INDENT_IS_AUTOMATIC_RECEIVING_NO = 0; //自动发货：否
    const GOOD_INDENT_TYPE_COMMON = 0; //普通订单
    const GOOD_INDENT_PAY_WAY_BALANCE = 0; //支付方式：余额
    const GOOD_INDENT_PAY_WAY_ONLINE = 1; //支付方式：在线支付
    public static $withoutAppends = true;
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

    /**
     * 获取单张图片
     */
    public function resources()
    {
        return $this->morphOne('App\Models\v1\Resource', 'image');
    }

    /**
     * 退款方式
     *
     * @return float|int
     */
    public function getRefundWayAttribute()
    {
        if (isset($this->attributes['refund_way'])) {
            if (self::$withoutAppends) {
                $return = '';
            } else {
                switch ($this->attributes['refund_way']) {
                    case static::GOOD_INDENT_REFUND_WAY_BALANCE:
                        $return = __('good_indent.refund_way.balance');
                        break;
                    case static::GOOD_INDENT_REFUND_WAY_BACK:
                        $return = __('good_indent.refund_way.back');
                        break;
                }
            }
            return $return;
        }
    }

    public function getTypeAttribute()
    {
        if (isset($this->attributes['type'])) {
            $return = $this->attributes['type'];
            if (!self::$withoutAppends) {
                switch ($this->attributes['type']) {
                    case static::GOOD_INDENT_TYPE_COMMON:
                        $return = __('good_indent.type.common');
                        break;
                }
            }
            return $return;
        }
    }

    /**
     * 状态
     *
     * @return float|int
     */
    public function getStateShowAttribute()
    {
        if (isset($this->attributes['state'])) {
            $return = '';
            if (!self::$withoutAppends) {
                switch ($this->attributes['state']) {
                    case static::GOOD_INDENT_STATE_PAY:
                        $return = __('good_indent.state.pay');
                        break;
                    case static::GOOD_INDENT_STATE_DELIVER:
                        $return = __('good_indent.state.deliver');
                        break;
                    case static::GOOD_INDENT_STATE_TAKE:
                        $return = __('good_indent.state.take');
                        break;
                    case static::GOOD_INDENT_STATE_FAILURE:
                        $return = __('good_indent.state.failure');
                        break;
                    case static::GOOD_INDENT_STATE_ACCOMPLISH:
                        $return = __('good_indent.state.accomplish');
                        break;
                    case static::GOOD_INDENT_STATE_CANCEL:
                        $return = __('good_indent.state.cancel');
                        break;
                    case static::GOOD_INDENT_STATE_REFUND:
                        $return = __('good_indent.state.refund');
                        break;
                    case static::GOOD_INDENT_STATE_REFUND_PROCESSING:
                        $return = __('good_indent.state.refund_processing');
                        break;
                    case static::GOOD_INDENT_STATE_REFUND_FAILURE:
                        $return = __('good_indent.state.refund_failure');
                        break;
                }
            }
            return $return;
        }
    }

    public function getPayWayAttribute()
    {
        if (isset($this->attributes['pay_way'])) {
            $return = '';
            if (!self::$withoutAppends) {
                switch ($this->attributes['pay_way']) {
                    case static::GOOD_INDENT_PAY_WAY_BALANCE:
                        $return = __('balance.pay');
                        break;
                    case static::GOOD_INDENT_PAY_WAY_ONLINE:
                        $return = __('online.pay');
                        break;
                }
            }
            return $return;
        }
    }

    /**
     * 订单总额
     *
     * @return float|int
     */
    public function getTotalAttribute()
    {
        if (isset($this->attributes['total'])) {
            if (self::$withoutAppends) {
                $return = $this->attributes['total'];
            } else {
                $return = $this->attributes['total'] / 100;
            }
            return $return > 0 ? $return : 0;
        }
    }

    /**
     * 退款金额
     *
     * @return float|int
     */
    public function getRefundMoneyAttribute()
    {
        if (isset($this->attributes['refund_money'])) {
            if (self::$withoutAppends) {
                $return = $this->attributes['refund_money'];
            } else {
                $return = $this->attributes['refund_money'] / 100;
            }
            return $return > 0 ? $return : 0;
        }
    }

    /**
     * 运费
     *
     * @return float|int
     */
    public function getCarriageAttribute()
    {
        if (isset($this->attributes['carriage'])) {
            if (self::$withoutAppends) {
                $return = $this->attributes['carriage'];
            } else {
                $return = $this->attributes['carriage'] / 100;
            }
            return $return > 0 ? $return : 0;
        }
    }

    /**
     * 订单总额
     *
     * @param string $value
     * @return void
     */
    public function setTotalAttribute($value)
    {
        $this->attributes['total'] = sprintf("%01.2f", $value) * 100;
    }

    /**
     * 退款金额
     *
     * @param string $value
     * @return void
     */
    public function setRefundMoneyAttribute($value)
    {
        $this->attributes['refund_money'] = sprintf("%01.2f", $value) * 100;
    }

    /**
     * 运费
     *
     * @param string $value
     * @return void
     */
    public function setCarriageAttribute($value)
    {
        $this->attributes['carriage'] = sprintf("%01.2f", $value) * 100;
    }

    /**
     * 获取订单商品列表
     */
    public function goodsList()
    {
        return $this->hasMany(GoodIndentCommodity::class);
    }

    /**
     * 用户
     */
    public function User()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    /**
     * 获取订单收货地址
     */
    public function GoodLocation()
    {
        return $this->hasOne(GoodLocation::class, 'good_indent_id', 'id');
    }

    /**
     * 物流公司
     */
    public function Dhl()
    {
        return $this->hasOne(Dhl::class, 'id', 'dhl_id');
    }

    /**
     * 获取订单支付记录
     */
    public function PaymentLog()
    {
        return $this->morphOne('App\Models\v1\PaymentLog', 'pay');
    }

    /**
     * 获取订单支付记录列表
     */
    public function PaymentLogAll()
    {
        return $this->morphMany('App\Models\v1\PaymentLog', 'pay');
    }

    public function GoodCode()
    {
        return $this->belongsToMany(GoodCode::class, 'good_indent_good_codes');
    }

    /**
     * 支付回调
     * @param $id
     * @return void
     */
    public function goodIndentNotify($id)
    {
        $GoodIndent = GoodIndent::find($id);
        $redis = new RedisService();
        $redis->setex('goodIndent.pay.type.' . $GoodIndent->id, 5, __('good_indent.state.notify'));
        $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_DELIVER;
        $GoodIndent->pay_way = static::GOOD_INDENT_PAY_WAY_ONLINE;
        $GoodIndent->pay_time = Carbon::now()->toDateTimeString();
        $GoodIndent->save();
    }

    /**
     * 退款回调
     * @param $id
     * @return string
     */
    public function goodIndentRefundNotify($id)
    {
        $GoodIndent = GoodIndent::find($id);
        $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_REFUND;
        $GoodIndent->save();
    }
}
