<?php

namespace App\common;

use App\Code;

class Plugin
{
    private $pluginPath;
    private $path;

    function __construct()
    {
        $file_path = explode("/", base_path());
        unset($file_path[count($file_path) - 1]);
        $this->path = implode("/", $file_path);
        $this->pluginPath = implode("/", $file_path) . '/plugin';
    }

    /**
     * 获取dswjcms.json
     */
    public function getDswjcmsJson()
    {
        $json_dswjcms = file_get_contents($this->pluginPath . '/dswjcms.json');
        return json_decode($json_dswjcms, true);
    }

    /**
     * 获取本地插件列表
     */
    public function getLocalPlugin()
    {
        $data = scandir($this->pluginPath);
        $list = [];
        $json_dswjcms = json_decode(file_get_contents($this->pluginPath . '/dswjcms.json'), true);
        foreach ($data as $value) {
            if ($value != '.' && $value != '..' && $value != 'dswjcms.json') {
                $dswjcms = json_decode(file_get_contents($this->pluginPath . '/' . $value . '/dswjcms.json'), true);
                foreach ($json_dswjcms as $js) {
                    if ($js['name'] == $dswjcms['abbreviation']) {
                        $dswjcms['locality_versions'] = $js['versions'];
                        $dswjcms['is_delete'] = $js['is_delete'];
                    }
                }
                $list[] = $dswjcms;
            }
        }
        return $list;
    }

