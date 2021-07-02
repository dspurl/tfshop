<?php

namespace App\common;

use App\Code;
use App\Models\v1\AuthGroupAuthRule;
use App\Models\v1\AuthRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

class Plugin
{
    private $pluginPath;
    private $path;
    private $migrations;
    private $migrationsPath;
    private $pluginListPath;
    private $casting = [
        'tinyInteger' => 'int',
        'smallInteger' => 'int',
        'mediumInteger' => 'int',
        'integer' => 'int',
        'bigInteger' => 'int',
        'timestamp' => 'string',
        'char' => 'string',
        'string' => 'string',
        'text' => 'string',
        'mediumText' => 'string',
        'longText' => 'string',
        'json' => 'string',
    ];

    function __construct()
    {
        $file_path = explode("/", base_path());
        unset($file_path[count($file_path) - 1]);
        $this->path = implode("/", $file_path);
        $this->pluginPath = $this->path . '/plugin';
        $this->pluginListPath = $this->pluginPath . '/list';
        $this->migrationsPath = $this->path . '/api/database/migrations';
        $this->migrations = scandir($this->migrationsPath);
    }

    /**
     * 获取本地插件列表
     */
    public function getLocalPlugin()
    {
        // 创建list插件目录
        if (!file_exists($this->pluginListPath)) {
            mkdir($this->pluginListPath, 0777, true);
        }
        $data = scandir($this->pluginListPath);
        $list = [];
        $json_dsshop = json_decode(file_get_contents($this->pluginPath . '/dsshop.json'), true);
        foreach ($data as $value) {
            if ($value != '.' && $value != '..') {
                $dsshop = json_decode(file_get_contents($this->pluginListPath . '/' . $value . '/dsshop.json'), true);
                foreach ($json_dsshop as $js) {
                    if ($js['name'] == $dsshop['abbreviation']) {
                        $dsshop['locality_versions'] = $js['versions'];
                        $dsshop['is_delete'] = $js['is_delete'];
                    }
                }
                $list[] = $dsshop;
            }
        }
        return $list;
    }

    /**
     * 获取所有模型
     */
    public function models()
    {
        $data = scandir($this->path . '/api/app/Models/v' . config('dsshop.versions'));
        $return = [];
        foreach ($data as $value) {
            if ($value != '.' && $value != '..') {
                $return[] = str_replace(".php", "", $value);
            }
        }
        return $return;
    }

    /**
     * 获取所有模板
     * @param $name //区分后台还是客户端
     * @return \Illuminate\Support\Collection|string
     */
    public function template($name = 'client')
    {
        $data = scandir($this->path . "/$name");
        $return = [];
        foreach ($data as $value) {
            if ($value != '.' && $value != '..') {
                $catalogue = $this->path . "/$name/" . $value;
                if (is_dir($catalogue)) {
                    $list = scandir($catalogue);
                    $return[$value] = [
                        'name' => $value,
                        'children' => []
                    ];
                    foreach ($list as $l) {
                        if ($l != '.' && $l != '..') {
                            if (is_dir($catalogue . '/' . $l)) {
                                $path = $catalogue . '/' . $l . '/dsshop.config.json';
                                if (!file_exists($path)) {
                                    return resReturn(0, '缺少dsshop.config.json配置文件', Code::CODE_WRONG);
                                }
                                $config = json_decode(file_get_contents($path), true);
                                $return[$value]['children'][] = $config;
                                unset($path);
                                unset($config);
                            }
                        }
                    }
                    unset($list);
                }
                unset($catalogue);
            }
        }
        return collect($return)->values();
    }

    /**
     * 获取所有的权限，去除已选中的
     * @param array $arr //已选中的ID数组
     * @return array
     */
    public function jurisdiction($arr = [])
    {
        if (count($arr) > 0) {
            $arr = getsAllValues(json_decode(json_encode($arr), true), 'id');
        }
        $AuthRule = AuthRule::orderBy('pid', 'asc')->orderBy('sort', 'asc')->orderBy('id')->get();
        $returnAuthRule = [];
        foreach ($AuthRule as $a) {
            if (count($arr) > 0) {
                if (!in_array($a->id, $arr) || $a->pid == 0) {
                    $returnAuthRule[] = array(
                        'label' => $a->title,
                        'value' => $a->id,
                        'pid' => $a->pid,
                        'id' => $a->id,
                        'api' => $a->api,
                        'url' => $a->url,
                        'icon' => $a->icon,
                        'title' => $a->title,
                        'state' => $a->state,
                        'sort' => $a->sort,
                    );
                }
            } else {
                $returnAuthRule[] = array(
                    'label' => $a->title,
                    'value' => $a->id,
                    'pid' => $a->pid,
                    'id' => $a->id,
                    'api' => $a->api,
                    'url' => $a->url,
                    'icon' => $a->icon,
                    'title' => $a->title,
                    'state' => $a->state,
                    'sort' => $a->sort,
                );
            }
        }
        return genTree($returnAuthRule, 'pid');
    }

    /**
     * 创建插件
     * @param Request $request
     * @return string
     * @throws \Exception
     */
    public function create($request)
    {
        if (count($request->db) == 0 && count($request->observer) == 0) {
            throw new \Exception('您的插件至少配置了数据库或观察者', Code::CODE_PARAMETER_WRONG);
        }
        // 创建插件时，先清除插件创建过的文件和目录
        $this->destroy($request->abbreviation);
        if (file_exists($this->pluginListPath . '/' . $request->abbreviation . '/dsshop.json')) {
            throw new \Exception('创建的插件已经存在', Code::CODE_PARAMETER_WRONG);
        }
        $this->generatePlugInDirectory();
        $this->createPlugInJson($request);
        if ($request->observer) {
            foreach ($request->observer as $observer) {
                $this->createObserver($observer);
            }
        }
        if ($request->db) {
            foreach ($request->db as $db) {
                if ($db['data_table']) {
                    $this->createDBMigration($db, true);
                    $this->createModels($db);
                }
                // 生成后端代码
                if ($db['after_end']) {
                    $this->createController($db, 'admin');
                    $this->createController($db, 'client');
                    $this->createRequests($db);
                }
                // 生成后台代码
                if ($db['backstage']) {
                    $this->createBackstage($db, $request);
                    $this->createBackstageApi($db, $request);
                }
                // 生成客户端代码
                if ($db['client']) {
                    $this->createClient($db, $request);
                }
                // 生成权限
                if ($db['jurisdiction']) {
                    $this->createJurisdiction($db);
                }
            }
        }
        $this->createRoutes($request);
        return '创建成功';
    }

    /**
     * 编辑插件
     * @param Request $request
     * @return string
     * @throws \Exception
     */
    public function edit($request)
    {
        if (count($request->db) == 0 && count($request->observer) == 0) {
            throw new \Exception('您的插件至少配置了数据库或观察者', Code::CODE_PARAMETER_WRONG);
        }
        $this->generatePlugInDirectory();
        $this->editPlugInJson($request);
        if ($request->observer) {
            foreach ($request->observer as $observer) {
                if ($observer['reset']) {
                    $this->createObserver($observer);
                }
            }
        }
        if ($request->db) {
            foreach ($request->db as $db) {
                // 生成后端代码且开启重置
                if ($db['reset']) {
                    if ($db['data_table']) {
                        $this->createDBMigration($db, $db['reset']);
                        $this->createModels($db);
                    }
                    if ($db['after_end']) {
                        $this->createController($db, 'admin');
                        $this->createController($db, 'client');
                        $this->createRequests($db);
                    }
                    // 生成后台代码
                    if ($db['backstage']) {
                        $this->createBackstage($db, $request);
                        $this->createBackstageApi($db, $request);
                    }
                    // 生成客户端代码
                    if ($db['client']) {
                        $this->createClient($db, $request);
                    }
                    // 生成权限
                    if ($db['jurisdiction']) {
                        $this->createJurisdiction($db);
                    }
                }
            }
        }
        if ($request->routes) {
            $this->createRoutes($request, true);
        }
        return '更新成功';
    }

    /**
     * 发行插件
     * @param $name
     * @return string
     * @throws \Exception
     */
    public function publish($name)
    {
        if (file_exists($this->pluginListPath . '/' . $name . '/dsshop.json')) {
            $path = json_decode(file_get_contents($this->pluginListPath . '/' . $name . '/dsshop.json'), true);
            // 清空插件打包产生的相关文件
            $this->delDirAndFile($this->pluginListPath . '/' . $name . '/admin');
            $this->delDirAndFile($this->pluginListPath . '/' . $name . '/api');
            // 打包数据表相关文件
            if ($path['db']) {
                foreach ($path['db'] as $db) {
                    $this->package($name, $db, $path);
                }
            }
            // 配置文件
            $this->filePackageDeployment($this->path . '/api/config/' . $name . '.php', $this->pluginListPath . '/' . $name . '/api/config/' . $name . '.php');
            // 观察者文件
            if ($path['observer']) {
                foreach ($path['observer'] as $observer) {
                    $this->filePackageDeployment($this->path . '/api/app/Observers/' . $observer['models'] . '/' . $this->convertUnderline($observer['name']) . 'Observer.php', $this->pluginListPath . '/' . $name . '/api/observers/' . $observer['models'] . '/' . $this->convertUnderline($observer['name']) . 'Observer.php');
                }
            }
            // 打包关联文件
            if ($path['relevance']) {
                foreach ($path['relevance'] as $relevance) {
                    $this->filePackageDeployment($this->path . $relevance['file'], $this->pluginListPath . '/' . $name . '/api/relevance/' . basename($relevance['file']));
                }
            }
            // 打包路由文件
            $this->packageRoutes($path);
            return '打包成功';
        }
    }

