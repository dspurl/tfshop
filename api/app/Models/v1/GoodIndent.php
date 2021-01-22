<?php

namespace App\Models\v1;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use App\Notifications\Common;
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
 */
class GoodIndent extends Model
{
    const GOOD_INDENT_STATE_PAY= 1; //状态：待付款
    const GOOD_INDENT_STATE_DELIVER= 2; //状态：待发货
    const GOOD_INDENT_STATE_TAKE= 3; //状态：待收货
    const GOOD_INDENT_STATE_EVALUATE= 4; //状态：待评价
    const GOOD_INDENT_STATE_ACCOMPLISH= 5; //状态：已完成
    const GOOD_INDENT_STATE_CANCEL= 6; //状态：已取消
    const GOOD_INDENT_STATE_REFUND= 7; //状态：已退款
    const GOOD_INDENT_STATE_REFUND_PROCESSING= 8; //状态：退款处理中
    const GOOD_INDENT_STATE_REFUND_FAILURE= 9; //状态：退款失败
    const GOOD_INDENT_REFUND_WAY_BALANCE= 0; //退款方式：退到余额
    const GOOD_INDENT_REFUND_WAY_BACK= 1; //退款方式：原路退回
    const GOOD_INDENT_IS_DELETE_YES = 1; //是否删除：是
    const GOOD_INDENT_IS_DELETE_NO = 0; //是否删除：否
    public static $withoutAppends = true;
    protected $appends = ['state_show'];
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

    /**
     * 支付处理
     * @param $request
     * @return array
     */
    public function payment($request){
        $openid=$request->header('openid');
        $GoodIndent=static::with(['goodsList'])->find($request->id);
        $body='对订单：'.$GoodIndent->identification.'的付款';
        $fee=$GoodIndent->total;
//        $fee=1;
//        $trade_type="JSAPI";
        $MiniProgram = new MiniProgram();
        $payment=$MiniProgram->payment($request->platform,$body,$fee,$openid,$request->trade_type);
        if($payment['result']== 'error'){
            return $payment;
        }
        $PaymentLog = new PaymentLog();
        $PaymentLog->name = $body;
        $PaymentLog->number = $payment['number'];
        $PaymentLog->money = $fee;
        $PaymentLog->pay_id = $request->id; //订单ID
        $PaymentLog->type = 'goodsIndent';
        $PaymentLog->platform= $request->platform;
        $PaymentLog->pay_type = 'App\Models\v1\GoodIndent';
        $PaymentLog->state = PaymentLog::PAYMENT_LOG_STATE_CREATE;
        $PaymentLog->save();
        //库存判断
        foreach ($GoodIndent->goodsList as $indentCommodity){
            $Good=Good::select('id','is_inventory','inventory')->find($indentCommodity['good_id']);
            if($Good && $Good->is_inventory == Good::GOOD_IS_INVENTORY_FILM){ //付款减库存
                if(!$indentCommodity['good_sku_id']){ //非SKU商品
                    if($Good->inventory-$indentCommodity['number']<0){
                        return [
                            'result'=>'error',
                            'msg'=>'存在库存不足的商品，请重新购买'
                        ];
                    }
                    $Good->inventory = $Good->inventory-$indentCommodity['number'];
                    $Good->save();
                }else{
                    $GoodSku=GoodSku::find($indentCommodity['good_sku_id']);
                    if($GoodSku->inventory-$indentCommodity['number']<0){
                        return [
                            'result'=>'error',
                            'msg'=>'存在库存不足的SKU商品，请重新购买'
                        ];
                    }
                    $GoodSku->inventory = $GoodSku->inventory-$indentCommodity['number'];
                    $GoodSku->save();
                }
            }
        }
        return $payment;
    }

    /**
     * 支付回调
     * @param $id
     * @return void
     */
    public function goodIndentNotify($id){
        $GoodIndent=GoodIndent::with(['goodsList','User'])->find($id);
        $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_DELIVER;
        $GoodIndent->pay_time= Carbon::now()->toDateTimeString();
        $GoodIndent->save();
        $Money=new MoneyLog();
        $Money->user_id = $GoodIndent->user_id;
        $Money->type = MoneyLog::MONEY_LOG_TYPE_EXPEND;
        $Money->money = $GoodIndent->total;
        $Money->remark = '对订单：'.$GoodIndent->identification.'的付款';
        $Money->save();
        (new Common)->finishPayment([
            'id'=>$GoodIndent->id,  //订单ID
            'identification'=>$GoodIndent->identification,  //订单号
            'name'=> $GoodIndent->goodsList[0]->name.(count($GoodIndent->goodsList)>1 ? '等多件': ''),    //商品名称
            'total'=>$GoodIndent->total,    //订单金额
            'type'=> '微信支付',
            'template'=>'finish_payment',   //通知模板标识
            'time'=>$GoodIndent->pay_time,  //下单时间(付款时间)
            'user_id'=>$GoodIndent->user_id    //用户ID
        ]);
        (new Common)->adminOrderSendGood([
            'id'=>$GoodIndent->id,  //订单ID
            'identification'=>$GoodIndent->identification,  //订单号
            'cellphone'=>$GoodIndent->User->cellphone,    //用户手机
            'total'=>$GoodIndent->total,    //订单金额
            'type'=> '微信支付',
            'template'=>'admin_order_send_good',   //通知模板标识
            'time'=>$GoodIndent->pay_time,  //下单时间(付款时间)
        ]);
    }

