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

    function __construct()
    {
        if (env('APP_ENV') != 'local') {
            return resReturn(0, '插件仅本地环境可以使用', Code::CODE_FORBIDDEN);
        }
    }

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
     * PlugInCreate
     * 创建插件
     * @param Request $request
     * @return string
     * @throws \Exception
     */
    public function create(Request $request)
    {
        $Json = (new Plugin())->create($request);
        return resReturn(1, $Json);
    }

    /**
     * PlugInDetails
     * 插件详情
     * @param $name
     * @return string
     */
    public function details($name)
    {
        $Json = (new Plugin())->details($name);
        return resReturn(1, $Json);
    }

    /**
     * PlugInEdit
     * 插件编辑
     * @param Request $request
     * @return string
     * @throws \Exception
     */
    public function edit(Request $request)
    {
        $Json = (new Plugin())->edit($request);
        return resReturn(1, $Json);
    }

    /**
     * PlugInInstall
     * 插件安装/更新
     * @param $name
     * @return string
     * @queryParam  name string 插件简称
     */
    public function install($name)
    {
        return (new Plugin())->autoPlugin($name);
    }

    /**
     * PlugInDelete
     * 插件删除
     * @param $name
     * @return string
     * @queryParam  name string 插件简称
     */
    public function destroy($name)
    {
        return (new Plugin())->destroy($name);
    }

    /**
     * PlugInUninstall
     * 插件卸载
     * @param $name
     * @return string
     * @queryParam  name string 插件简称
     */
    public function uninstall($name)
    {
        return (new Plugin())->autoUninstall($name);
    }

    /**
     * 获取所有路由列表
     * @param $type // 类型：all为全部，no_get为除get请求外
     * @return string
     */
    public function routes($type)
    {
        $app = app();
        $routes = $app->routes->getRoutes();
        $path = [];
        foreach ($routes as $k => $value) {
            if (array_key_exists('prefix', $value->action)) {
                if ($value->action['prefix'] && !in_array($value->action['prefix'], ['oauth'])) {
                    if($type == 'no_get'){
                        if($value->methods[0] != 'GET'){
                            $path[$k] = [
                                'uri' => $value->uri,
                                'path' => $value->methods[0],
                                'name' => explode('@', $value->action['controller'])[1],
                                'explain' => __('route.' . $value->action['as']),
                            ];
                        }
                    }else{
                        $path[$k] = [
                            'uri' => $value->uri,
                            'path' => $value->methods[0],
                            'name' => explode('@', $value->action['controller'])[1],
                            'explain' => __('route.' . $value->action['as']),
                        ];
                    }
                }
            }
        }
        return resReturn(1, collect($path)->values());
    }

    /**
     * 获取所有模型
     */
    public function models()
    {
        return resReturn(1, (new Plugin())->models());
    }

    /**
     * 获取所有模板
     */
    public function template()
    {
        return resReturn(1, (new Plugin())->template());
    }
}