    /**
     * 下载插件
     * @param $name
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function download($name)
    {
        if (file_exists($this->pluginListPath . '/' . $name . '/dsshop.json')) {
            $path = json_decode(file_get_contents($this->pluginListPath . '/' . $name . '/dsshop.json'), true);
            $pluginPath = $this->pluginListPath . '/' . $path['abbreviation'];
            $newPath = $this->path . '/api/storage/app/public/plugin/' . $name;
            $newPluginPath = 'plugin/' . $name;
            // 将插件移动到可下载目录
            $this->fileDeployment($pluginPath, $newPath);
            $disk = Storage::disk('public');
            $json = [
                'name' => $path['name'],
                'abbreviation' => $path['abbreviation'],
                'describe' => $path['describe'],
                'versions' => $path['versions'],
                'author' => $path['author'],
            ];
            $disk->put($newPluginPath . '/dsshop.json', json_encode($json));
            $disk->put($newPluginPath . '/README.md', $path['instructions']);
            $zip_file = $newPath . '.zip';
            $zip = new \ZipArchive();
            $zip->open($zip_file, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);
            $path = storage_path('app/public/plugin/' . $name);
            $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path));
            foreach ($files as $name => $file) {
                if (!$file->isDir()) {
                    $filePath = $file->getRealPath();
                    $relativePath = './' . substr($filePath, strlen($path) + 1);
                    $zip->addFile($filePath, $relativePath);
                }
            }
            $zip->close();
            $this->delDirAndFile($newPath, true);
            return response()->download($zip_file);
        }
    }

    /**
     * 插件详情
     * @param $name
     * @return string
     */
    public function details($name)
    {
        $path = $this->pluginListPath . '/' . $name . '/dsshop.json';
        return json_decode(file_get_contents($path));
    }

