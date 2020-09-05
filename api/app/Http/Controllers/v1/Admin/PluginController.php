<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\common\Plugin;
use App\Models\v1\Dhl;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodIndentCommodity;
use App\Models\v1\MoneyLog;
use App\Models\v1\User;
use App\Models\v1\UserCoupon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use EasyWeChat\Factory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use App\common\RedisLock;

class PluginController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $Plugin=new Plugin();
        $Json=$Plugin->getLocalPlugin();
        return resReturn(1,$Json);
    }

    /**
     * 插件安装
     * @param $name
     * @return string
     */
    public function update($name){
        $Plugin=new Plugin();
        $autoPlugin=$Plugin->autoPlugin($name);
        return resReturn(1,$autoPlugin);
    }
}
