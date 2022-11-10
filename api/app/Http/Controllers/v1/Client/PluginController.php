<?php

namespace App\Http\Controllers\v1\Client;

use App\Code;
use App\common\Plugin;
use App\Http\Controllers\Controller;

/**
 * @group [CLIENT]Plugin(插件)
 * Class CollectController
 * @package App\Http\Controllers\v1\Client
 */
class PluginController extends Controller
{
    /**
     * VerifyThatThePlugInIsInstalled
     * 验证插件是否安装
     * @param $name // 插件名称
     * @return string
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function verify($name){
        if(!$name){
            return resReturn(0, '插件名称有误', Code::CODE_MISUSE);
        }
        return resReturn(1, (new Plugin())->hasAll($name));
    }
}
