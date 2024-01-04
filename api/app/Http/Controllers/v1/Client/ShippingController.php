<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */

namespace App\Http\Controllers\v1\Client;

use App\Code;
use App\common\RedisService;
use App\Http\Requests\v1\SubmitShippingRequest;
use App\Models\v1\Freight;
use App\Models\v1\FreightWay;
use App\Models\v1\Good;
use App\Models\v1\Region;
use App\Models\v1\Shipping;
use App\common\RedisLock;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

/**
 * @group [CLIENT]Shipping(收货地址)
 * Class ShippingController
 * @package App\Http\Controllers\v1\Client
 */
class ShippingController extends Controller
{
    /**
     * ShippingList
     * 收货地址列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = Shipping::query();
        $limit = $request->limit;
        $q->where('user_id', auth('web')->user()->id);
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $q->where('lang', App::getLocale());
        $paginate = $q->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * ShippingCreate
     * 创建收货地址
     * @param SubmitShippingRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  cellphone int 手机号
     * @queryParam  defaults int 是否默认
     * @queryParam  name string 姓名
     * @queryParam  location string 地址
     * @queryParam  address string 详情地址
     * @queryParam  latitude string 纬度
     * @queryParam  longitude string 经度
     * @queryParam  house string 门牌号
     */
    public function create(SubmitShippingRequest $request)
    {
        $redis = new RedisService();
        $lock = RedisLock::lock($redis, 'shipping');
        if ($lock) {
            $return = DB::transaction(function () use ($request) {
                $count = Shipping::where('user_id', auth('web')->user()->id)->count();
                $Shipping = new Shipping();
                $Shipping->user_id = auth('web')->user()->id;
                $Shipping->cellphone = $request->cellphone;
                $Shipping->defaults = $count > 0 ? Shipping::SHIPPING_DEFAULTS_NO : Shipping::SHIPPING_DEFAULTS_YES;
                $Shipping->name = $request->name;
                $Shipping->location = $request->location;
                $Shipping->address = $request->address ? $request->address : '';
                $Shipping->latitude = $request->latitude;
                $Shipping->longitude = $request->longitude;
                $Shipping->house = $request->house;
                $Shipping->save();
                return [1, $Shipping];
            }, 5);
            RedisLock::unlock($redis, 'shipping');
            if ($return[0] == 1) {
                return resReturn(1, $return[1]);
            } else {
                return resReturn(0, $return[0], $return[1]);
            }
        } else {
            return resReturn(0, __('common.busy'), Code::CODE_SYSTEM_BUSY);
        }
    }

    /**
     * ShippingEdit
     * 保存收货地址
     * @param SubmitShippingRequest $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 收货地址ID
     * @queryParam  cellphone int 手机号
     * @queryParam  defaults int 是否默认
     * @queryParam  name string 姓名
     * @queryParam  location string 地址
     * @queryParam  address string 详情地址
     * @queryParam  latitude string 纬度
     * @queryParam  longitude string 经度
     * @queryParam  house string 门牌号
     */
    public function edit(SubmitShippingRequest $request, $id)
    {
        $redis = new RedisService();
        $lock = RedisLock::lock($redis, 'shipping');
        if ($lock) {
            $return = DB::transaction(function () use ($request, $id) {
                $Shipping = Shipping::find($id);
                $Shipping->cellphone = $request->cellphone;
                $Shipping->name = $request->name;
                $Shipping->location = $request->location;
                $Shipping->address = $request->address ? $request->address : '';
                $Shipping->latitude = $request->latitude;
                $Shipping->longitude = $request->longitude;
                $Shipping->house = $request->house;
                $Shipping->save();
                return [1, Shipping::find($id)];
            }, 5);
            RedisLock::unlock($redis, 'shipping');
            if ($return[0] == 1) {
                return resReturn(1, $return[1]);
            } else {
                return resReturn(0, $return[0], $return[1]);
            }
        } else {
            return resReturn(0, __('common.busy'), Code::CODE_SYSTEM_BUSY);
        }
    }

    /**
     * ShippingDestroy
     * 删除收货地址
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 收货地址ID
     */
    public function destroy($id)
    {
        $redis = new RedisService();
        $lock = RedisLock::lock($redis, 'shipping');
        if ($lock) {
            Shipping::where('id', $id)->delete();
            return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
        } else {
            return resReturn(0, __('common.busy'), Code::CODE_SYSTEM_BUSY);
        }
    }

    /**
     * ShippingFreight
     * 获取运费
     * @param Request $request
     * @param int $id //用户收货地址ID，没有则取默认收货地址ID
     * @return string
     */
    public function freight($id, Request $request)
    {
        if ($id) {
            $return['shipping'] = Shipping::find($id);
        } else {
            $return['shipping'] = Shipping::where('defaults', Shipping::SHIPPING_DEFAULTS_YES)->where('user_id', auth('web')->user()->id)->first();
        }

        if ($return['shipping']) {
            if (count(explode("省", $return['shipping']['address'])) > 1) {
                $name = explode("省", $return['shipping']['address'])[0] . '省';
            } else if (count(explode("自治区", $return['shipping']['address'])) > 1) {
                $name = explode("自治区", $return['shipping']['address'])[0] . '自治区';
            } else {
                $name = explode("市", $return['shipping']['address'])[0] . '市';
            }
            $Region = Region::where('lang', App::getLocale())->where('parent_id', 0)->with(['child'])->first();
            $value = '';
            if ($Region->child) {
                foreach ($Region->child as $child) {
                    if ($child->name == $name) {
                        $value = $child->id;
                        break;
                    }
                }
            }
            $carriage = 0;
            $list = [];
            foreach ($request->all() as $all) {
                if ($all['freight_id']) {
                    // 运费模板
                    if (array_key_exists($all['freight_id'], $list)) {
                        $list[$all['freight_id']] += $all['number'];
                    } else {
                        $list[$all['freight_id']] = $all['number'];
                    }
                }else{
                    // 固定运费
                    $Good = Good::find($all['good_id']);
                    $carriage += $Good->freight;
                }
            }
            if ($value) {
                foreach ($list as $index => $l) {
                    Freight::$withoutAppends = false;
                    FreightWay::$withoutAppends = false;
                    $Freight = Freight::with(['FreightWay'])->find($index);
                    if ($Freight) {
                        if (!in_array($value, $Freight['pinkage'])) { //不包邮
                            foreach ($Freight['FreightWay'] as $way) {
                                if (in_array($value, $way->location)) { //获取不包邮实际运费
                                    if ($l == 1) { //只有一件
                                        $carriage += $way->first_cost;
                                    } else {
                                        if ($l <= $way->first_piece) {    //未超过首件
                                            $carriage += $way->first_cost;
                                        } else {
                                            $number = ceil(($l - $way->first_piece) / $way->add_piece);
                                            $carriage += $way->first_cost + $way->add_cost * $number;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            $return['carriage'] = $carriage;
        }
        return resReturn(1, $return);
    }

    /**
     * ShippingDefaultSet
     * 设为默认
     * @param Request $request
     * @return string
     */
    public function defaultSet(Request $request)
    {
        $return = DB::transaction(function () use ($request) {
            Shipping::where('user_id', auth('web')->user()->id)->update(['defaults' => Shipping::SHIPPING_DEFAULTS_NO]);
            Shipping::where('id', $request->id)->update(['defaults' => Shipping::SHIPPING_DEFAULTS_YES]);
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, __('common.succeed'));
        } else {
            return resReturn(0, $return[0], $return[1]);
        }
    }
}
