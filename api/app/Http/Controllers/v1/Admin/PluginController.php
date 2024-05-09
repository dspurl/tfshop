<?php
/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\common\Plugin;
use App\Models\v1\AuthRule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @group [ADMIN]Plugin(插件管理)
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
     * @return string
     * @throws \Exception
     */
    public function list(Request $request)
    {
        $Plugin = new Plugin();
//        if ($request->activeIndex == 1) {
//            $Json = $Plugin->getLocalPlugin($request);
//        } else {
//            $Json = $Plugin->getOnLinePlugin();
//        }
        if (!config('tfshop.marketApplicationSecret') || !config('tfshop.marketApplySecret')) {
            return resReturn(0, '您还没有正确配置开发者密钥', Code::CODE_WRONG);
        }
        $Json = $Plugin->getLocalPlugin($request);
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
        return resReturn(1, (new Plugin())->autoPlugin($name, true));
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
        return resReturn(1, (new Plugin())->autoUninstall($name, true));
    }

    /**
     * GetsAListOfAllRoutes
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
     * GetAllModels
     * 获取所有模型
     */
    public function models()
    {
        return resReturn(1, (new Plugin())->models());
    }

    /**
     * GetAllTemplates
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
     * GetAllJurisdiction
     * 获取所有权限
     * @param Request $request
     * @return string
     */
    public function jurisdiction(Request $request)
    {
        return resReturn(1, (new Plugin())->jurisdiction($request->input('packagingJurisdiction', [])));
    }

    /**
     * GetAllDiff
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
     * GetInstallPluginList
     * 获取安装的插件列表
     * @return string
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function installPluginList()
    {
        return resReturn(1, (new Plugin())->installList());
    }

    /**
     * conflictResolution
     * 冲突处理
     * @param $name // 插件标识
     * @param Request $request
     * @return string
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     * @throws \Exception
     */
    public function conflictResolution($name, Request $request)
    {
        if (!$request->has('index')) {
            throw new \Exception(__('common.arguments'), Code::CODE_WRONG);
        }
        return resReturn(1, (new Plugin())->conflictResolution($name, $request));
    }

    /**
     * VerifyThatThePlugInIsInstalled
     * 验证插件是否安装
     * @param $name // 插件名称
     * @return string
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function verify($name)
    {
        if (!$name) {
            return resReturn(0, '插件名称有误', Code::CODE_MISUSE);
        }
        return resReturn(1, (new Plugin())->hasAll($name));
    }
}