    /**
     * 安装和更新插件
     * @param $name //插件简称
     * @return string
     * @throws \Exception
     */
    public function autoPlugin($name)
    {
        $path = $this->pluginListPath . '/' . $name;
        $dsshop = $path . '/dsshop.json';
        $routes = $path . '/routes.json';
        if (!file_exists($routes)) {
            throw new \Exception('插件缺少routes.json文件', Code::CODE_PARAMETER_WRONG);
        }
        if (!file_exists($dsshop)) {
            throw new \Exception('插件缺少dsshop.json文件', Code::CODE_PARAMETER_WRONG);
        }
        $dsshop = json_decode(file_get_contents($dsshop), true);
        $routes = json_decode(file_get_contents($routes), true);
        $this->fileDeployment($path . '/api/config', $this->path . '/api/config');
        $this->fileDeployment($path . '/api/models', $this->path . '/api/app/Models/v' . config('dsshop.versions'));
        $this->fileDeployment($path . '/api/plugin', $this->path . '/api/app/Http/Controllers/v' . config('dsshop.versions') . '/Plugin');
        $this->fileDeployment($path . '/api/requests', $this->path . '/api/app/Http/Requests/v' . config('dsshop.versions'));
        $this->fileDeployment($path . '/api/observers', $this->path . '/api/app/Observers');
        $this->fileDeployment($path . '/database', $this->path . '/api/database/migrations');
        if (count($routes['adminTemplate']) > 0) {
            foreach ($routes['adminTemplate'] as $admin) {
                $this->fileDeployment($path . '/admin/' . $admin . '/api', $this->path . '/admin/' . $admin . '/src/api');
                $this->fileDeployment($path . '/admin/' . $admin . '/views', $this->path . '/admin/' . $admin . '/src/views/ToolManagement');
            }
        }
        if (count($routes['clientTemplate']) > 0) {
            foreach ($routes['clientTemplate'] as $client) {
                $this->fileDeployment($path . '/client/' . $client, $this->path . '/client/' . $client);
            }
        }
        // 关联的文件
        if (count($routes['relevance']) > 0) {
            foreach ($routes['relevance'] as $relevance) {
                $this->filePackageDeployment($path . '/api/relevance/' . basename($relevance), $this->path . $relevance);
            }
        }
        // 添加路由
        if (array_key_exists('admin', $routes) || array_key_exists('app', $routes) || array_key_exists('notValidatedApp', $routes)) {
            $targetPath = $this->path . '/api/routes/plugin.php';
            $file_get_contents = file_get_contents($targetPath);
            //去除已存在的插件代码
            $file_get_contents = preg_replace('/\/\/' . $dsshop['name'] . '_s(.*?)\/\/' . $dsshop['name'] . '_e/is', '', $file_get_contents);
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            // 添加新的插件代码
            if (array_key_exists('admin', $routes)) {
                $file_get_contents = str_replace("前台插件列表", $dsshop['name'] . "_s
        " . $routes['admin'] . "
        //" . $dsshop['name'] . "_e
        //前台插件列表", $file_get_contents);
            }
            if (array_key_exists('notValidatedApp', $routes)) {
                $file_get_contents = str_replace("APP无需验证插件列表", $dsshop['name'] . "_s
        " . $routes['notValidatedApp'] . "
        //" . $dsshop['name'] . "_e
        //APP无需验证插件列表", $file_get_contents);
            }
            if (array_key_exists('app', $routes)) {
                $file_get_contents = str_replace("APP验证插件列表", $dsshop['name'] . "_s
        " . $routes['app'] . "
        //" . $dsshop['name'] . "_e
        //APP验证插件列表", $file_get_contents);
            }
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            file_put_contents($targetPath, $file_get_contents);
            unset($targetPath);
            unset($file_get_contents);
        }

        // permission
        if (array_key_exists('permission', $routes)) {
            if (count($routes['adminTemplate']) > 0) {
                foreach ($routes['adminTemplate'] as $admin) {
                    $targetPath = $this->path . '/admin/' . $admin . '/src/store/modules/permission.js';
                    $file_get_contents = file_get_contents($targetPath);
                    //去除已存在的插件代码
                    $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
                    $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
                    // 添加新的插件代码
                    $file_get_contents = str_replace("插件列表", $dsshop['name'] . "_s
  " . $routes['permission'][$admin] . "
  // " . $dsshop['name'] . "_e
  // 插件列表", $file_get_contents);
                    $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
                    file_put_contents($targetPath, $file_get_contents);
                    unset($targetPath);
                    unset($file_get_contents);
                }
            }
        }

        // observers
        if (array_key_exists('observers', $routes)) {
            $targetPath = $this->path . '/api/app/Providers/AppServiceProvider.php';
            $file_get_contents = file_get_contents($targetPath);
            //去除已存在的插件代码
            $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            // 添加新的插件代码
            $file_get_contents = str_replace("插件", $dsshop['name'] . "_s
        " . $routes['observers'] . "
        // " . $dsshop['name'] . "_e
        // 插件", $file_get_contents);
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            file_put_contents($targetPath, $file_get_contents);
            unset($targetPath);
            unset($file_get_contents);
        }
        // 微信公众号模板消息
        if (array_key_exists('wechatChannel', $routes)) {
            $targetPath = $this->path . '/api/app/Channels/WechatChannel.php';
            $file_get_contents = file_get_contents($targetPath);
            //去除已存在的插件代码
            $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            // 添加新的插件代码
            $file_get_contents = str_replace("插件", $dsshop['name'] . "_s
    " . $routes['wechatChannel'] . "
    // " . $dsshop['name'] . "_e
    // 插件", $file_get_contents);
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            file_put_contents($targetPath, $file_get_contents);
            unset($targetPath);
            unset($file_get_contents);
        }
        // 路由语言包
        if (array_key_exists('routeLangAdmin', $routes) || array_key_exists('routeLangClient', $routes)) {
            $targetPath = $this->path . '/api/resources/lang/zn/route.php';
            $file_get_contents = file_get_contents($targetPath);
            if (array_key_exists('routeLangAdmin', $routes)) {
                //去除已存在的插件代码
                $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
                $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
                // 添加新的插件代码
                $file_get_contents = str_replace("admin插件", $dsshop['name'] . "_s
    " . $routes['routeLangAdmin'] . "
        // " . $dsshop['name'] . "_e
        // admin插件", $file_get_contents);
            }
            if (array_key_exists('routeLangClient', $routes)) {
                //去除已存在的插件代码
                $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
                $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
                // 添加新的插件代码
                $file_get_contents = str_replace("client插件", $dsshop['name'] . "_s
    " . $routes['routeLangClient'] . "
        // " . $dsshop['name'] . "_e
        // client插件", $file_get_contents);
            }
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            file_put_contents($targetPath, $file_get_contents);
            unset($targetPath);
            unset($file_get_contents);
        }

        //写入本地插件列表
        $json_dsshop = json_decode(file_get_contents($this->pluginPath . '/dsshop.json'), true);
        if (collect($json_dsshop)->firstWhere('name', $name)) {
            foreach ($json_dsshop as $id => $js) {
                if ($js['name'] == $dsshop['abbreviation']) {
                    $json_dsshop[$id]['versions'] = $dsshop['versions'];
                    $json_dsshop[$id]['is_delete'] = 0;
                    $json_dsshop[$id]['time'] = date('Y-m-d H:i:s');
                }
            }
        } else {
            $json_dsshop[] = array(
                'name' => $name,
                'versions' => $dsshop['versions'],
                'is_delete' => 0,
                'time' => date('Y-m-d H:i:s')
            );
        }
        file_put_contents($this->pluginPath . '/dsshop.json', json_encode($json_dsshop));
        Artisan::call('migrate');
        // 生成权限
        if (count($routes['packagingJurisdiction']) > 0) {
            $routes['packagingJurisdiction'] = $this->installPermissions($routes['packagingJurisdiction']);
            file_put_contents($path . '/routes.json', json_encode($routes));
        }
        return '操作成功';
    }

    /**
     * 删除插件
     * @param $name
     * @return string
     */
    public function destroy($name)
    {
        if (file_exists($this->pluginListPath . '/' . $name . '/dsshop.json')) {
            $path = json_decode(file_get_contents($this->pluginListPath . '/' . $name . '/dsshop.json'), true);
            if ($path['db']) {
                foreach ($path['db'] as $db) {
                    $names = $this->convertUnderline(rtrim($db['name'], 's'));
                    $n = $this->convertUnderline(rtrim($db['name'], 's'), true);
                    $this->fileDestroy($this->migrationsPath . '/' . $this->getLocalMigrations('create_' . $db['name'] . '_table'));
                    $this->fileDestroy($this->path . '/api/app/Http/Controllers/v' . config('dsshop.versions') . '/Plugin/Admin/' . $names . 'Controller.php');
                    $this->fileDestroy($this->path . '/api/app/Http/Controllers/v' . config('dsshop.versions') . '/Plugin/Client/' . $names . 'Controller.php');
                    $this->fileDestroy($this->path . '/api/app/Models/v' . config('dsshop.versions') . '/' . $names . '.php');
                    $this->fileDestroy($this->path . '/api/app/Http/Requests/v' . config('dsshop.versions') . '/Submit' . $names . 'Request.php');
                    $this->clearJurisdiction($db);
                    //删除后台模板（目录移动过将不会进行删除）
                    if (count($path['adminTemplate']) > 0) {
                        foreach ($path['adminTemplate'] as $c) {
                            $this->delDirAndFile($this->path . '/admin/' . $c . '/src/views/ToolManagement/' . $names, true);
                            $this->fileDestroy($this->path . '/admin/' . $c . '/src/api/' . $n . '.js');
                        }
                    }
                    //删除客户端模板（目录移动过将不会进行删除）
                    if (count($path['clientTemplate']) > 0) {
                        foreach ($path['clientTemplate'] as $c) {
                            $this->delDirAndFile($this->path . '/client/' . $c . '/pages/' . $n, true);
                            $this->delDirAndFile($this->path . '/client/' . $c . '/pages/user/' . $n, true);
                            $this->fileDestroy($this->path . '/client/' . $c . '/api/' . $n . '.js');
                        }
                    }
                }

            }
            // 观察者
            if ($path['observer']) {
                foreach ($path['observer'] as $observer) {
                    $this->removeObserver($observer);
                }
            }
            // 关联的文件
            if ($path['relevance']) {
                foreach ($path['relevance'] as $relevance) {
                    $this->fileDestroy($this->path . '/' . $relevance['file']);
                }
            }
            $this->removeRoutes($path['name'], $path);
            $this->delDirAndFile($this->pluginListPath . '/' . $name, true);
            return '删除成功';
        }
    }

    /**
     * 卸载插件
     * @param string $name //组件名称
     * @return string
     * @throws \Exception
     */
    public function autoUninstall($name)
    {
        $names = $this->convertUnderline($name);
        $path = $this->pluginListPath . '/' . $name;
        $routes = $this->pluginListPath . '/' . $name . '/routes.json';
        $dsshop = $this->pluginListPath . '/' . $name . '/dsshop.json';
        if (!file_exists($routes)) {
            throw new \Exception('插件缺少routes.json文件', Code::CODE_PARAMETER_WRONG);
        }
        if (!file_exists($dsshop)) {
            throw new \Exception('插件缺少dsshop.json文件', Code::CODE_PARAMETER_WRONG);
        }

        $dsshop = json_decode(file_get_contents($dsshop), true);
        $json_dsshop = json_decode(file_get_contents($this->pluginPath . '/dsshop.json'), true);
        $routes = json_decode(file_get_contents($routes), true);
        // 删除权限
        if (count($routes['packagingJurisdiction']) > 0) {
            $this->uninstallJurisdiction($routes['packagingJurisdiction']);
        }
        Artisan::call('migrate:rollback');
        //去除API路由
        $targetPath = $this->path . '/api/routes/plugin.php';
        $file_get_contents = file_get_contents($targetPath);
        $file_get_contents = preg_replace('/\/\/' . $dsshop['name'] . '_s(.*?)\/\/' . $dsshop['name'] . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
        file_put_contents($targetPath, $file_get_contents);
        unset($targetPath);
        unset($file_get_contents);
        //去除observers注册代码
        $targetPath = $this->path . '/api/app/Providers/AppServiceProvider.php';
        $file_get_contents = file_get_contents($targetPath);
        $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
        file_put_contents($targetPath, $file_get_contents);
        unset($targetPath);
        unset($file_get_contents);
        // 去除微信公众号模板消息
        $targetPath = $this->path . '/api/app/Channels/WechatChannel.php';
        $file_get_contents = file_get_contents($targetPath);
        $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
        file_put_contents($targetPath, $file_get_contents);
        unset($targetPath);
        unset($file_get_contents);
        //去除路由语言包
        $targetPath = $this->path . '/api/resources/lang/zn/route.php';
        $file_get_contents = file_get_contents($targetPath);
        $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
        file_put_contents($targetPath, $file_get_contents);
        unset($targetPath);
        unset($file_get_contents);
        $this->fileUninstall($path . '/api/config', $this->path . '/api/config');
        $this->fileUninstall($path . '/api/models', $this->path . '/api/app/Models/v' . config('dsshop.versions'));
        $this->fileUninstall($path . '/api/plugin', $this->path . '/api/app/Http/Controllers/v' . config('dsshop.versions') . '/Plugin');
        $this->fileUninstall($path . '/api/requests', $this->path . '/api/app/Http/Requests/v' . config('dsshop.versions'));
        $this->fileUninstall($path . '/api/observers', $this->path . '/api/app/Observers');
        $this->fileUninstall($path . '/database', $this->path . '/api/database/migrations');
        if (count($routes['adminTemplate']) > 0) {
            foreach ($routes['adminTemplate'] as $c) {
                //去除后台路由
                $targetPath = $this->path . '/admin/' . $c . '/src/store/modules/permission.js';
                $file_get_contents = file_get_contents($targetPath);
                $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
                $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
                file_put_contents($targetPath, $file_get_contents);
                unset($targetPath);
                unset($file_get_contents);
                $this->fileUninstall($path . '/admin/' . $c . '/views', $this->path . '/admin/' . $c . '/src/views/ToolManagement');
                // 删除对应的api
                foreach ($routes['db'] as $db) {
                    $this->fileDestroy($this->path . '/admin/' . $c . '/src/api/' . $this->convertUnderline(rtrim($db['name'], 's'), true) . '.js');
                }
            }
        }
        if (count($routes['clientTemplate']) > 0) {
            foreach ($routes['clientTemplate'] as $c) {
                $this->delDirAndFile($this->path . '/client/' . $c . '/pages/' . $names, true);
                $this->delDirAndFile($this->path . '/client/' . $c . '/pages/user/' . $names, true);
                // 删除对应的api
                foreach ($routes['db'] as $db) {
                    $this->fileDestroy($this->path . '/client/' . $c . '/api/' . $this->convertUnderline(rtrim($db['name'], 's'), true) . '.js');
                }
            }
        }
        // 关联的文件
        if (count($routes['relevance']) > 0) {
            foreach ($routes['relevance'] as $relevance) {
                $this->fileDestroy($this->path . '/' . $relevance);
            }
        }

        foreach ($json_dsshop as $id => $json) {
            if ($json['name'] == $name) {
                $json_dsshop[$id]['is_delete'] = 1;
            }
        }
        file_put_contents($this->pluginPath . '/dsshop.json', json_encode($json_dsshop));
        if ($routes['db']) {
            foreach ($routes['db'] as $db) {
                $this->clearJurisdiction($db);
            }
        }
        return '卸载完成';
    }

    /**
     * 安装权限
     * @param $jurisdiction //权限
     * @param $old // 旧的pid
     * @param $new // 新的pid
     * @return mixed
     */
    protected function installPermissions(&$jurisdiction, $old = 0, $new = 0)
    {
        $AuthGroupId = auth('api')->user()->AuthGroup->pluck('id');
        foreach ($jurisdiction as $id => &$j) {
            $AuthRules = AuthRule::firstOrCreate([
                'api' => $j['api'],
                'url' => $j['url'] ? $j['url'] : '',
                'icon' => $j['icon'],
                'title' => $j['title'],
                'pid' => $j['pid'] == $old ? $old : $new,
                'state' => $j['state'] ? AuthRule::AUTH_RULE_STATE_ON : AuthRule::AUTH_RULE_STATE_OFF,
                'sort' => $j['sort'] ? $j['sort'] : 0
            ]);
            $jurisdiction[$id]['id'] = $AuthRules->id;
            foreach ($AuthGroupId as $aid) {
                AuthGroupAuthRule::firstOrCreate([
                    'auth_group_id' => $aid,
                    'auth_rule_id' => $AuthRules->id,
                ]);
            }
            if (array_key_exists("children", $j)) {
                $this->installPermissions($j['children'], $j['pid'], $AuthRules->id);
            }
        }
        return $jurisdiction;
    }

    /**
     * 卸载权限
     * @param $jurisdiction //已安装的权限
     */
    protected function uninstallJurisdiction($jurisdiction)
    {
        $AuthGroupId = auth('api')->user()->AuthGroup->pluck('id');
        foreach ($jurisdiction as $j) {
            if ($j['pid'] != 0) {
                $AuthRules = AuthRule::find($j['id']);
                foreach ($AuthGroupId as $aid) {
                    AuthGroupAuthRule::where([
                        'auth_group_id' => $aid,
                        'auth_rule_id' => $AuthRules->id,
                    ])->delete();
                }
                AuthRule::where('id', $AuthRules->id)->delete();
            }
            if (array_key_exists("children", $j)) {
                $this->uninstallJurisdiction($j['children']);
            }
        }
    }


    /**
     * 打包路由
     * @param $request
     */
    protected function packageRoutes($request)
    {
        $name = $request['name'];
        $routes = [];
        $routesPath = $this->pluginListPath . '/' . $request['abbreviation'] . '/routes.json';
        $dsshopPath = $this->pluginListPath . '/' . $request['abbreviation'] . '/dsshop.json';
        $pluginPath = $this->path . '/api/routes/plugin.php';

        $langPath = $this->path . '/api/resources/lang/zn/route.php';
        $providerPath = $this->path . '/api/app/Providers/AppServiceProvider.php';
        $wechatChannelPath = $this->path . '/api/app/Channels/WechatChannel.php';
        $file_get_plugin_contents = file_get_contents($pluginPath);
        preg_match_all('/\/\/' . $name . '_s(.*?)\/\/' . $name . '_e/is', $file_get_plugin_contents, $file_get_plugin_contents);
        if (count($file_get_plugin_contents[1]) > 0) {
            $routes['admin'] = $file_get_plugin_contents[1][0];
            $routes['app'] = $file_get_plugin_contents[1][1];
            $routes['notValidatedApp'] = $file_get_plugin_contents[1][2];
        }
        if (count($request['adminTemplate']) > 0) {
            foreach ($request['adminTemplate'] as $c) {
                $permissionPath = $this->path . '/admin/' . $c . '/src/store/modules/permission.js';
                $permission_file_get_contents = file_get_contents($permissionPath);
                preg_match_all('/\/\/ ' . $name . '_s(.*?)\/\/ ' . $name . '_e/is', $permission_file_get_contents, $permission_file_get_contents);
                if (count($permission_file_get_contents[1]) > 0) {
                    $routes['permission'][$c] = $permission_file_get_contents[1][0];
                }
            }
        }
        $file_get_lang_contents = file_get_contents($langPath);
        preg_match_all('/\/\/ ' . $name . '_s(.*?)\/\/ ' . $name . '_e/is', $file_get_lang_contents, $file_get_lang_contents);
        if (count($file_get_lang_contents[1]) > 0) {
            $routes['routeLangAdmin'] = $file_get_lang_contents[1][0];
            $routes['routeLangClient'] = $file_get_lang_contents[1][1];
        }
        // 观察者
        $provider_file_get_contents = file_get_contents($providerPath);
        preg_match_all('/\/\/ ' . $name . '_s(.*?)\/\/ ' . $name . '_e/is', $provider_file_get_contents, $provider_file_get_contents);
        if (count($provider_file_get_contents[1]) > 0) {
            $routes['observers'] = $provider_file_get_contents[1][0];
        }
        // 微信公众号模板消息
        $file_wechat_channel_get_contents = file_get_contents($wechatChannelPath);
        preg_match_all('/\/\/' . $name . '_s(.*?)\/\/' . $name . '_e/is', $file_wechat_channel_get_contents, $file_wechat_channel_get_contents);
        if (count($file_wechat_channel_get_contents[1]) > 0) {
            $routes['wechatChannel'] = $file_wechat_channel_get_contents[1][0];
        }
        // 关联文件
        $routes['relevance'] = [];
        if ($request['relevance']) {
            foreach ($request['relevance'] as $relevance) {
                $routes['relevance'][] = $relevance['file'];
            }
        }
        // 客户端模板
        $routes['clientTemplate'] = [];
        if ($request['clientTemplate']) {
            $routes['clientTemplate'] = $request['clientTemplate'];
        }
        // 后台模板
        $routes['adminTemplate'] = [];
        if ($request['adminTemplate']) {
            $routes['adminTemplate'] = $request['adminTemplate'];
        }
        // 数据库
        $routes['db'] = [];
        if ($request['db']) {
            foreach ($request['db'] as $db) {
                $routes['db'][] = [
                    'name' => $db['name'],
                    'annotation' => $db['annotation'],
                    'jurisdiction' => $db['jurisdiction']
                ];
            }
        }
        // 权限
        $routes['packagingJurisdiction'] = $request['packagingJurisdiction'];
        // 生成routes.json
        if (!file_exists($routesPath)) {
            fopen($routesPath, 'w+');
        }
        file_put_contents($routesPath, json_encode($routes));
        // 修改配置信息
        $dsshop_file_get_contents = json_decode(file_get_contents($dsshopPath), true);
        $dsshop_file_get_contents['publish'] = true;
        file_put_contents($dsshopPath, json_encode($dsshop_file_get_contents));
    }

    /**
     * 打包数据表相关文件
     * @param $name
     * @param $db
     * @param $request
     * @throws \Exception
     */
    protected function package($name, $db, $request)
    {
        $dbName = $this->convertUnderline(rtrim($db['name'], 's'));
        $dbNames = $this->convertUnderline(rtrim($db['name'], 's'), true);
        // 后端
        $this->filePackageDeployment($this->path . '/api/app/Http/Controllers/v' . config('dsshop.versions') . '/Plugin/Admin/' . $dbName . 'Controller.php', $this->pluginListPath . '/' . $name . '/api/plugin/Admin/' . $dbName . 'Controller.php');
        $this->filePackageDeployment($this->path . '/api/app/Http/Controllers/v' . config('dsshop.versions') . '/Plugin/Client/' . $dbName . 'Controller.php', $this->pluginListPath . '/' . $name . '/api/plugin/Client/' . $dbName . 'Controller.php');
        $this->filePackageDeployment($this->path . '/api/app/Http/Requests/v' . config('dsshop.versions') . '/Submit' . $dbName . 'Request.php', $this->pluginListPath . '/' . $name . '/api/requests/Submit' . $dbName . 'Request.php');
        $this->filePackageDeployment($this->path . '/api/app/Models/v' . config('dsshop.versions') . '/' . $dbName . '.php', $this->pluginListPath . '/' . $name . '/api/models/' . $dbName . '.php');
        // 后台
        //获取支持的后台
        if (count($request['adminTemplate']) > 0) {
            foreach ($request['adminTemplate'] as $c) {
                $path = $this->path . '/admin/' . $c;
                $structure = explode('/', $c);
                if (count($structure) != 2) {
                    throw new \Exception('后台模板目录结构有误', Code::CODE_INEXISTENCE);
                }
                $this->filePackageDeployment($path . '/src/api/' . $dbNames . '.js', $this->pluginListPath . '/' . $name . '/admin/' . $c . '/api/' . $dbNames . '.js');
                $this->fileDeployment($path . '/src/views/ToolManagement/' . $dbName, $this->pluginListPath . '/' . $name . '/admin/' . $c . '/views/' . $dbName);
                unset($path);
                unset($structure);
            }
        }
        // 客户端
        //获取支持的客户端
        if (count($request['clientTemplate']) > 0) {
            foreach ($request['clientTemplate'] as $c) {
                $path = $this->path . '/client/' . $c;
                $structure = explode('/', $c);
                if (count($structure) != 2) {
                    throw new \Exception('客户端模板目录结构有误', Code::CODE_INEXISTENCE);
                }
                $this->fileDeployment($path . '/pages/' . $request['abbreviation'], $this->pluginListPath . '/' . $name . '/client/' . $c . '/pages/' . $request['abbreviation']);
                $this->fileDeployment($path . '/pages/user/' . $request['abbreviation'], $this->pluginListPath . '/' . $name . '/client/' . $c . '/pages/user/' . $request['abbreviation']);
                $this->filePackageDeployment($path . '/api/' . $dbNames . '.js', $this->pluginListPath . '/' . $name . '/client/' . $c . '/api/' . $dbNames . '.js');
                unset($path);
                unset($structure);
            }
        }
        // 数据迁移文件
        $getLocalMigrations = $this->getLocalMigrations('_' . $db['name'] . '_table', true);
        foreach ($getLocalMigrations as $g) {
            $this->filePackageDeployment($this->path . '/api/database/migrations/' . $g, $this->pluginListPath . '/' . $name . '/database/' . $g);
        }
    }

    /**
     * 删除观察者
     * @param $observer
     */
    protected function removeObserver($observer)
    {
        $name = $this->convertUnderline($observer['name']);
        $observersPath = $this->path . '/api/app/Observers/' . $observer['models'];
        $path = $observersPath . '/' . $name . 'Observer.php';
        $this->fileDestroy($path);
    }

    /**
     * 生成观察者
     * @param $observer
     * @throws \Exception
     */
    protected function createObserver($observer)
    {
        $name = $this->convertUnderline($observer['name']);
        // 生成观察者所在目录文件夹
        $observersPath = $this->path . '/api/app/Observers/' . $observer['models'];
        $path = $observersPath . '/' . $name . 'Observer.php';
        if (!file_exists($observersPath)) {
            mkdir($observersPath, 0777, true);
        }
        // 模板
        $controller = $this->pluginPath . '/template/observer.ds';
        if (!file_exists($controller)) {
            throw new \Exception('缺少observer.ds文件', Code::CODE_INEXISTENCE);
        }
        // 生成观察者
        if (!file_exists($path)) {
            fopen($path, 'w+');
        }
        // 可执行路由
        $route = '';

        foreach ($observer['path'] as $p) {
            $routeName = explode('app', $p);
            if (count($routeName) != 2) {
                $routeName = explode('admin', $p);
            }
            if (count($routeName) != 2) {
                throw new \Exception('可执行路由格式错误', Code::CODE_INEXISTENCE);
            }
            $route .= "
        '" . 'app' . preg_replace('/\/{(.*?)}/', '', $routeName[1]) . "',
            ";
            unset($routeName);
        }
        $content = file_get_contents($controller);
        $content = preg_replace([
            '/{{ package }}/',
            '/{{ versions }}/',
            '/{{ enExplain }}/',
            '/{{ explain }}/',
            '/{{ name }}/',
            '/{{ route }}/',
            '/{{ packages }}/'
        ], [
            $observer['models'],
            config('dsshop.versions'),
            $observer['name'],
            $observer['explain'],
            $name,
            $route,
            lcfirst($observer['models'])
        ], $content);
        $content = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $content);
        file_put_contents($path, $content);
    }

    /**
     * 生成权限
     * @param $db
     */
    protected function createJurisdiction($db)
    {
        $name = $this->convertUnderline(rtrim($db['name'], 's'));
        $apiArr = [
            [
                'api' => $name . 'List',
                'name' => $db['annotation'] . '列表',
            ],
            [
                'api' => $name . 'Create',
                'name' => '创建' . $db['annotation'],
            ],
            [
                'api' => $name . 'Edit',
                'name' => '保存' . $db['annotation'],
            ],
            [
                'api' => $name . 'Detail',
                'name' => $db['annotation'] . '详情',
            ],
            [
                'api' => $name . 'Destroy',
                'name' => '删除' . $db['annotation'],
            ]
        ];
        $AuthGroupId = auth('api')->user()->AuthGroup->pluck('id');
        // 获取权限名为工具的权限ID
        $tool = AuthRule::where('title', '工具')->select('id')->first();
        $AuthRules = AuthRule::firstOrCreate([
            'api' => $name,
            'title' => $db['annotation'],
            'pid' => $tool->id,
            'state' => AuthRule::AUTH_RULE_STATE_ON,
            'sort' => 0
        ]);
        foreach ($AuthGroupId as $aid) {
            AuthGroupAuthRule::firstOrCreate([
                'auth_group_id' => $aid,
                'auth_rule_id' => $AuthRules->id,
            ]);
        }
        foreach ($apiArr as $a) {
            $AuthRule = AuthRule::firstOrCreate([
                'api' => $a['api'],
                'title' => $a['name'],
                'pid' => $AuthRules->id,
                'state' => $a['api'] == $name . 'List' ? AuthRule::AUTH_RULE_STATE_ON : AuthRule::AUTH_RULE_STATE_OFF,
                'sort' => 0
            ]);
            foreach ($AuthGroupId as $aid) {
                AuthGroupAuthRule::firstOrCreate([
                    'auth_group_id' => $aid,
                    'auth_rule_id' => $AuthRule->id,
                ]);
            }
        }
    }

    /**
     * 清除权限
     * @param $db
     */
    protected function clearJurisdiction($db)
    {

        $name = $this->convertUnderline(rtrim($db['name'], 's'));
        $AuthRule = AuthRule::where('api', 'like', $name . '%')->get()->pluck('id');
        // 清除已存在的权限
        if ($AuthRule) {
            AuthRule::whereIn('id', $AuthRule)->delete();
            AuthGroupAuthRule::whereIn('auth_rule_id', $AuthRule)->delete();
        }
    }

    /**
     * 生成后台API文件
     * @param $db
     * @param $request
     * @throws \Exception
     */
    protected function createBackstageApi($db, $request)
    {
        $name = $this->convertUnderline(rtrim($db['name'], 's'), true);
        if (count($request->adminTemplate) > 0) {
            foreach ($request->adminTemplate as $c) {
                $path = $this->path . '/admin/' . $c . '/src/api/' . $name . '.js';
                $this->createFile('api.admin.ds', ['/{{ name }}/'], [$name], $path);
                unset($path);
            }
        }


    }

    /**
     * 生成客户端代码
     * @param $db
     * @param $request
     * @throws \Exception
     */
    protected function createClient($db, $request)
    {
        $name = $this->convertUnderline(rtrim($db['name'], 's'), true);
        $client = $request->clientTemplate;
        //获取支持的客户端
        if (count($client) > 0) {
            foreach ($client as $c) {
                $path = $this->path . '/client/' . $c;
                $pages = $path . '/pages/' . $request->abbreviation;
                $structure = explode('/', $c);
                if (count($structure) != 2) {
                    throw new \Exception('前端模板目录结构有误', Code::CODE_INEXISTENCE);
                }
                $pathArr = [$pages, $pages . '/' . $name, $pages . '/' . $name . '/components', $pages . '/' . $name . '/js', $pages . '/' . $name . '/scss'];
                // 生成表对应的目录
                foreach ($pathArr as $p) {
                    if (!file_exists($p)) {
                        mkdir($p, 0777, true);
                    }
                }
                // 生成模板
                $this->createFile('list.client.' . $structure[0] . '.ds', [], [], $pages . '/' . $name . '/list.vue');
                $this->createFile('list.client.' . $structure[0] . '.js.ds', ['/{{ name }}/'], [$name], $pages . '/' . $name . '/js/list.js');
                if (!file_exists($pages . '/' . $name . '/scss/list.scss')) {
                    fopen($pages . '/' . $name . '/scss/list.scss', 'w+');
                }
                $this->createFile('detail.client.' . $structure[0] . '.ds', [], [], $pages . '/' . $name . '/detail.vue');
                $this->createFile('detail.client.' . $structure[0] . '.js.ds', ['/{{ name }}/'], [$name], $pages . '/' . $name . '/js/detail.js');
                if (!file_exists($pages . '/' . $name . '/scss/detail.scss')) {
                    fopen($pages . '/' . $name . '/scss/detail.scss', 'w+');
                }
                $this->createFile('api.client.' . $structure[0] . '.ds', ['/{{ name }}/'], [$name], $path . '/api/' . $name . '.js');
            }
        }
    }

    /**
     * 生成后台代码
     * @param $db
     * @param $request
     * @throws \Exception
     */
    protected function createBackstage($db, $request)
    {
        $name = $this->convertUnderline(rtrim($db['name'], 's'));
        $api = $this->convertUnderline(rtrim($db['name'], 's'), true);
        $admin = $request->adminTemplate;
        if (count($admin) > 0) {
            foreach ($admin as $c) {
                $path = $this->path . '/admin/' . $c . '/src/views/ToolManagement/' . $name;
                $pathArr = [$path, $path . '/components', $path . '/js', $path . '/scss'];
                // 生成表对应的目录
                foreach ($pathArr as $p) {
                    if (!file_exists($p)) {
                        mkdir($p, 0777, true);
                    }
                }
                $list = '';
                $detail = '';
                $ruleForm = '';
                $rules = '';
                foreach ($db['attribute'] as $a) {
                    $annotation = $a['annotation'] ? explode(":", $a['annotation'])[0] : 'ID';
                    $list .= '
      <el-table-column label="' . $annotation . '" prop="' . $a['name'] . '">
        <template slot-scope="scope">
          <span>{{ scope.row.' . $a['name'] . ' }}</span>
        </template>
      </el-table-column>';
                    if ($a['name'] != 'id') {
                        switch ($a['type']) {
                            case 'tinyInteger':
                                $detail .= '
      <el-form-item label="' . $annotation . '" prop="' . $a['name'] . '" style="width:400px;">
        <el-radio-group v-model="ruleForm.' . $a['name'] . '">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>';
                                $rules .= "
        " . $a['name'] . ": [
          { required: true, message: '请选择" . $annotation . "', trigger: 'change' }
        ],";
                                break;
                            case 'smallInteger':
                            case 'mediumInteger':
                            case 'integer':
                            case 'bigInteger':
                                $detail .= '
      <el-form-item label="' . $annotation . '" prop="' . $a['name'] . '" style="width:400px;">
        <el-input v-model="ruleForm.' . $a['name'] . '"' . ($a['length'] > 0 ? ' maxlength="' . $a['length'] . '"' : '') . ' clearable/>
      </el-form-item>';
                                $rules .= "
        " . $a['name'] . ": [
          { required: true, message: '请输入" . $annotation . "', trigger: 'blur' }
        ],";
                                break;
                            case 'timestamp':
                                $detail .= '
      <el-form-item label="' . $annotation . '" prop=".' . $a['name'] . '">
        <el-date-picker
          v-model="ruleForm..' . $a['name'] . '"
          type="date"
          placeholder="选择日期时间"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"/>
      </el-form-item>';
                                $rules .= "
        " . $a['name'] . ": [
          { required: true, message: '请选择" . $annotation . "', trigger: 'change' }
        ],";
                                break;
                            case 'char':
                            case 'string':
                                $detail .= '
      <el-form-item label="' . $annotation . '" prop="' . $a['name'] . '" style="width:400px;">
        <el-input v-model="ruleForm.' . $a['name'] . '"' . ($a['length'] > 0 ? ' maxlength="' . $a['length'] . '"' : '') . ' clearable/>
      </el-form-item>';
                                break;
                            case 'text':
                            case 'mediumText':
                            case 'longText':
                                $detail .= '
      <el-form-item label="' . $annotation . '" prop="' . $a['name'] . '" style="width:400px;">
        <el-input :rows="2" v-model="ruleForm.' . $a['name'] . '"' . ($a['length'] > 0 ? ' maxlength="' . $a['length'] . '"' : '') . ' type="textarea" clearable/>
      </el-form-item>';
                                $rules .= "
        " . $a['name'] . ": [
          { required: true, message: '请输入" . $annotation . "', trigger: 'blur' }
        ],";
                                break;
                        }
                        $ruleForm .= "
        " . $a['name'] . ": '',";
                    }

                }
            }
        }
        // 生成list模板
        $this->createFile('index.admin.ds', [], [], $path . '/index.vue');
        $this->createFile('list.admin.ds', ['/{{ name }}/', '/{{ list }}/'], [$name, $list], $path . '/list.vue');
        $this->createFile('list.admin.js.ds', ['/{{ name }}/', '/{{ api }}/'], [$name, $api], $path . '/js/list.js');
        $this->createFile('list.admin.scss.ds', [], [], $path . '/scss/list.scss');
        // 生成create模板
        $this->createFile('create.admin.ds', ['/{{ name }}/'], [$name], $path . '/create.vue');
        // 生成edit模板
        $this->createFile('edit.admin.ds', ['/{{ name }}/'], [$name], $path . '/edit.vue');
        // 生成detail模板
        $this->createFile('detail.admin.ds', ['/{{ detail }}/'], [$detail], $path . '/components/detail.vue');
        $this->createFile('detail.admin.js.ds', ['/{{ name }}/', '/{{ ruleForm }}/', '/{{ rules }}/', '/{{ api }}/'], [$name, rtrim($ruleForm, ','), rtrim($rules, ','), $api], $path . '/js/detail.js');
    }

    /**
     * 创建文件
     * @param string $template // 模板
     * @param array $find // 查找的内容
     * @param array $replace // 替换内容
     * @param string $name // 生成的文件名
     * @throws \Exception
     */
    protected function createFile($template, $find, $replace, $name)
    {
        // 模板
        $pluginTemplate = $this->pluginPath . '/template/' . $template;
        if (!file_exists($pluginTemplate)) {
            throw new \Exception('缺少' . $template . '文件', Code::CODE_INEXISTENCE);
        }
        // 生成文件
        if (!file_exists($name)) {
            fopen($name, 'w+');
        }
        // 读取模板
        $content = file_get_contents($pluginTemplate);
        if (count($find) > 0) {
            $content = preg_replace($find, $replace, $content);
            $content = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $content);
        }
        file_put_contents($name, $content);
    }

    /**
     * 创建路由
     * @param $request
     * @param bool $edit // 是否更新
     */
    protected function createRoutes($request, $edit = false)
    {
        if ($request->db) {
            $targetPath = $this->path . '/api/routes/plugin.php';

            $langPath = $this->path . '/api/resources/lang/zn/route.php';
            $providerPath = $this->path . '/api/app/Providers/AppServiceProvider.php';
            $file_get_lang_contents = file_get_contents($langPath);
            $file_get_contents = file_get_contents($targetPath);
            //去除已存在的插件代码
            $file_get_contents = preg_replace('/\/\/' . $request->name . '_s(.*?)\/\/' . $request->name . '_e/is', '', $file_get_contents);
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            // 去除已存在的观察者插件代码
            $provider_file_get_contents = file_get_contents($providerPath);
            $provider_file_get_contents = preg_replace('/\/\/ ' . $request->name . '_s(.*?)\/\/ ' . $request->name . '_e/is', '', $provider_file_get_contents);
            $provider_file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $provider_file_get_contents);
            // 生成路由
            $routes = "";
            $routesLang = "";
            $clientRoutes = "";
            $clientRoutesLang = "";
            $providerRoutes = "";
            $permissionRoutes = "";
            if ($request->db) {
                foreach ($request->db as $db) {
                    if (!$db['jurisdiction']) {  //当开启生成权限时才执行
                        continue;
                    }
                    /*if ($edit && !$db['reset']) {  //当更新且重置不开启时
                        continue;
                    }*/
                    $name = $this->convertUnderline(rtrim($db['name'], 's'), true);
                    $names = $this->convertUnderline($name);
                    $routes .= "
        Route::get('$name', '" . $names . "Controller@list')->name('admin." . $name . "List')->middleware(['permissions:" . $names . "List']);    //" . $db['annotation'] . "列表
        Route::get('$name/{id}', '" . $names . "Controller@detail')->name('admin." . $name . "Detail')->middleware(['permissions:" . $names . "Detail']);    //" . $db['annotation'] . "详情
        Route::post('$name', '" . $names . "Controller@create')->name('admin." . $name . "Create')->middleware(['permissions:" . $names . "Create']);    //创建" . $db['annotation'] . "
        Route::post('$name/{id}', '" . $names . "Controller@edit')->name('admin." . $name . "Edit')->middleware(['permissions:" . $names . "Edit']);    //保存" . $db['annotation'] . "
        Route::post('$name/destroy/{id}', '" . $names . "Controller@destroy')->name('admin." . $name . "Destroy')->middleware(['permissions:" . $names . "Destroy']);    //删除" . $db['annotation'] . "
        ";
                    $routesLang .= "
        '" . $name . "List'=>'" . $db['annotation'] . "列表',
        '" . $name . "Detail'=>'" . $db['annotation'] . "详情',
        '" . $name . "Create'=>'创建" . $db['annotation'] . "',
        '" . $name . "Edit'=>'保存" . $db['annotation'] . "',
        '" . $name . "Destroy'=>'删除" . $db['annotation'] . "',
            ";
                    $clientRoutes .= "
        Route::get('$name', '" . $names . "Controller@list')->name('client." . $name . "List');    //" . $db['annotation'] . "列表
        Route::get('$name/{id}', '" . $names . "Controller@detail')->name('client." . $name . "Detail');    //" . $db['annotation'] . "详情
        ";
                    $clientRoutesLang .= "
        '" . $name . "List'=>'" . $db['annotation'] . "列表',
        '" . $name . "Detail'=>'" . $db['annotation'] . "详情',
            ";
                    $permissionRoutes .= "
  " . $names . ": () => import('@/views/ToolManagement/" . $names . "/index'),
  " . $names . "List: () => import('@/views/ToolManagement/" . $names . "/list'),
  " . $names . "Create: () => import('@/views/ToolManagement/" . $names . "/create'),
  " . $names . "Edit: () => import('@/views/ToolManagement/" . $names . "/edit'),
        ";
                }
            }
            // 观察者生成
            if ($request->observer) {
                foreach ($request->observer as $observer) {
                    $providerRoutes .= '
        \App\Models\v' . config('dsshop.versions') . '\\' . $observer['models'] . '::observe(\App\Observers\\' . $observer['models'] . '\\' . $this->convertUnderline($observer['name']) . 'Observer::class);
                    ';
                }
            }
            $admin = $request->adminTemplate;
            if (count($admin) > 0) {
                foreach ($admin as $c) {
                    $permissionPath = $this->path . '/admin/' . $c . '/src/store/modules/permission.js';
                    $permission_file_get_contents = file_get_contents($permissionPath);
                    //去除已存在的插件代码
                    $permission_file_get_contents = preg_replace('/\/\/ ' . $request->name . '_s(.*?)\/\/ ' . $request->name . '_e/is', '', $permission_file_get_contents);
                    $permission_file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $permission_file_get_contents);
                    // 前端
                    $metadata = str_replace("插件列表", $request->name . "_s
  " . $permissionRoutes . "
  // " . $request->name . "_e
  // 插件列表", $permission_file_get_contents);
                    $content = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $metadata);
                    file_put_contents($permissionPath, $content);
                    unset($content);
                    unset($permissionPath);
                    unset($permission_file_get_contents);
                }
            }
            // 后端
            $file_get_contents = str_replace("前台插件列表", $request->name . "_s
        " . $routes . "
        //" . $request->name . "_e
        //前台插件列表", $file_get_contents);
            $file_get_contents = str_replace("APP验证插件列表", $request->name . "_s
        //" . $request->name . "_e
        //APP验证插件列表", $file_get_contents);
            $file_get_contents = str_replace("APP无需验证插件列表", $request->name . "_s
        " . $clientRoutes . "
        //" . $request->name . "_e
        //APP无需验证插件列表", $file_get_contents);
            $content = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            file_put_contents($targetPath, $content);
            unset($content);
            // 路由语言包
            //去除已存在的插件代码
            $file_get_lang_contents = preg_replace('/\/\/' . $request->name . '_s(.*?)\/\/' . $request->name . '_e/is', '', $file_get_lang_contents);
            $file_get_lang_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_lang_contents);
            $file_get_lang_contents = str_replace("admin插件", $request->name . "_s
        " . $routesLang . "
        // " . $request->name . "_e
        // admin插件", $file_get_lang_contents);
            $file_get_lang_contents = str_replace("client插件", $request->name . "_s
        " . $clientRoutesLang . "
        // " . $request->name . "_e
        // client插件", $file_get_lang_contents);
            $content = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_lang_contents);
            file_put_contents($langPath, $content);
            unset($content);
            // 观察者
            $provider_file_get_contents = str_replace("插件", $request->name . "_s
        " . $providerRoutes . "
        // " . $request->name . "_e
        // 插件", $provider_file_get_contents);
            $content = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $provider_file_get_contents);
            file_put_contents($providerPath, $content);
            unset($content);
        }
    }

    /**
     * 移除路由
     * @param $name
     * @param $request
     */
    protected function removeRoutes($name, $request)
    {
        $targetPath = $this->path . '/api/routes/plugin.php';
        $langPath = $this->path . '/api/resources/lang/zn/route.php';
        $providerPath = $this->path . '/api/app/Providers/AppServiceProvider.php';
        $file_get_contents = file_get_contents($targetPath);
        //去除已存在的插件代码
        $file_get_contents = preg_replace('/\/\/' . $name . '_s(.*?)\/\/' . $name . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);

        $admin = $request['adminTemplate'];
        if (count($admin) > 0) {
            foreach ($admin as $c) {
                $permissionPath = $this->path . '/admin/' . $c . '/src/store/modules/permission.js';
                $permission_file_get_contents = file_get_contents($permissionPath);
                //去除已存在的插件代码
                $permission_file_get_contents = preg_replace('/\/\/ ' . $name . '_s(.*?)\/\/ ' . $name . '_e/is', '', $permission_file_get_contents);
                $permission_file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $permission_file_get_contents);
                file_put_contents($permissionPath, $permission_file_get_contents);
            }
        }

        //去除已存在的插件代码
        $file_get_lang_contents = file_get_contents($langPath);
        $file_get_lang_contents = preg_replace('/\/\/ ' . $name . '_s(.*?)\/\/ ' . $name . '_e/is', '', $file_get_lang_contents);
        $file_get_lang_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_lang_contents);
        // 去除已存在的观察者插件代码
        $provider_file_get_contents = file_get_contents($providerPath);
        $provider_file_get_contents = preg_replace('/\/\/ ' . $name . '_s(.*?)\/\/ ' . $name . '_e/is', '', $provider_file_get_contents);
        $provider_file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $provider_file_get_contents);

        file_put_contents($targetPath, $file_get_contents);

        file_put_contents($langPath, $file_get_lang_contents);
        file_put_contents($providerPath, $provider_file_get_contents);
    }

    /**
     * 删除文件
     * @param $path
     */
    protected function fileDestroy($path)
    {
        if (!is_dir($path) && file_exists($path)) {
            unlink($path);
        }
    }

    /**
     * 拷贝目录下文件到指定目录下，没有目录则创建
     * @param $file
     * @param string $target //目标目录
     * @throws \Exception
     */
    protected function filePackageDeployment($file, $target)
    {
        if (!file_exists($target)) {
            if (file_exists($file)) {
                $this->makeDirByPath(dirname($target));
                copy($file, $target);
            }
        }
    }


    /**
     * 根绝文件路径创建对应的目录
     *
     * @param string $path a/b/c/d/
     *
     */
    protected function makeDirByPath($path)
    {
        if (!file_exists($path)) {
            $this->makeDirByPath(dirname($path));
            mkdir($path, 0777);
        }
    }


    /**
     * 拷贝目录下所有文件到指定目录下，没有目录则创建
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

    /**
     * 删除目录及目录下所有文件或删除指定文件
     * @param string $path 待删除目录路径
     * @param bool $delDir 是否删除目录，1或true删除目录，0或false则只删除文件保留目录（包含子目录）
     * @return bool 返回删除状态
     */
    protected function delDirAndFile($path, $delDir = FALSE)
    {
        if (is_dir($path)) {
            $handle = opendir($path);
            if ($handle) {
                while (false !== ($item = readdir($handle))) {
                    if ($item != "." && $item != "..")
                        is_dir("$path/$item") ? $this->delDirAndFile("$path/$item", $delDir) : unlink("$path/$item");
                }
                closedir($handle);
                if ($delDir)
                    return rmdir($path);
            } else {
                if (file_exists($path)) {
                    return unlink($path);
                } else {
                    return FALSE;
                }
            }
        }
    }

    /**
     * 创建插件配置文件
     * @param $request
     */
    protected function createPlugInJson($request)
    {
        // 创建插件目录
        $path = $this->pluginListPath . '/' . $request->abbreviation;
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }
        // 创建插件数据
        if (!file_exists($path . '/dsshop.json')) {
            fopen($path . '/dsshop.json', 'w+');
        }
        $json = [
            'name' => $request->name,
            'abbreviation' => $request->abbreviation,
            'describe' => $request->describe,
            'instructions' => $request->instructions,
            'versions' => $request->versions,
            'author' => $request->author,
            'local' => true,
            'clientTemplate' => $request->clientTemplate,
            'adminTemplate' => $request->adminTemplate,
            'packagingJurisdiction' => $request->packagingJurisdiction,
            'db' => $request->db,
            'observer' => $request->observer,
            'relevance' => $request->relevance,
            'routes' => $request->routes
        ];
        file_put_contents($path . '/dsshop.json', json_encode($json));
    }

    /**
     * 更新插件配置文件
     * @param $request
     * @throws \Exception
     */
    protected function editPlugInJson($request)
    {
        // 插件目录
        $path = $this->pluginListPath . '/' . $request->abbreviation . '/dsshop.json';
        if ($request->relevance) {
            foreach ($request->relevance as $relevance) {
                if (!file_exists($this->path . $relevance['file'])) {
                    throw new \Exception('关联文件不存在' . $relevance['file'], Code::CODE_INEXISTENCE);
                }
            }
        }
        $json = [
            'name' => $request->name,
            'abbreviation' => $request->abbreviation,
            'describe' => $request->describe,
            'instructions' => $request->instructions,
            'versions' => $request->versions,
            'author' => $request->author,
            'local' => true,
            'clientTemplate' => $request->clientTemplate,
            'adminTemplate' => $request->adminTemplate,
            'packagingJurisdiction' => $request->packagingJurisdiction,
            'db' => $request->db,
            'observer' => $request->observer,
            'relevance' => $request->relevance,
            'routes' => $request->routes
        ];
        file_put_contents($path, json_encode($json));
    }

    /**
     * 生成数据表对应的验证器
     * @param $db
     * @throws \Exception
     */
    protected function createRequests($db)
    {
        // 模板
        $controller = $this->pluginPath . '/template/requests.api.ds';
        // 控制器名称为去掉尾部s每个单词首字母大写
        $name = $this->convertUnderline(rtrim($db['name'], 's'));
        // 控制器文件
        $path = $this->path . '/api/app/Http/Requests/v' . config('dsshop.versions') . '/Submit' . $name . 'Request.php';
        if (!file_exists($controller)) {
            throw new \Exception('缺少requests.api.ds文件', Code::CODE_INEXISTENCE);
        }
        // 生成控制器
        if (!file_exists($path)) {
            fopen($path, 'w+');
        }
        $content = file_get_contents($controller);
        $rule = '';
        $ruleHint = '';
        $content = preg_replace([
            '/{{ versions }}/',
            '/{{ name }}/'
        ], [
            config('dsshop.versions'),
            $name
        ], $content);
        $content = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $content);
        file_put_contents($path, $content);
    }

    /**
     * 生成数据表对应的模型
     * @param $db
     * @throws \Exception
     */
    protected function createModels($db)
    {
        // 模板
        $controller = $this->pluginPath . '/template/models.api.ds';
        // 控制器名称为去掉尾部s首字母大写
        $name = $this->convertUnderline(rtrim($db['name'], 's'));
        // 控制器文件
        $path = $this->path . '/api/app/Models/v' . config('dsshop.versions') . '/' . $name . '.php';
        if (!file_exists($controller)) {
            throw new \Exception('缺少models.api.ds文件', Code::CODE_INEXISTENCE);
        }
        // 生成控制器
        if (!file_exists($path)) {
            fopen($path, 'w+');
        }
        $content = file_get_contents($controller);
        $property = '';
        $constant = '';
        $SoftDeletes = $db['softDeletes'] ? 'use Illuminate\Database\Eloquent\SoftDeletes;' : '';
        $SoftDeletesUse = $db['softDeletes'] ? 'use SoftDeletes;' : '';
        foreach ($db['attribute'] as $a) {
            $property .= '
 * @property ' . $this->casting[$a['type']] . ' ' . $a['name'] . '';
            // 生成常量
            $annotation = explode(":", $a['annotation']);
            if (count($annotation) == 2) {
                $annotationValue = explode(",", $annotation[1]);
                if (!$annotationValue[0]) {
                    throw new \Exception('表注释格式有误":"', Code::CODE_INEXISTENCE);
                }
                foreach ($annotationValue as $value) {
                    $annotationValueData = explode('=', $value);
                    if (count($annotationValueData) != 2) {
                        throw new \Exception('表注释格式有误"="', Code::CODE_INEXISTENCE);
                    }
                    $annotationValueDataExplain = explode('-', $annotationValueData[1]);
                    if (count($annotationValueDataExplain) != 2) {
                        throw new \Exception('表注释格式有误"-"', Code::CODE_INEXISTENCE);
                    }
                    $constant .= '
    const ' . strtoupper(rtrim($db['name'], 's')) . '_' . strtoupper($a['name']) . '_' . strtoupper($annotationValueDataExplain[1]) . ' = ' . $annotationValueData[0] . '; //' . $annotation[0] . ':' . $annotationValueDataExplain[0] . '
            ';
                }
            }
        }

        $content = preg_replace([
            '/{{ versions }}/',
            '/{{ constant }}/',
            '/{{ name }}/',
            '/{{ SoftDeletes }}/',
            '/{{ SoftDeletesUse }}/',
            '/{{ property }}/'
        ], [
            config('dsshop.versions'),
            $constant,
            $name,
            $SoftDeletes,
            $SoftDeletesUse,
            $property
        ], $content);
        $content = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $content);
        file_put_contents($path, $content);
    }

    /**
     * 生成数据表对应的控制器
     * @param $db
     * @param $type //admin:后台 or client：客户端
     * @throws \Exception
     */
    protected function createController($db, $type = 'admin')
    {
        // 模板
        $controller = $this->pluginPath . '/template/controller.api.' . $type . '.ds';
        // 控制器名称为去掉尾部s首字母大写
        $name = $this->convertUnderline(rtrim($db['name'], 's'));
        // 控制器文件
        $path = $this->path . '/api/app/Http/Controllers/v' . config('dsshop.versions') . '/Plugin/' . $this->convertUnderline($type) . '/' . $name . 'Controller.php';
        if (!file_exists($controller)) {
            throw new \Exception('缺少controller.api.' . $type . '.ds文件', Code::CODE_INEXISTENCE);
        }
        // 生成控制器
        if (!file_exists($path)) {
            fopen($path, 'w+');
        }
        $content = file_get_contents($controller);
        $attribute = '';
        $queryParam = '';
        if ($type === 'admin') {
            foreach ($db['attribute'] as $a) {
                $attribute .= '
            $' . $this->convertUnderline(rtrim($db['name'], 's')) . '->' . $a['name'] . ' = $request->' . $a['name'] . ';';
                $queryParam .= '
     * @queryParam  ' . $a['name'] . ' ' . $this->casting[$a['type']] . ' ' . $a['annotation'] . '';
            }
            $content = preg_replace([
                '/{{ versions }}/',
                '/{{ name }}/',
                '/{{ annotation }}/',
                '/{{ attribute }}/',
                '/{{ queryParam }}/',
            ], [
                config('dsshop.versions'),
                $name,
                $db['annotation'],
                $attribute,
                $queryParam,
            ], $content);
        } else {  // 客户端
            $content = preg_replace([
                '/{{ versions }}/',
                '/{{ name }}/',
                '/{{ annotation }}/'
            ], [
                config('dsshop.versions'),
                $name,
                $db['annotation']
            ], $content);
        }
        $content = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $content);
        file_put_contents($path, $content);
    }

    /**
     * 生成插件所需目录
     */
    protected function generatePlugInDirectory()
    {
        $path = $this->path . '/api/app/Http/Controllers/v' . config('dsshop.versions');
        $pathArr = [
            $path . '/Plugin',
            $path . '/Plugin/Admin',
            $path . '/Plugin/Client'
        ];
        foreach ($pathArr as $p) {
            if (!file_exists($p)) {
                mkdir($p, 0777, true);
            }
        }
    }

    /**
     * 生成数据库迁移文件
     * @param $db
     * @param $reset //是否重置
     * @throws \Exception
     */
    protected function createDBMigration($db, $reset = false)
    {
        //读取生成的文件内容
        $getLocalMigrations = $this->getLocalMigrations('create_' . $db['name'] . '_table');
        if (!$getLocalMigrations) {
            if (!$reset) {
                throw new \Exception($db['name'] . '表已经存在，无法创建', Code::CODE_INEXISTENCE);
            }
            if (!file_exists($this->pluginPath . '/template/migration.create.ds')) {
                throw new \Exception('缺少migration.create.ds文件', Code::CODE_INEXISTENCE);
            }
            $getLocalMigrations = date("Y") . '_' . date("m") . '_' . date("d") . '_' . date("His") . '_create_' . $db['name'] . '_table.php';
            fopen($this->migrationsPath . '/' . $getLocalMigrations, 'w+');
        }
        $content = file_get_contents($this->pluginPath . '/template/migration.create.ds');
        // 填充数据库迁移表内容
        $newContent = '';
        foreach ($db['attribute'] as $attribute) {
            $length = '';
            // 如果字段存在ID，则直接添加主键
            if ($attribute['name'] == 'id') {
                $newContent .= "
            \$table->id();";
            } else {
                // 类型
                $attribute_type = $attribute['type'];
                $unsigned_type = ['tinyInteger', 'smallInteger', 'mediumInteger', 'integer', 'bigInteger'];
                // 当设置了UNSIGNED，且字段支持UNSIGNED
                if ($attribute['attribute'] == 'UNSIGNED' && in_array($attribute['type'], $unsigned_type)) {
                    $attribute_type = 'unsigned' . $this->convertUnderline($attribute_type);
                }
                // 当设置了长度，且字段支持长度设置时
                $length = '';
                $length_type = ['char', 'string'];
                if (in_array($attribute['type'], $length_type)) {
                    $length = ',' . $attribute['length'];
                }
                $attribute_default = '';
                if (isset($attribute['default'])) {
                    $attribute_default = '->default(\'' . $attribute['default'] . '\')';
                }
                $attribute_nullable = $attribute['is_empty'] ? '->nullable()' : '';
                $newContent .= "
            \$table->$attribute_type('" . $attribute['name'] . "'" . $length . ")" . $attribute_default . $attribute_nullable . "->comment('" . $attribute['annotation'] . "');";
            }
        }
        if ($db['softDeletes'] == 1) {
            $newContent .= "
            \$table->softDeletes();";
        }
        if ($db['timestamps'] == 1) {
            $newContent .= "
            \$table->timestamps();";
        }
        $content = preg_replace([
            '/{{ class }}/',
            '/{{ table }}/',
            '/{{ field }}/',
            '/{{ annotation }}/',
        ], [
            "Create" . $this->convertUnderline($db['name']) . "Table",
            $db['name'],
            $newContent,
            $db['annotation'],
        ], $content);
        $content = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $content);
        file_put_contents($this->migrationsPath . '/' . $getLocalMigrations, $content);
    }

    /**
     * 获取本地数据库迁移文件列表
     * @param $table
     * @param bool $is_arr //是否返回数据
     * @return void
     */
    protected function getLocalMigrations($table, $is_arr = false)
    {
        if ($is_arr) {
            $return = [];
        } else {
            $return = '';
        }
        foreach ($this->migrations as $d) {
            if (strstr($d, $table)) {
                if ($is_arr) {
                    $return[] = $d;
                } else {
                    $return = $d;
                    break;
                }
            }
        }
        return $return;
    }

    /**
     * 将下划线命名转换为驼峰式命名
     * @param $str
     * @param bool $lcfirst true第一个字母小写
     * @return mixed|string
     */
    protected function convertUnderline($str, $lcfirst = false)
    {
        $str = ucwords(str_replace('_', ' ', $str));
        $str = str_replace(' ', '', $lcfirst ? lcfirst($str) : $str);
        return $str;
    }
}
