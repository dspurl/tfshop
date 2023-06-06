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
namespace App\Observers\GoodIndent;


use App\Models\v1\GoodIndent;
use App\Models\v1\GoodLocation;
use Illuminate\Http\Request;

/**
 * create indent location
 * 创建订单用户收货地址
 * Class CreateIndentLocationObserver
 * @package App\Observers\GoodIndent
 */
class CreateIndentLocationObserver
{
    protected $request;

    protected $route = [
        'app/goodIndent',
    ];
    protected $execute = false;

    public function __construct(Request $request)
    {
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
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_PAY && array_key_exists('cellphone', $this->request->address)) {
            $GoodLocation = new GoodLocation();
            $GoodLocation->good_indent_id = $goodIndent->id;
            $GoodLocation->cellphone = $this->request->address['cellphone'];
            $GoodLocation->name = $this->request->address['name'];
            $GoodLocation->location = $this->request->address['location'];
            $GoodLocation->address = $this->request->address['address'];
            $GoodLocation->latitude = $this->request->address['latitude'];
            $GoodLocation->longitude = $this->request->address['longitude'];
            $GoodLocation->house = $this->request->address['house'];
            $GoodLocation->save();
        }
    }
}
