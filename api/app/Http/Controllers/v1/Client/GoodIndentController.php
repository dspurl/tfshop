<?php

namespace App\Http\Controllers\v1\Client;

use App\Code;
use App\common\RedisService;
use App\Http\Requests\v1\SubmitGoodIndentRequest;
use App\Models\v1\Good;
use App\Models\v1\User;
use App\common\RedisLock;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodIndentCommodity;
use App\Models\v1\GoodSku;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * GoodIndent
 * 商品订单
 * Class GoodIndentController
 * @package App\Http\Controllers\v1\Client
 */
class GoodIndentController extends Controller
{
    /**
     * GoodIndentList
     * 商品订单列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        GoodIndent::$withoutAppends = false;
        GoodIndentCommodity::$withoutAppends = false;
        $q = GoodIndent::query();
        $q->where('user_id', auth('web')->user()->id);
        if (intval($request->index) !== 0) {
            $q->where('state', $request->index);
        }
        if ($request->search == 1) {
            $q->where('created_at', '>=', date("Y-m-d 00:00:00", strtotime($request->startTime)))->where('created_at', '<=', date("Y-m-d 23:59:59", strtotime($request->endTime)));
        }
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $paginate = $q->with(['goodsList' => function ($q) {
            $q->with(['goodSku']);
        }])->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * GoodIndentList
     * 创建商品订单
     * @param SubmitGoodIndentRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  carriage int 运费
     * @queryParam  indentCommodity array 订单商品
     * @queryParam  remark string 备注
     * @queryParam  address array 收货地址
     */
    public function create(SubmitGoodIndentRequest $request)
    {
        $redis = new RedisService();
        $lock = RedisLock::lock($redis, 'goodIndent');
        if ($lock) {
            $return = DB::transaction(function () use ($request) {
                $GoodIndent = new GoodIndent();
                $GoodIndent->user_id = auth('web')->user()->id;
                $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_PAY;
                $GoodIndent->carriage = $request->carriage;
                $total = 0;
                foreach ($request->indentCommodity as $indentCommodity) {
                    $Good = Good::select('id', 'is_inventory', 'inventory')->find($indentCommodity['good_id']);
                    if ($Good && $Good->is_inventory == Good::GOOD_IS_INVENTORY_NO) { //拍下减库存
                        if (!$indentCommodity['good_sku_id']) { //非SKU商品
                            if ($Good->inventory - $indentCommodity['number'] < 0) {
                                return array('存在库存不足的商品，请重新获取购物车', Code::CODE_PARAMETER_WRONG);
                            }
                            $Good->inventory = $Good->inventory - $indentCommodity['number'];
                            $Good->save();
                        } else {
                            $GoodSku = GoodSku::find($indentCommodity['good_sku_id']);
                            if ($GoodSku->inventory - $indentCommodity['number'] < 0) {
                                return array('存在库存不足的SKU商品，请重新获取购物车', Code::CODE_PARAMETER_WRONG);
                            }
                            $GoodSku->inventory = $GoodSku->inventory - $indentCommodity['number'];
                            $GoodSku->save();
                        }
                    }
                    $total += $indentCommodity['number'] * $indentCommodity['price'];
                }
                $GoodIndent->identification = orderNumber();
                $GoodIndent->total = $total + $request->carriage;
                $GoodIndent->remark = $request->remark;
                $GoodIndent->save();
                return array(1, $GoodIndent->id);
            }, 5);
            RedisLock::unlock($redis, 'goodIndent');
            if ($return[0] == 1) {
                return resReturn(1, $return[1]);
            } else {
                return resReturn(0, $return[0], $return[1]);
            }
        } else {
            return resReturn(0, '业务繁忙，请稍后再试', Code::CODE_SYSTEM_BUSY);
        }
    }

