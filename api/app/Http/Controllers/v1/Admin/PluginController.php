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
        $Plugin = new Plugin();
        $Json = $Plugin->getLocalPlugin();
        return resReturn(1, $Json);
    }

    /**
     * 插件安装
     * @param $name
     * @return string
     */
    public function install($name)
    {
        $Plugin = new Plugin();
        return $Plugin->autoPlugin($name);
    }

    /**
     * 插件创建
     * @param Request $request
     * @return string
     */
    public function store(Request $request)
    {
        $getDswjcmsJson = collect((new Plugin())->getDswjcmsJson())->pluck('name')->all();
        if (in_array($request->identify, $getDswjcmsJson)) {
            return resReturn(0, '插件标识已存在，无法创建', Code::CODE_PARAMETER_WRONG);
        }

    }

    /**
     * 插件更新
     * @return string
     */
    public function update()
    {

    }
}