    /**
     * 退款回调
     * @param $id
     * @return string
     */
    public function goodIndentRefundNotify($id){
        $GoodIndent=GoodIndent::find($id);
        $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_REFUND;
        $GoodIndent->save();
        $Money=new MoneyLog();
        $Money->user_id = $GoodIndent->user_id;
        $Money->type = MoneyLog::MONEY_LOG_TYPE_INCOME;
        $Money->money = $GoodIndent->refund_money;
        $Money->remark = '订单：'.$GoodIndent->identification.'的退款，已退回到您的充值账号中';
        $Money->save();
        (new Common)->refund([
            'money_id'=>$Money->id,  //资金记录ID
            'identification'=>$GoodIndent->identification,  //订单号
            'total'=>$GoodIndent->refund_money,    //退款金额
            'refund_reason'=>$GoodIndent->refund_reason,    //退款理由
            'type'=>'原路退还', //退款方式
            'template'=>'refund_success',   //通知模板标识
            'user_id'=>$GoodIndent->user_id   //用户ID
        ]);
    }

    /**
     * 获取单张图片
     */
    public function resources(){
        return $this->morphOne('App\Models\v1\Resource', 'image');
    }

    /**
     * 退款方式
     *
     * @return float|int
     */
    public function getRefundWayAttribute()
    {
        if(isset($this->attributes['refund_way'])){
            if(self::$withoutAppends){
                $return='';
            }else{
                switch ($this->attributes['refund_way']){
                    case static::GOOD_INDENT_REFUND_WAY_BALANCE:
                        $return = '退到余额';
                        break;
                    case static::GOOD_INDENT_REFUND_WAY_BACK:
                        $return = '原路退还';
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
        if(isset($this->attributes['state'])){
            if(self::$withoutAppends){
                $return='';
            }else{
                switch ($this->attributes['state']){
                    case static::GOOD_INDENT_STATE_PAY:
                        $return = '待付款';
                        break;
                    case static::GOOD_INDENT_STATE_DELIVER:
                        $return = '待发货';
                        break;
                    case static::GOOD_INDENT_STATE_TAKE:
                        $return = '待收货';
                        break;
                    case static::GOOD_INDENT_STATE_EVALUATE:
                        $return = '待评价';
                        break;
                    case static::GOOD_INDENT_STATE_ACCOMPLISH:
                        $return = '已完成';
                        break;
                    case static::GOOD_INDENT_STATE_CANCEL:
                        $return = '已取消';
                        break;
                    case static::GOOD_INDENT_STATE_REFUND:
                        $return = '已退款';
                        break;
                    case static::GOOD_INDENT_STATE_REFUND_PROCESSING:
                        $return = '退款处理中';
                        break;
                    case static::GOOD_INDENT_STATE_REFUND_FAILURE:
                        $return = '退款失败';
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
        if(isset($this->attributes['total'])){
            if(self::$withoutAppends){
                $return= $this->attributes['total'];
            }else{
                $return= $this->attributes['total']/100;
            }
            return $return>0 ? $return : '';
        }
    }

    /**
     * 退款金额
     *
     * @return float|int
     */
    public function getRefundMoneyAttribute()
    {
        if(isset($this->attributes['refund_money'])){
            if(self::$withoutAppends){
                $return= $this->attributes['refund_money'];
            }else{
                $return= $this->attributes['refund_money']/100;
            }
            return $return>0 ? $return : '';
        }
    }

    /**
     * 运费
     *
     * @return float|int
     */
    public function getCarriageAttribute()
    {
        if(isset($this->attributes['carriage'])){
            if(self::$withoutAppends){
                $return= $this->attributes['carriage'];
            }else{
                $return= $this->attributes['carriage']/100;
            }
            return $return>0 ? $return : '';
        }
    }

    /**
     * 订单总额
     *
     * @param  string  $value
     * @return void
     */
    public function setTotalAttribute($value)
    {
        $this->attributes['total'] = sprintf("%01.2f",$value)*100;
    }

    /**
     * 退款金额
     *
     * @param  string  $value
     * @return void
     */
    public function setRefundMoneyAttribute($value)
    {
        $this->attributes['refund_money'] = sprintf("%01.2f",$value)*100;
    }

    /**
     * 运费
     *
     * @param  string  $value
     * @return void
     */
    public function setCarriageAttribute($value)
    {
        $this->attributes['carriage'] = sprintf("%01.2f",$value)*100;
    }

    /**
     * 获取订单商品列表
     */
    public function goodsList(){
        return $this->hasMany(GoodIndentCommodity::class);
    }

    /**
     * 用户
     */
    public function User(){
        return $this->hasOne(User::class,'id','user_id');
    }

    /**
     * 获取订单收货地址
     */
    public function GoodLocation(){
        return $this->hasOne(GoodLocation::class,'good_indent_id','id');
    }
    /**
     * 物流公司
     */
    public function Dhl(){
        return $this->hasOne(Dhl::class,'id','dhl_id');
    }

    /**
     * 获取订单支付记录
     */
    public function PaymentLog(){
        return $this->morphOne('App\Models\v1\PaymentLog', 'pay');
    }

    /**
     * 获取订单支付记录列表
     */
    public function PaymentLogAll(){
        return $this->morphMany('App\Models\v1\PaymentLog', 'pay');
    }
}
