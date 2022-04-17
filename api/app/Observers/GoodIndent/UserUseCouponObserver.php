<?php

namespace App\Observers\GoodIndent;

use App\Models\v1\Coupon;
use App\Models\v1\GoodIndentUserCoupon;
use App\Models\v1\UserCoupon;
use Illuminate\Http\Request;
use App\Models\v1\GoodIndent;

/**
 * user use coupon
 * 用户使用优惠券
 * Class UserUseCouponObserver
 * @package App\Observers\GoodIndent
 */
class UserUseCouponObserver
{
    protected $request;
    protected $route = [
        // 这里配置需要执行该观察者的路由
        'app/goodIndent',
    ];
    protected $execute = false;

    public function __construct(Request $request)
    {
        // 是否执行观察者，默认为不执行，只有路由存在于$route时才会触发,并且在非http请求时不会触发
        if (!app()->runningInConsole()) {
            $this->request = $request;
            $path = explode("admin", $request->path());
            if (count($path) == 2) {
                $name = 'admin' . $path[1];
            } else {
                $path = explode("app", $request->path());
                $name = 'app' . $path[1];
            }
            if (collect($this->route)->contains($name)) {
                $this->execute = true;
            }
        }
    }

    public function created(GoodIndent $goodIndent)
    {
        // 当状态为待付款时触发
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_PAY) {
            $couponMoney = 0;
            if ($this->request->user_coupon_id) {   //使用了优惠券
                $UserCoupon = UserCoupon::with(['Coupon'])->find($this->request->user_coupon_id);
                if ($UserCoupon) {
                    switch ($UserCoupon->Coupon->type) {
                        case Coupon::COUPON_TYPE_FULL_REDUCTION:
                        case Coupon::COUPON_TYPE_RANDOM:
                            $couponMoney = $UserCoupon->Coupon->cost;
                            break;
                        case Coupon::COUPON_TYPE_DISCOUNT:  //折扣：商品总额*优惠券折扣/100
                            $couponMoney = ($goodIndent->total - $goodIndent->carriage) * ($UserCoupon->Coupon->cost / 10000);
                            break;
                    }
                    $UserCoupon->state = UserCoupon::USER_COUPON_STATE_USED;
                    $UserCoupon->save();
                }
                $goodIndent->coupon_money = $couponMoney;
                $GoodIndentUserCoupon = new GoodIndentUserCoupon();
                $GoodIndentUserCoupon->good_indent_id = $goodIndent->id;
                $GoodIndentUserCoupon->user_coupon_id = $this->request->user_coupon_id;
                $GoodIndentUserCoupon->save();
            }
            $goodIndent->total = ($goodIndent->total - $couponMoney) / 100;
            $goodIndent->save();
        }
    }
}