    /**
     * 安装和更新插件
     * @param $name //插件简称
     * @return string
     */
    public function autoPlugin($name)
    {
        $routes = $this->pluginPath . '/' . $name . '/routes.json';
        $dswjcms = $this->pluginPath . '/' . $name . '/dswjcms.json';
        if (!file_exists($routes)) {
            return resReturn(0, '插件缺少routes.json文件', Code::CODE_WRONG);
        }
        if (!file_exists($dswjcms)) {
            return resReturn(0, '插件缺少dswjcms.json文件', Code::CODE_WRONG);
        }
        $dswjcms = json_decode(file_get_contents($dswjcms), true);
        // 文件自动部署
        $this->fileDeployment($this->pluginPath . '/' . $name . '/admin/api', $this->path . '/admin/src/api');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/admin/views/' . ucwords($name), $this->path . '/admin/src/views/Tool/' . ucwords($name));
        $this->fileDeployment($this->pluginPath . '/' . $name . '/api/config', $this->path . '/api/config');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/api/console', $this->path . '/api/app/Console/Commands');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/api/models', $this->path . '/api/app/Models/v'.config('dswjcms.versions'));
        $this->fileDeployment($this->pluginPath . '/' . $name . '/api/plugin', $this->path . '/api/app/Http/Controllers/v'.config('dswjcms.versions').'/Plugin');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/api/requests', $this->path . '/api/app/Http/Requests/v'.config('dswjcms.versions'));
        $this->fileDeployment($this->pluginPath . '/' . $name . '/database', $this->path . '/api/database/migrations');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/uniApp/api', $this->path . '/trade/Dsshop/api');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/uniApp/components', $this->path . '/trade/Dsshop/components');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/uniApp/pages', $this->path . '/trade/Dsshop/pages');
        // 路由自动部署
        $routes = json_decode(file_get_contents($routes), true);
        // api
        if (array_key_exists('admin', $routes) || array_key_exists('app', $routes) || array_key_exists('notValidatedApp', $routes)) {
            $targetPath = $this->path . '/api/routes/api.php';
            $file_get_contents = file_get_contents($targetPath);
            //去除已存在的插件代码
            $file_get_contents = preg_replace('/\/\/' . $dswjcms['name'] . '_s(.*?)\/\/' . $dswjcms['name'] . '_e/is', '', $file_get_contents);
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            // 添加新的插件代码
            if (array_key_exists('admin', $routes)) {
                $file_get_contents = str_replace("前台插件列表", $dswjcms['name'] . "_s
        " . $routes['admin'] . "
        //" . $dswjcms['name'] . "_e
        //前台插件列表", $file_get_contents);
            }

            if (array_key_exists('notValidatedApp', $routes)) {
                $file_get_contents = str_replace("APP无需验证插件列表", $dswjcms['name'] . "_s
        " . $routes['notValidatedApp'] . "
        //" . $dswjcms['name'] . "_e
        //APP无需验证插件列表", $file_get_contents);
            }

            if (array_key_exists('app', $routes)) {
                $file_get_contents = str_replace("APP验证插件列表", $dswjcms['name'] . "_s
        " . $routes['app'] . "
        //" . $dswjcms['name'] . "_e
        //APP验证插件列表", $file_get_contents);
            }
            file_put_contents($targetPath, $file_get_contents);
            unset($targetPath);
            unset($file_get_contents);
            unset($metadata);
        }
        // permission
        if (array_key_exists('permission', $routes)) {
            $targetPath = $this->path . '/admin/src/store/modules/permission.js';
            $file_get_contents = file_get_contents($targetPath);
            //去除已存在的插件代码
            $file_get_contents = preg_replace('/\/\/ ' . $dswjcms['name'] . '_s(.*?)\/\/ ' . $dswjcms['name'] . '_e/is', '', $file_get_contents);
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            // 添加新的插件代码
            $metadata = str_replace("插件列表", $dswjcms['name'] . "_s
  " . $routes['permission'] . "
  // " . $dswjcms['name'] . "_e
  // 插件列表", $file_get_contents);
            $file_put_contents = file_put_contents($targetPath, $metadata);
            unset($targetPath);
            unset($file_get_contents);
            unset($metadata);
        }
        // uni-app
        if (array_key_exists('uniApp', $routes)) {
            $targetPath = $this->path . '/trade/Dsshop/pages.json';
            $file_get_contents = file_get_contents($targetPath);
            //去除已存在的插件代码
            $file_get_contents = preg_replace('/\/\/ ' . $dswjcms['name'] . '_s(.*?)\/\/ ' . $dswjcms['name'] . '_e/is', '', $file_get_contents);
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            // 添加新的插件代码
            $metadata = str_replace("插件列表", $dswjcms['name'] . "_s
		" . $routes['uniApp'] . "
		// " . $dswjcms['name'] . "_e
		// 插件列表", $file_get_contents);
            $file_put_contents = file_put_contents($targetPath, $metadata);
            unset($targetPath);
            unset($file_get_contents);
            unset($metadata);
        }
        //写入本地插件列表
        $json_dswjcms = json_decode(file_get_contents($this->pluginPath . '/dswjcms.json'), true);
        if (collect($json_dswjcms)->firstWhere('name', $name)) {
            foreach ($json_dswjcms as $id => $js) {
                if ($js['name'] == $dswjcms['abbreviation']) {
                    $json_dswjcms[$id]['versions'] = $dswjcms['versions'];
                    $json_dswjcms[$id]['is_delete'] = 0;
                    $json_dswjcms[$id]['time'] = date('Y-m-d H:i:s');
                }
            }
        } else {
            $json_dswjcms[] = array(
                'name' => $name,
                'versions' => $dswjcms['versions'],
                'is_delete' => 0,
                'time' => date('Y-m-d H:i:s')
            );
        }
        file_put_contents($this->pluginPath . '/dswjcms.json', json_encode($json_dswjcms));
        return resReturn(1, '成功');
    }

    /**
     * 拷贝目录下文件到指定目录下，没有目录则创建
     * @param string $original //原始目录
     * @param string $target //目标目录
     */
    protected function fileDeployment($original, $target)
    {
        if (file_exists($original)) {
            if (!file_exists($target)) {
                mkdir($target, 0777, true);
            }
            $data = scandir($original);
            foreach ($data as $value) {
                if ($value != '.' && $value != '..') {
                    if (is_dir($original . '/' . $value)) { //如果是目录
                        $this->fileDeployment($original . '/' . $value, $target . '/' . $value);
                    } else {
                        copy($original . '/' . $value, $target . '/' . $value);
                    }
                }
            }
        }
    }

    /**
     * 卸载插件
     * @param string $name //组件名称
     * @return string
     */
    public function autoUninstall($name)
    {
        $routes = $this->pluginPath . '/' . $name . '/routes.json';
        $dswjcms = $this->pluginPath . '/' . $name . '/dswjcms.json';
        if (!file_exists($routes)) {
            return resReturn(0, '插件缺少routes.json文件', Code::CODE_WRONG);
        }
        if (!file_exists($dswjcms)) {
            return resReturn(0, '插件缺少dswjcms.json文件', Code::CODE_WRONG);
        }
        $dswjcms = json_decode(file_get_contents($dswjcms), true);
        $json_dswjcms = json_decode(file_get_contents($this->pluginPath . '/dswjcms.json'), true);
        //去除uni-app路由
        $targetPath = $this->path . '/trade/Dsshop/pages.json';
        $file_get_contents = file_get_contents($targetPath);
        $file_get_contents = preg_replace('/\/\/ ' . $dswjcms['name'] . '_s(.*?)\/\/ ' . $dswjcms['name'] . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
        file_put_contents($targetPath, $file_get_contents);
        unset($targetPath);
        unset($file_get_contents);
        //去除API路由
        $targetPath = $this->path . '/api/routes/api.php';
        $file_get_contents = file_get_contents($targetPath);
        //去除已存在的插件代码
        $file_get_contents = preg_replace('/\/\/' . $dswjcms['name'] . '_s(.*?)\/\/' . $dswjcms['name'] . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
        file_put_contents($targetPath, $file_get_contents);
        unset($targetPath);
        unset($file_get_contents);
        //去除后台路由
        $targetPath = $this->path . '/admin/src/store/modules/permission.js';
        $file_get_contents = file_get_contents($targetPath);
        //去除已存在的插件代码
        $file_get_contents = preg_replace('/\/\/ ' . $dswjcms['name'] . '_s(.*?)\/\/ ' . $dswjcms['name'] . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
        file_put_contents($targetPath, $file_get_contents);
        unset($targetPath);
        unset($file_get_contents);
        $this->fileUninstall($this->pluginPath . '/' . $name . '/admin/api', $this->path . '/admin/src/api');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/admin/views/' . ucwords($name), $this->path . '/admin/src/views/Tool/' . ucwords($name));
        $this->fileUninstall($this->pluginPath . '/' . $name . '/api/config', $this->path . '/api/config');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/api/console', $this->path . '/api/app/Console/Commands');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/api/models', $this->path . '/api/app/Models/v'.config('dswjcms.versions'));
        $this->fileUninstall($this->pluginPath . '/' . $name . '/api/plugin', $this->path . '/api/app/Http/Controllers/v'.config('dswjcms.versions').'/Plugin');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/api/requests', $this->path . '/api/app/Http/Requests/v'.config('dswjcms.versions'));
        $this->fileUninstall($this->pluginPath . '/' . $name . '/database', $this->path . '/api/database/migrations');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/uniApp/api', $this->path . '/trade/Dsshop/api');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/uniApp/components', $this->path . '/trade/Dsshop/components');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/uniApp/pages', $this->path . '/trade/Dsshop/pages');
        foreach ($json_dswjcms as $id=>$json){
            if($json['name']== $name){
                $json_dswjcms[$id]['is_delete'] = 1;
            }
        }
        file_put_contents($this->pluginPath . '/dswjcms.json', json_encode($json_dswjcms));
        return resReturn(1, '成功');
    }

    /**
     * 删除目录下的插件文件
     * @param string $original //原始目录
     * @param $target
     */
    protected function fileUninstall($original, $target)
    {
        if (file_exists($original)) {
            $data = scandir($original);
            foreach ($data as $value) {
                if ($value != '.' && $value != '..') {
                    if (is_dir($original . '/' . $value)) { //如果是目录
                        $this->fileUninstall($original . '/' . $value, $target . '/' . $value);
                    } else {
                        if (file_exists($target . '/' . $value)) {
                            unlink($target . '/' . $value);
                        }
                    }
                }
            }
        }
    }
}
