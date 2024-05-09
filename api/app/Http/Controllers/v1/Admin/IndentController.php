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

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\common\RedisService;
use App\Exports\v1\IndentExport;
use App\Models\v1\Good;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodIndentCommodity;
use App\Models\v1\MiniProgram;
use App\Models\v1\PaymentLog;
use App\Models\v1\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use App\common\RedisLock;
use Maatwebsite\Excel\Facades\Excel;

/**
 * @group [ADMIN]Indent(订单管理)
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
        Good::$withoutAppends = false;
        GoodIndentCommodity::$withoutAppends = false;
        $q = GoodIndent::query();
        $q->withTrashed();
        if ($request->activeIndex) {
            if ($request->activeIndex == 7) {
                $q->whereRaw('(state=7 OR state=8)');
            } else {
                $q->where('state', $request->activeIndex);
            }
        }
        if ($request->has('type')) {
            $q->where('type', $request->type);
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
        $q->where('lang', App::getLocale());
        $paginate = $q->with(['goodsList' => function ($q) {
            $q->with(['goodSku', 'good']);
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
        Good::$withoutAppends = false;
        GoodIndent::$withoutAppends = false;
        GoodIndentCommodity::$withoutAppends = false;
        $GoodIndent = GoodIndent::withTrashed()->with(['goodsList' => function ($q) {
            $q->with(['goodSku', 'Good' => function ($q) {
                $q->select('id', 'identification', 'number', 'type');
            }]);
        }, 'GoodLocation', 'Dhl', 'PaymentLogAll' => function ($q) {
            $q->select('id', 'type', 'name', 'money', 'number', 'platform', 'state', 'pay_id', 'pay_type', 'created_at', 'transaction_id');
        }, 'GoodCode'])->find($id);
        $GoodIndent->automaticReceivingState = config('tfshop.automaticReceivingState');
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
            return resReturn(0, __('common.arguments'), Code::CODE_PARAMETER_WRONG);
        }
        $PaymentLog = PaymentLog::find($id);
        $MiniProgram = new MiniProgram();
        $queryNumber = $MiniProgram->queryNumber($PaymentLog->platform, $PaymentLog->number, $PaymentLog->type);
        if ($queryNumber['result'] == 'error') {
            return resReturn(0, $queryNumber['msg'], Code::CODE_MISUSE);
        } else if ($queryNumber['result'] == 'ok' && $PaymentLog->state == PaymentLog::PAYMENT_LOG_STATE_CREATE) {  //需要同步时
            switch ($PaymentLog->type) {
                case PaymentLog::PAYMENT_LOG_TYPE_GOODS_INDENT:
                    if ($queryNumber['state']) {
                        (new GoodIndent())->goodIndentNotify($PaymentLog['pay_id']);
                    }
                    break;
                case PaymentLog::PAYMENT_LOG_TYPE_REFUND:
                case PaymentLog::PAYMENT_LOG_TYPE_GOODS_INDENT_REFUND:
                    if ($queryNumber['state']) {
                        (new GoodIndent())->goodIndentRefundNotify($PaymentLog['pay_id']);
                    }
                    break;
            }
            $PaymentLog->state = PaymentLog::PAYMENT_LOG_STATE_COMPLETE;
            $PaymentLog->transaction_id = $queryNumber['transaction_id'];
            $PaymentLog->save();
        }
        return resReturn(1, __('common.succeed'));
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
            if ($request->has('dhl_id')) {
                $GoodIndent = GoodIndent::with(['User', 'GoodLocation'])->find($request->id);
                $GoodIndent->dhl_id = $request->dhl_id;
                $GoodIndent->odd = $request->odd;
            } else {
                $GoodIndent = GoodIndent::with(['User'])->find($request->id);
            }
            $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_TAKE;
            $GoodIndent->shipping_time = Carbon::now()->toDateTimeString();
            if (config('tfshop.automaticReceivingState')) {
                $automaticReceiving = config('tfshop.automaticReceiving');
                $GoodIndent->receiving_time = date('Y-m-d 00:00:00', strtotime("+$automaticReceiving day"));
            }
            $GoodIndent->save();
            return array(1, __('common.succeed'));
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
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.amend')]));
    }

    /**
     * IndentReceiving
     * 延长收货时间
     * @param Request $request
     * @return string
     */
    public function receiving(Request $request)
    {
        $GoodIndent = GoodIndent::find($request->id);
        $GoodIndent->receiving_time = $request->new_receiving_time;
        $GoodIndent->save();
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.amend')]));
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
            return resReturn(0, __('common.arguments'), Code::CODE_PARAMETER_WRONG);
        }
        if (!$request->has('refund_money')) {
            return resReturn(0, __('hint.error.mistake', ['attribute' => __('good_indent.refund_money')]), Code::CODE_PARAMETER_WRONG);
        }
        if (!$request->has('refund_way')) {
            return resReturn(0, __('hint.error.mistake', ['attribute' => __('good_indent.refund_way')]), Code::CODE_PARAMETER_WRONG);
        }
        if (!$request->has('refund_reason')) {
            return resReturn(0, __('hint.error.mistake', ['attribute' => __('good_indent.refund_reason')]), Code::CODE_PARAMETER_WRONG);
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
                return resReturn(1, __('common.succeed'));
            } else {
                return resReturn(0, $return['msg'], Code::CODE_PARAMETER_WRONG);
            }
        } else {
            return resReturn(0, __('common.busy'), Code::CODE_SYSTEM_BUSY);
        }
    }

    /**
     * IndentExport
     * 订单导出
     * @param Request $request
     * @return string
     */
    public function export(Request $request)
    {
        $date = date('Ymd');
        $title = __('good_indent.name');
        $name = "temporary/$title$date.xlsx";
        $list = [];
        GoodIndent::$withoutAppends = false;
        Good::$withoutAppends = false;
        GoodIndentCommodity::$withoutAppends = false;
        $q = GoodIndent::query();
        $q->withTrashed();
        if ($request->activeIndex) {
            if ($request->activeIndex == 7) {
                $q->whereRaw('(state=7 OR state=8)');
            } else {
                $q->where('state', $request->activeIndex);
            }
        }
        if ($request->has('type')) {
            $q->where('type', $request->type);
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
        if ($request->has('sort')) {
            if ($request->sort) {
                $sortFormatConversion = sortFormatConversion($request->sort);
                $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
            } else {
                $q->orderBy('sort', 'ASC')->orderBy('id', 'ASC');
            }
        }
        $paginate = $q->with(['goodsList' => function ($q) {
            $q->with(['goodSku', 'good']);
        }, 'GoodLocation', 'Dhl'])->get();
        $config = [];
        $number = 0;
        foreach ($paginate as $p) {
            foreach ($p->goodsList as $id => $g) {
                $number += 1;
                $config[$p->state_show][] = (count($p->goodsList) > 1 && $id == 0) ? $number . ':' . ($number + count($p->goodsList) - 1) : '';
                $list[$p->state_show][] = [
                    'identification' => ' ' . $p->identification,
                    'type' => $p->type,
                    'state' => $p->state_show,
                    'total' => $p->total,
                    'name' => $g->name,
                    'good_type' => $g->good->type,
                    'price' => $g->price,
                    'number' => $g->number,
                    'carriage' => $p->carriage ? $p->carriage : __('good_indent.freight_free'),
                    'good_location_name' => $p->GoodLocation ? $p->GoodLocation->name : __('common.nothing'),
                    'cellphone' => $p->GoodLocation ? $p->cellphone : __('common.nothing'),
                    'good_location.location' => $p->GoodLocation ? $p->GoodLocation->location : __('common.nothing'),
                    'dhl' => $p->Dhl ? $p->Dhl->name : __('common.nothing'),
                    'odd' => ' ' . $p->odd,
                    'remark' => $p->remark,
                    'created_at' => $p->created_at
                ];
            }
        }
        Excel::store(new IndentExport($list, $config, $title), "public/" . $name);
        return resReturn(1, request()->root() . '/storage/' . $name);
    }
}
