<?php
namespace App\Http\Controllers\v1\Plugin\Client;
use App\Code;
use App\Models\v1\Coupon;
use App\Models\v1\UserCoupon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * Coupon
 * 优惠券
 * Class CouponController
 * @package App\Http\Controllers\v1\Plugin\Admin
 */
class CouponController extends Controller
{
    /**
     * CouponList
     * 优惠券列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = Coupon::query();
        $limit = $request->limit;
        $q->where('state', Coupon::COUPON_STATE_UNDERWAY)->where('residue', '>', 0);
        $q->where(function ($q1) use ($request) {    //不包括随机优惠券
            $q1->orWhere('type', Coupon::COUPON_TYPE_FULL_REDUCTION)
                ->orWhere('type', Coupon::COUPON_TYPE_DISCOUNT);
        });
        $q->orderBy('cost', 'desc');
        $q->orderBy('id', 'desc');
        $q->select('id', 'cost', 'type', 'amount', 'residue', 'sill', 'start_time', 'end_time', 'limit_get', 'state');
        $paginate = $q->withCount(['UserCoupon' => function ($q) {
            $q->where('user_id', auth('web')->user()->id);
        }])->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * UserCouponList
     * 用户优惠券列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  page string 页码
     * @queryParam  index int 状态
     * @queryParam  money int 商品金额
     */
    public function user(Request $request)
    {
        $q = UserCoupon::query();
        if ($request->index) {
            switch ($request->index) {
                case 1:
                    $q->where('state', UserCoupon::USER_COUPON_STATE_UNUSED);
                    break;
                case 2:
                    $q->where('state', UserCoupon::USER_COUPON_STATE_USED);
                    break;
                case 3:
                    $q->where('state', UserCoupon::USER_COUPON_STATE_INVALID);
                    break;
            }
        }
        if ($request->money) {
            $q->whereHas('Coupon', function ($query) use ($request) {
                $query->where(function ($q1) use ($request) {    //无门槛或当前购买金额大于门槛金额
                    $q1->orWhere('sill', 0)
                        ->orWhere('sill', '<=', $request->money * 100);
                });
            });
        } else {
            $q->whereHas('Coupon', function ($query) use ($request) {
                $query->where('id', '>', 0);
            });
        }
        $limit = $request->limit;
        $q->where('user_id', auth('web')->user()->id);
        $q->orderBy('state', 'ASC');
        $q->orderBy('id', 'desc');
        $paginate = $q->with(['Coupon'])->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * UserCouponCount
     * 用户优惠券数
     * @return \Illuminate\Http\Response
     */
    public function count()
    {
        $count = UserCoupon::where('user_id', auth('web')->user()->id)->where('state', UserCoupon::USER_COUPON_STATE_UNUSED)->count();
        return resReturn(1, $count);
    }

    /**
     * CouponCreate
     * 领取优惠券
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  id int 优惠券ID
     */
    public function create(Request $request)
    {
        $Coupon = Coupon::find($request->id);
        if ($Coupon->residue == 0) {
            return resReturn(0, '优惠券已领完', Code::CODE_WRONG);
        }
        if ($Coupon->limit_get > 0) {
            $count = UserCoupon::where('user_id', auth('web')->user()->id)->where('coupon_id', $request->id)->count();
            if ($count >= $Coupon->limit_get) {
                return resReturn(0, '您已领取过优惠券，无法再次领取', Code::CODE_WRONG);
            }
        }
        $return = DB::transaction(function () use ($request, $Coupon) {
            $UserCoupon = new UserCoupon();
            $UserCoupon->user_id = auth('web')->user()->id;
            $UserCoupon->coupon_id = $request->id;
            $UserCoupon->ticket = orderNumber();
            $UserCoupon->failure_time = $Coupon->end_time;
            $UserCoupon->save();
            Coupon::where('id', $request->id)->decrement('residue');
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '添加成功');
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }
}
