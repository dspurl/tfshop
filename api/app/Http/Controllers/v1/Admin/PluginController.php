<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\common\Plugin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 *  plugin
 * 插件管理
 * Class PluginController
 * @package App\Http\Controllers\v1\Admin
 */
class PluginController extends Controller
{
    /**
     * PlugInList
     * 插件列表
     * @return \Illuminate\Http\Response
     */
    public function list()
    {
        $Plugin = new Plugin();
        $Json = $Plugin->getLocalPlugin();
        return resReturn(1, $Json);
    }

    /**
     * PlugInInstall
     * 插件安装/更新
     * @param $name
     * @return string
     * @queryParam  name string 插件简称
     */
    public function create($name)
    {
        return (new Plugin())->autoPlugin($name);
    }

    /**
     * PlugInDelete
     * 插件卸载
     * @param $name
     * @return string
     * @queryParam  name string 插件简称
     */
    public function destroy($name)
    {
        return (new Plugin())->autoUninstall($name);
    }
}
