<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\common\Plugin;
use App\Models\v1\AuthRule;
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
        try {
            (new Plugin())->verifyDirectoryStructure();
        } catch (\Exception $e) {
        }
    }

    /**
     * PlugInList
     * 插件列表
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function list(Request $request)
    {
        $Plugin = new Plugin();
        if ($request->activeIndex == 1) {
            $Json = $Plugin->getLocalPlugin($request);
        } else {
            $Json = $Plugin->getOnLinePlugin();
        }
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
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function details($name)
    {
        return resReturn(1, (new Plugin())->details($name));
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
     * @throws \Exception
     * @queryParam  name string 插件简称
     */
    public function install($name)
    {
        return resReturn(1, (new Plugin())->autoPlugin($name));
    }

    /**
     * PlugInPublish
     * 发行
     * @param $name
     * @return string
     * @throws \Exception
     */
    public function publish($name)
    {
        return resReturn(1, (new Plugin())->publish($name));
    }

    /**
     * PlugInDelete
     * 插件删除
     * @param $name
     * @return string
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     * @queryParam  name string 插件简称
     */
    public function destroy($name)
    {
        return resReturn(1, (new Plugin())->destroy($name));
    }

    /**
     * PlugInUninstall
     * 插件卸载
     * @param $name
     * @return string
     * @throws \Exception
     * @queryParam  name string 插件简称
     */
    public function uninstall($name)
    {
        return resReturn(1, (new Plugin())->autoUninstall($name));
    }

    /**
     * Gets a list of all routes
     * 获取所有路由列表
     * @param $type // 类型：all为全部，no_get为除get请求外
     * @return string
     * @throws \Exception
     */
    public function routes($type)
    {
        $app = app();
        $routes = $app->routes->getRoutes();
        $path = [];
        foreach ($routes as $k => $value) {
            if (array_key_exists('prefix', $value->action)) {
                if ($value->action['prefix'] && !in_array($value->action['prefix'], ['oauth'])) {
                    if ($type == 'no_get') {
                        if (count($value->methods) != 1 || $value->methods[0] != 'GET') {
                            if (!array_key_exists('as', $value->action)) {
                                throw new \Exception('请配置修改后的路由语言包', Code::CODE_PARAMETER_WRONG);
                            }
                            $path[$k] = [
                                'uri' => $value->uri,
                                'path' => implode(",", $value->methods),
                                'name' => explode('@', $value->action['controller'])[1],
                                'explain' => __('route.' . $value->action['as']),
                            ];
                        }
                    } else {
                        $path[$k] = [
                            'uri' => $value->uri,
                            'path' => implode(",", $value->methods),
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
     * PlugInDownload
     * 下载插件
     * @param $name
     * @return string
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function download($name)
    {
        return (new Plugin())->download($name);
    }

    /**
     * PlugInUpdatePack
     * 在线下载/更新
     * @param $code
     * @param Request $request
     * @return string
     * @throws \Exception
     */
    public function updatePack($code, Request $request)
    {
        return (new Plugin())->updatePack($code, $request);
    }

    /**
     * Get all models
     * 获取所有模型
     */
    public function models()
    {
        return resReturn(1, (new Plugin())->models());
    }

    /**
     * Get all templates
     * 获取所有模板
     * @param $name //client or admin
     * @return string
     * @throws \Exception
     */
    public function template($name)
    {
        return resReturn(1, (new Plugin())->template($name));
    }

    /**
     * Get all jurisdiction
     * 获取所有权限
     * @param Request $request
     * @return string
     */
    public function jurisdiction(Request $request)
    {
        return resReturn(1, (new Plugin())->jurisdiction($request->input('packagingJurisdiction', [])));
    }

    /**
     * Get all diff
     * 获取冲突文件列表
     * @param $name // 插件标识
     * @return string
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function diff($name)
    {
        return resReturn(1, (new Plugin())->diff($name));
    }

    /**
     * Get install plugin list
     * 获取安装的插件列表
     * @return string
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function installPluginList()
    {
        return resReturn(1, (new Plugin())->installList());
    }

    /**
     * conflict resolution
     * 冲突处理
     * @param $name // 插件标识
     * @param Request $request
     * @return string
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     * @throws \Exception
     */
    public function conflictResolution($name, Request $request)
    {
        if(!$request->has('index')){
            throw new \Exception('参数有误', Code::CODE_WRONG);
        }
        return resReturn(1, (new Plugin())->conflictResolution($name, $request));
    }
}
