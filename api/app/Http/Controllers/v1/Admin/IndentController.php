<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\common\RedisService;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodIndentCommodity;
use App\Models\v1\MiniProgram;
use App\Models\v1\PaymentLog;
use App\Models\v1\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\common\RedisLock;

/**
 * indent
 * 订单管理
 * Class IndentController
 * @package App\Http\Controllers\v1\Admin
 */
class IndentController extends Controller
{
    /**
     * IndentList
     * 订单列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  title string 订单查询
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        GoodIndent::$withoutAppends = false;
        GoodIndentCommodity::$withoutAppends = false;
        $q = GoodIndent::query();
        if ($request->activeIndex) {
            if ($request->activeIndex == 7) {
                $q->whereRaw('(state=7 OR state=8)');
            } else {
                $q->where('state', $request->activeIndex);
            }
        }
        if ($request->title) {
            $q->where(function ($q1) use ($request) {
                $q1->orWhere('identification', $request->title)
                    ->orWhere('odd', $request->title);
            });
            $q->orWhereHas('GoodLocation', function ($query) use ($request) {
                $query->where('cellphone', $request->title)->orWhere('name', $request->title);
            });
            $q->orWhereHas('goodsList', function ($query) use ($request) {
                $query->where('name', 'like', "%$request->title%");
            });
        }
        $limit = $request->limit;
        if ($request->has('sort')) {
            if ($request->sort) {
                $sortFormatConversion = sortFormatConversion($request->sort);
                $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
            } else {
                $q->orderBy('sort', 'ASC')->orderBy('id', 'ASC');
            }
        }
        $paginate = $q->with(['goodsList' => function ($q) {
            $q->with(['goodSku']);
        }, 'GoodLocation', 'Dhl'])->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * IndentDetail
     * 订单详情
     * @param $id
     * @return string
     * @queryParam  id int 订单ID
     */
    public function detail($id)
    {
        GoodIndent::$withoutAppends = false;
        GoodIndentCommodity::$withoutAppends = false;
        $GoodIndent = GoodIndent::with(['goodsList' => function ($q) {
            $q->with(['goodSku', 'Good' => function ($q) {
                $q->select('id', 'identification', 'number');
            }]);
        }, 'GoodLocation', 'Dhl', 'PaymentLogAll' => function ($q) {
            $q->select('id', 'type', 'name', 'money', 'number', 'platform', 'state', 'pay_id', 'pay_type', 'created_at', 'transaction_id');
        }])->find($id);
        return resReturn(1, $GoodIndent);
    }

    /**
     * IndentQuery
     * 查询订单状态
     * @param $id
     * @return string
     * @queryParam  id int 订单ID
     */
    public function query($id)
    {
        if (!$id) {
            return resReturn(0, '参数有误', Code::CODE_PARAMETER_WRONG);
        }
        $PaymentLog = PaymentLog::find($id);
        $MiniProgram = new MiniProgram();
        $queryNumber = $MiniProgram->queryNumber($PaymentLog->platform, $PaymentLog->number, $PaymentLog->type);
        if ($queryNumber['result'] == 'error') {
            return resReturn(0, $queryNumber['msg'], Code::CODE_MISUSE);
        } else if ($queryNumber['result'] == 'ok' && $PaymentLog->state == PaymentLog::PAYMENT_LOG_STATE_CREATE) {  //需要同步时
            switch ($PaymentLog->type) {
                case PaymentLog::PAYMENT_LOG_TYPE_GOODS_INDENT:
                    (new GoodIndent())->goodIndentNotify($PaymentLog['pay_id']);
                    break;
                case PaymentLog::PAYMENT_LOG_TYPE_REFUND:
                    (new GoodIndent())->goodIndentRefundNotify($PaymentLog['pay_id']);
                    break;
            }
            $PaymentLog->state = PaymentLog::PAYMENT_LOG_STATE_COMPLETE;
            $PaymentLog->transaction_id = $queryNumber['transaction_id'];
            $PaymentLog->save();
        }
        return resReturn(1, '同步成功');
    }

    /**
     * IndentShipment
     * 发货
     * @param Request $request
     * @return string
     */
    public function shipment(Request $request)
    {
        $return = DB::transaction(function () use ($request) {
            $GoodIndent = GoodIndent::with(['User', 'GoodLocation'])->find($request->id);
            $GoodIndent->dhl_id = $request->dhl_id;
            $GoodIndent->odd = $request->odd;
            $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_TAKE;
            $GoodIndent->shipping_time = Carbon::now()->toDateTimeString();
            $GoodIndent->save();
            return array(1, '发货成功');
        });
        if ($return[0] == 1) {
            return resReturn(1, $return[1]);
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }

    /**
     * IndentDhl
     * 保存配送信息
     * @param Request $request
     * @return string
     */
    public function dhl(Request $request)
    {
        $GoodIndent = GoodIndent::find($request->id);
        $GoodIndent->dhl_id = $request->dhl_id;
        $GoodIndent->odd = $request->odd;
        $GoodIndent->save();
        return resReturn(1, '修改成功');
    }

    /**
     * IndentRefund
     * 退款
     * @param $id
     * @param Request $request
     * @return string
     */
    public function refund($id, Request $request)
    {
        if (!$id) {
            return resReturn(0, '参数有误', Code::CODE_PARAMETER_WRONG);
        }
        if (!$request->has('refund_money')) {
            return resReturn(0, '退款金额有误', Code::CODE_PARAMETER_WRONG);
        }
        if (!$request->has('refund_way')) {
            return resReturn(0, '退款方式有误', Code::CODE_PARAMETER_WRONG);
        }
        if (!$request->has('refund_reason')) {
            return resReturn(0, '退款原因有误', Code::CODE_PARAMETER_WRONG);
        }
        $redis = new RedisService();
        $lock = RedisLock::lock($redis, 'goodRefund');
        if ($lock) {
            $return = DB::transaction(function () use ($request, $id) {
                $GoodIndent = GoodIndent::with(['PaymentLog' => function ($q) {
                    $q->where('state', PaymentLog::PAYMENT_LOG_STATE_COMPLETE)->where('type', PaymentLog::PAYMENT_LOG_TYPE_GOODS_INDENT);
                }])->find($id);
                if ($request->refund_way == GoodIndent::GOOD_INDENT_REFUND_WAY_BALANCE) {
                    $GoodIndent->refund_money = $request->refund_money;
                    $GoodIndent->refund_way = $request->refund_way;
                    $GoodIndent->refund_reason = $request->refund_reason;
                    $GoodIndent->refund_time = Carbon::now()->toDateTimeString();
                    $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_REFUND;
                    $GoodIndent->save();
                    User::where('id', $GoodIndent->user_id)->increment('money', $request->refund_money * 100);
                } else if ($request->refund_way == GoodIndent::GOOD_INDENT_REFUND_WAY_BACK) {
                    $GoodIndent->refund_money = $request->refund_money;
                    $GoodIndent->refund_way = $request->refund_way;
                    $GoodIndent->refund_reason = $request->refund_reason;
                    $GoodIndent->refund_time = Carbon::now()->toDateTimeString();
                    $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_REFUND_PROCESSING;
                    $GoodIndent->save();
                }
                return array('result' => 'ok');
            });
            RedisLock::unlock($redis, 'goodRefund');
            if ($return['result'] == 'ok') {
                return resReturn(1, '退款操作成功');
            } else {
                return resReturn(0, $return['msg'], Code::CODE_PARAMETER_WRONG);
            }
        } else {
            return resReturn(0, '业务繁忙，请稍后再试', Code::CODE_SYSTEM_BUSY);
        }
    }
}
