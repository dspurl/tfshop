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
use App\common\RedisLock;
use App\common\RedisService;
use App\Http\Requests\v1\SubmitCollectRequest;
use App\Models\v1\Collect;
use App\Models\v1\Good;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

/**
 * @group [CLIENT]Collect(收藏)
 * Class CollectController
 * @package App\Http\Controllers\v1\Client
 */
class CollectController extends Controller
{
    /**
     * CollectList
     * 收藏列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     */
    public function list(Request $request)
    {
        $q = Collect::query();
        Good::$withoutAppends = false;
        $q->where('user_id', auth('web')->user()->id);
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $paginate = $q->with(['Good' => function ($q) {
            $q->select('id', 'order_price', 'name')->with(['resources']);
        }])->paginate($limit);
        return resReturn(1, $paginate);
    }

    /**
     * CollectCreate
     * 创建收藏
     * @param SubmitCollectRequest $request
     * @return \Illuminate\Http\Response
     * @queryParam  good_id int 商品ID
     */
    public function create(SubmitCollectRequest $request)
    {
        $redis = new RedisService();
        $lock = RedisLock::lock($redis, 'collect');
        if ($lock) {
            $return = DB::transaction(function () use ($request) {
                $Collect = new Collect();
                $Collect->user_id = auth('web')->user()->id;
                $Collect->good_id = $request->id;
                $Collect->save();
                return 1;
            }, 5);
            RedisLock::unlock($redis, 'collect');
            if ($return == 1) {
                return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.add')]));
            } else {
                return resReturn(0, $return[0], $return[1]);
            }
        } else {
            return resReturn(0, __('common.busy'), Code::CODE_SYSTEM_BUSY);
        }
    }

    /**
     * CollectDetail
     * 收藏详情
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 商品ID
     */
    public function detail($id)
    {
        $Collect = Collect::where('user_id', auth('web')->user()->id)->where('good_id', $id)->count();
        return resReturn(1, $Collect);
    }

    /**
     * CollectDestroy
     * 删除收藏
     * @param int $id
     * @return \Illuminate\Http\Response
     * @queryParam  id int 商品ID
     */
    public function destroy($id)
    {
        if (!$id) {
            return resReturn(0, __('common.arguments'), Code::CODE_MISUSE);
        }
        $redis = new RedisService();
        $lock = RedisLock::lock($redis, 'browse');
        if ($lock) {
            Collect::where('user_id', auth('web')->user()->id)->where('good_id', $id)->delete();
            return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
        } else {
            return resReturn(0, __('common.busy'), Code::CODE_SYSTEM_BUSY);
        }
    }
}
