<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\common\Plugin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
        return resReturn(0,'演示不支持该操作',Code::CODE_NO_ACCESS);
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
        return resReturn(0,'演示不支持该操作',Code::CODE_NO_ACCESS);
        $Plugin=new Plugin();
        return $Plugin->autoPlugin($name);
    }
}
