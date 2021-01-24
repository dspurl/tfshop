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
        return (new Plugin())->autoPlugin($name);
    }

    /**
     * 插件更新
     * @param $name
     * @return string
     */
    public function update($name)
    {
        return (new Plugin())->autoPlugin($name);
    }

    /**
     * 插件卸载
     * @param $name
     * @return string
     */
    public function destroy($name)
    {
        return (new Plugin())->autoUninstall($name);
    }
}