    /**
     * SynchronizationInventory
     * 同步线上商品库存
     * @param Request $request
     * @return string
     */
    public function synchronizationInventory(Request $request)
    {
        $return = $request->all();
        foreach ($request->all() as $id => $all) {
            if ($all['good_sku_id']) { //sku商品
                $GoodSku = GoodSku::find($all['good_sku_id']);
                if ($GoodSku->deleted_at) {
                    $return[$id]['invalid'] = true;  //标记为失效
                } else {
                    if ($GoodSku->inventory < $all['number']) { //库存不足时
                        $return[$id]['invalid'] = true;  //标记为失效
                    } else {
                        $return[$id]['invalid'] = false;
                    }
                }
            } else {
                $Good = Good::find($all['good_id']);
                if ($Good->deleted_at) {
                    $return[$id]['invalid'] = true;  //标记为失效
                } else {
                    if ($Good->inventory < $all['number']) {
                        $return[$id]['invalid'] = true;  //标记为失效
                    } else {
                        $return[$id]['invalid'] = false;
                    }
                }
            }
        }
        return resReturn(1, $return);
    }

    /**
     * GoodIndentDetail
     * 商品订单详情
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 订单ID
     */
    public function detail($id)
    {
        GoodIndentCommodity::$withoutAppends = false;
        GoodSku::$withoutAppends = false;
        GoodIndent::$withoutAppends = false;
        $GoodIndent = GoodIndent::with(['goodsList' => function ($q) {
            $q->with(['good' => function ($q) {
                $q->with(['resourcesMany', 'goodSku' => function ($q) {
                    $q->with('resources')->where('inventory', '>', 0);
                }]);
            }, 'goodSku']);
        }, 'GoodLocation'])->find($id);
        return resReturn(1, $GoodIndent);
    }

    /**
     * GoodIndentPay
     * 订单支付详情
     * @param $id
     * @return string
     * @queryParam  id int 订单ID
     */
    public function pay($id)
    {
        GoodIndentCommodity::$withoutAppends = false;
        GoodIndent::$withoutAppends = false;
        User::$withoutAppends = false;
        $GoodIndent = GoodIndent::with(['goodsList' => function ($q) {
            $q->select('good_id', 'good_indent_id')->with(['good' => function ($q) {
                $q->select('name', 'id');
            }]);
        }, 'User' => function ($q) {
            $q->select('id', 'money');
        }])->select('id', 'total', 'user_id', 'state')->find($id);
        return resReturn(1, $GoodIndent);
    }

    /**
     * GoodIndentReceipt
     * 确认收货
     * @param $id
     * @return string
     * @queryParam  id int 订单ID
     */
    public function receipt($id)
    {
        $return = DB::transaction(function () use ($id) {
            $GoodIndent = GoodIndent::with(['goodsList'])->find($id);
            $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH;
            $GoodIndent->confirm_time = Carbon::now()->toDateTimeString();
            $GoodIndent->save();
            return array(1, '收货成功');
        });
        if ($return[0] == 1) {
            return resReturn(1, $return[1]);
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }

    /**
     * GoodIndentCancel
     * 取消订单
     * @param $id
     * @return string
     */
    public function cancel($id)
    {
        $GoodIndent = GoodIndent::with(['goodsList'])->find($id);
        $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_CANCEL;
        $GoodIndent->save();
        return resReturn(1, '成功');
    }

    /**
     * GoodIndentDestroy
     * 删除订单
     * @param $id
     * @return string
     */
    public function destroy($id)
    {
        GoodIndent::destroy($id);
        return resReturn(1, '删除成功');
    }

    /**
     * GoodIndentQuantity
     * 订单数量统计
     * @return string
     */
    public function quantity()
    {
        $GoodIndent = GoodIndent::where('user_id', auth('web')->user()->id)->get();
        $return = [
            'all' => 0, //全部订单
            'obligation' => 0, //待付款
            'waitdeliver' => 0, //待发货
            'waitforreceiving' => 0, //待收货
        ];
        if ($GoodIndent) {
            foreach ($GoodIndent as $indent) {
                if ($indent->deleted_at == null) {
                    $return['all'] += 1;
                    if ($indent->state == GoodIndent::GOOD_INDENT_STATE_PAY) {
                        $return['obligation'] += 1;
                    } else if ($indent->state == GoodIndent::GOOD_INDENT_STATE_DELIVER) {
                        $return['waitdeliver'] += 1;
                    } else if ($indent->state == GoodIndent::GOOD_INDENT_STATE_TAKE) {
                        $return['waitforreceiving'] += 1;
                    }
                }
            }
        }
        return resReturn(1, $return);
    }
}
