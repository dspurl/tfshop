<?php

namespace App\common;

use App\Code;
use App\Models\v1\AuthGroupAuthRule;
use App\Models\v1\AuthRule;
use Illuminate\Http\Request;

class Plugin
{
    private $pluginPath;
    private $path;
    private $migrations;
    private $migrationsPath;
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
        $this->migrationsPath = $this->path . '/api/database/migrations';
        $this->migrations = scandir($this->migrationsPath);
    }

    /**
     * 获取本地插件列表
     */
    public function getLocalPlugin()
    {
        $data = scandir($this->pluginPath);
        $list = [];
        $json_dsshop = json_decode(file_get_contents($this->pluginPath . '/dsshop.json'), true);
        foreach ($data as $value) {
            if ($value != '.' && $value != '..' && $value != 'dsshop.json' && $value != 'template') {
                $dsshop = json_decode(file_get_contents($this->pluginPath . '/' . $value . '/dsshop.json'), true);
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
     */
    public function template()
    {
        $data = scandir($this->path . '/client');
        $return = [];
        foreach ($data as $value) {
            if ($value != '.' && $value != '..') {
                $catalogue = $this->path . '/client/' . $value;
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
        if (file_exists($this->pluginPath . '/' . $request->abbreviation . '/dsshop.json')) {
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
                }
                // 生成后端代码
                if ($db['after_end']) {
                    $this->createController($db, 'admin');
                    $this->createController($db, 'client');
                    $this->createModels($db);
                    $this->createRequests($db);
                }
                // 生成后台代码
                if ($db['backstage']) {
                    $this->createBackstage($db);
                    $this->createBackstageApi($db);
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
                $this->createObserver($observer);
            }
        }
        if ($request->db) {
            foreach ($request->db as $db) {
                // 生成后端代码且开启重置
                if ($db['reset']) {
                    if ($db['data_table']) {
                        $this->createDBMigration($db, $db['reset']);
                    }
                    if ($db['after_end']) {
                        $this->createController($db, 'admin');
                        $this->createController($db, 'client');
                        $this->createModels($db);
                        $this->createRequests($db);
                    }
                    // 生成后台代码
                    if ($db['backstage']) {
                        $this->createBackstage($db);
                        $this->createBackstageApi($db);
                    }
                    // 生成权限
                    if ($db['jurisdiction']) {
                        $this->createJurisdiction($db);
                    }
                }
            }
        }
        $this->createRoutes($request);
        return '更新成功';
    }

    /**
     * 删除插件
     * @param $name
     * @return string
     */
    public function destroy($name)
    {
        if (file_exists($this->pluginPath . '/' . $name . '/dsshop.json')) {
            $path = json_decode(file_get_contents($this->pluginPath . '/' . $name . '/dsshop.json'), true);
            if ($path['db']) {
                foreach ($path['db'] as $db) {
                    $names = $this->convertUnderline(rtrim($db['name'], 's'));
                    $n = $this->convertUnderline(rtrim($db['name'], 's'), true);
                    $this->fileDestroy($this->migrationsPath . '/' . $this->getLocalMigrations('create_' . $db['name'] . '_table'));
                    $this->fileDestroy($this->path . '/api/app/Http/Controllers/v' . config('dsshop.versions') . '/Plugin/Admin/' . $names . 'Controller.php');
                    $this->fileDestroy($this->path . '/api/app/Http/Controllers/v' . config('dsshop.versions') . '/Plugin/Client/' . $names . 'Controller.php');
                    $this->fileDestroy($this->path . '/api/app/Models/v' . config('dsshop.versions') . '/' . $names . '.php');
                    $this->fileDestroy($this->path . '/api/app/Http/Requests/v' . config('dsshop.versions') . '/Submit' . $names . 'Request.php');
                    $this->delDirAndFile($this->path . '/admin/src/views/ToolManagement/' . $names, true);
                    $this->fileDestroy($this->path . '/admin/src/api/' . $n . '.js');
                    $this->clearJurisdiction($db);
                }
            }
            if ($path['observer']) {
                foreach ($path['observer'] as $observer) {
                    $this->removeObserver($observer);
                }
            }
            $this->fileDestroy($this->pluginPath . '/' . $name . '/dsshop.json');
            $this->catalogueDestroy($this->pluginPath . '/' . $name);
            $this->removeRoutes($path['name']);
            return '删除成功';
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
                throw new \Exception('可执行路由格式错误', Code::CODE_INEXISTENCE);
            }
            $route .= "
        '" . 'app' . $routeName[1] . "',
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
        $this->clearJurisdiction($db);
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
        foreach ($apiArr as $a) {
            $AuthRule = new AuthRule();
            $AuthRule->api = $a['api'];
            $AuthRule->title = $a['name'];
            $AuthRule->pid = 23;
            $AuthRule->state = $a['api'] == $name . 'List' ? 1 : 0;
            $AuthRule->sort = 0;
            $AuthRule->save();
            $AuthGroupId = auth('api')->user()->AuthGroup->pluck('id');
            foreach ($AuthGroupId as $aid) {
                AuthGroupAuthRule::insert([
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
     * @throws \Exception
     */
    protected function createBackstageApi($db)
    {
        $name = $this->convertUnderline(rtrim($db['name'], 's'), true);
        $path = $this->path . '/admin/src/api/' . $name . '.js';
        $this->createFile('api.admin.ds', ['/{{ name }}/'], [$name], $path);
    }

    /**
     * 生成后台代码
     * @param $db
     * @throws \Exception
     */
    protected function createBackstage($db)
    {
        $name = $this->convertUnderline(rtrim($db['name'], 's'));
        $api = $this->convertUnderline(rtrim($db['name'], 's'), true);
        $path = $this->path . '/admin/src/views/ToolManagement/' . $name;
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
        // 生成list模板
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
     */
    protected function createRoutes($request)
    {
        if ($request->db) {
            $targetPath = $this->path . '/api/routes/plugin.php';
            $permissionPath = $this->path . '/admin/src/store/modules/permission.js';
            $langPath = $this->path . '/api/resources/lang/zn/route.php';
            $file_get_lang_contents = file_get_contents($langPath);
            $file_get_contents = file_get_contents($targetPath);
            //去除已存在的插件代码
            $file_get_contents = preg_replace('/\/\/' . $request->name . '_s(.*?)\/\/' . $request->name . '_e/is', '', $file_get_contents);
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            $permission_file_get_contents = file_get_contents($permissionPath);
            //去除已存在的插件代码
            $permission_file_get_contents = preg_replace('/\/\/ ' . $request->name . '_s(.*?)\/\/ ' . $request->name . '_e/is', '', $permission_file_get_contents);
            $permission_file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $permission_file_get_contents);
            // 生成路由
            $routes = "";
            $routesLang = "";
            $clientRoutes = "";
            $clientRoutesLang = "";
            $permissionRoutes = "";
            foreach ($request->db as $db) {
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
  " . $names . "List: () => import('@/views/ToolManagement/" . $names . "/list'),
  " . $names . "Create: () => import('@/views/ToolManagement/" . $names . "/create'),
  " . $names . "Edit: () => import('@/views/ToolManagement/" . $names . "/edit'),
        ";
            }
            // 后端
            $file_get_contents = str_replace("前台插件列表", $request->name . "_s
        " . $routes . "
        //" . $request->name . "_e
        //前台插件列表", $file_get_contents);
            $file_get_contents = str_replace("APP无需验证插件列表", $request->name . "_s
        " . $clientRoutes . "
        //" . $request->name . "_e
        //APP无需验证插件列表", $file_get_contents);
            $content = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            file_put_contents($targetPath, $content);
            unset($content);
            // 路由语言包
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

            // 前端
            $metadata = str_replace("插件列表", $request->name . "_s
  " . $permissionRoutes . "
  // " . $request->name . "_e
  // 插件列表", $permission_file_get_contents);
            $content = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $metadata);
            file_put_contents($permissionPath, $content);
        }
    }

    /**
     * 移除路由
     * @param $name
     */
    protected function removeRoutes($name)
    {
        $targetPath = $this->path . '/api/routes/plugin.php';
        $permissionPath = $this->path . '/admin/src/store/modules/permission.js';
        $langPath = $this->path . '/api/resources/lang/zn/route.php';
        $file_get_contents = file_get_contents($targetPath);

        //去除已存在的插件代码
        $file_get_contents = preg_replace('/\/\/' . $name . '_s(.*?)\/\/' . $name . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
        $permission_file_get_contents = file_get_contents($permissionPath);
        //去除已存在的插件代码
        $permission_file_get_contents = preg_replace('/\/\/ ' . $name . '_s(.*?)\/\/ ' . $name . '_e/is', '', $permission_file_get_contents);
        $permission_file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $permission_file_get_contents);
        //去除已存在的插件代码
        $file_get_lang_contents = file_get_contents($langPath);
        $file_get_lang_contents = preg_replace('/\/\/ ' . $name . '_s(.*?)\/\/ ' . $name . '_e/is', '', $file_get_lang_contents);
        $file_get_lang_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_lang_contents);
        file_put_contents($targetPath, $file_get_contents);
        file_put_contents($permissionPath, $permission_file_get_contents);
        file_put_contents($langPath, $file_get_lang_contents);
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
     * 删除目录
     * @param $path
     */
    protected function catalogueDestroy($path)
    {
        if (is_dir($path)) {
            rmdir($path);
        }
    }

    /**
     * 插件详情
     * @param $name
     * @return string
     */
    public function details($name)
    {
        $path = $this->pluginPath . '/' . $name . '/dsshop.json';
        return json_decode(file_get_contents($path));
    }

    /**
     * 安装和更新插件
     * @param $name //插件简称
     * @return string
     */
    public function autoPlugin($name)
    {
        $routes = $this->pluginPath . '/' . $name . '/routes.json';
        $dsshop = $this->pluginPath . '/' . $name . '/dsshop.json';
        if (!file_exists($routes)) {
            return resReturn(0, '插件缺少routes.json文件', Code::CODE_WRONG);
        }
        if (!file_exists($dsshop)) {
            return resReturn(0, '插件缺少dsshop.json文件', Code::CODE_WRONG);
        }
        $dsshop = json_decode(file_get_contents($dsshop), true);
        // 文件自动部署
        $this->fileDeployment($this->pluginPath . '/' . $name . '/admin/api', $this->path . '/admin/src/api');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/admin/views/' . $this->convertUnderline($name), $this->path . '/admin/src/views/ToolManagement/' . $this->convertUnderline($name));
        $this->fileDeployment($this->pluginPath . '/' . $name . '/api/config', $this->path . '/api/config');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/api/console', $this->path . '/api/app/Console/Commands');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/api/models', $this->path . '/api/app/Models/v' . config('dsshop.versions'));
        $this->fileDeployment($this->pluginPath . '/' . $name . '/api/plugin', $this->path . '/api/app/Http/Controllers/v' . config('dsshop.versions') . '/Plugin');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/api/requests', $this->path . '/api/app/Http/Requests/v' . config('dsshop.versions'));
        $this->fileDeployment($this->pluginPath . '/' . $name . '/api/observers', $this->path . '/api/app/Observers');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/database', $this->path . '/api/database/migrations');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/uniApp/api', $this->path . '/client/Dsshop/api');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/uniApp/components', $this->path . '/client/Dsshop/components');
        $this->fileDeployment($this->pluginPath . '/' . $name . '/uniApp/pages', $this->path . '/client/Dsshop/pages');
        // 路由自动部署
        $routes = json_decode(file_get_contents($routes), true);
        // api
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
            $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            // 添加新的插件代码
            $metadata = str_replace("插件列表", $dsshop['name'] . "_s
  " . $routes['permission'] . "
  // " . $dsshop['name'] . "_e
  // 插件列表", $file_get_contents);
            file_put_contents($targetPath, $metadata);
            unset($targetPath);
            unset($file_get_contents);
            unset($metadata);
        }
        // uni-app
        if (array_key_exists('uniApp', $routes)) {
            $targetPath = $this->path . '/client/Dsshop/pages.json';
            $file_get_contents = file_get_contents($targetPath);
            //去除已存在的插件代码
            $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
            $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
            // 添加新的插件代码
            $metadata = str_replace("插件列表", $dsshop['name'] . "_s
		" . $routes['uniApp'] . "
		// " . $dsshop['name'] . "_e
		// 插件列表", $file_get_contents);
            file_put_contents($targetPath, $metadata);
            unset($targetPath);
            unset($file_get_contents);
            unset($metadata);
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
        $dsshop = $this->pluginPath . '/' . $name . '/dsshop.json';
        if (!file_exists($routes)) {
            return resReturn(0, '插件缺少routes.json文件', Code::CODE_WRONG);
        }
        if (!file_exists($dsshop)) {
            return resReturn(0, '插件缺少dsshop.json文件', Code::CODE_WRONG);
        }
        $dsshop = json_decode(file_get_contents($dsshop), true);
        $json_dsshop = json_decode(file_get_contents($this->pluginPath . '/dsshop.json'), true);
        //去除uni-app路由
        $targetPath = $this->path . '/client/Dsshop/pages.json';
        $file_get_contents = file_get_contents($targetPath);
        $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
        file_put_contents($targetPath, $file_get_contents);
        unset($targetPath);
        unset($file_get_contents);
        //去除API路由
        $targetPath = $this->path . '/api/routes/plugin.php';
        $file_get_contents = file_get_contents($targetPath);
        //去除已存在的插件代码
        $file_get_contents = preg_replace('/\/\/' . $dsshop['name'] . '_s(.*?)\/\/' . $dsshop['name'] . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
        file_put_contents($targetPath, $file_get_contents);
        unset($targetPath);
        unset($file_get_contents);
        //去除observers注册代码
        $targetPath = $this->path . '/api/app/Providers/AppServiceProvider.php';
        $file_get_contents = file_get_contents($targetPath);
        //去除已存在的插件代码
        $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
        file_put_contents($targetPath, $file_get_contents);
        unset($targetPath);
        unset($file_get_contents);
        // 去除微信公众号模板消息
        $targetPath = $this->path . '/api/app/Channels/WechatChannel.php';
        $file_get_contents = file_get_contents($targetPath);
        //去除已存在的插件代码
        $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
        file_put_contents($targetPath, $file_get_contents);
        unset($targetPath);
        unset($file_get_contents);
        //去除后台路由
        $targetPath = $this->path . '/admin/src/store/modules/permission.js';
        $file_get_contents = file_get_contents($targetPath);
        //去除已存在的插件代码
        $file_get_contents = preg_replace('/\/\/ ' . $dsshop['name'] . '_s(.*?)\/\/ ' . $dsshop['name'] . '_e/is', '', $file_get_contents);
        $file_get_contents = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_get_contents);
        file_put_contents($targetPath, $file_get_contents);
        unset($targetPath);
        unset($file_get_contents);
        $this->fileUninstall($this->pluginPath . '/' . $name . '/admin/api', $this->path . '/admin/src/api');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/admin/views/' . $this->convertUnderline($name), $this->path . '/admin/src/views/ToolManagement/' . $this->convertUnderline($name));
        $this->fileUninstall($this->pluginPath . '/' . $name . '/api/config', $this->path . '/api/config');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/api/console', $this->path . '/api/app/Console/Commands');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/api/models', $this->path . '/api/app/Models/v' . config('dsshop.versions'));
        $this->fileUninstall($this->pluginPath . '/' . $name . '/api/plugin', $this->path . '/api/app/Http/Controllers/v' . config('dsshop.versions') . '/Plugin');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/api/requests', $this->path . '/api/app/Http/Requests/v' . config('dsshop.versions'));
        $this->fileUninstall($this->pluginPath . '/' . $name . '/api/observers', $this->path . '/api/app/Observers');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/database', $this->path . '/api/database/migrations');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/uniApp/api', $this->path . '/client/Dsshop/api');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/uniApp/components', $this->path . '/client/Dsshop/components');
        $this->fileUninstall($this->pluginPath . '/' . $name . '/uniApp/pages', $this->path . '/client/Dsshop/pages');
        foreach ($json_dsshop as $id => $json) {
            if ($json['name'] == $name) {
                $json_dsshop[$id]['is_delete'] = 1;
            }
        }
        file_put_contents($this->pluginPath . '/dsshop.json', json_encode($json_dsshop));
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
        $path = $this->pluginPath . '/' . $request->abbreviation;
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
            'client' => $request->client,
            'db' => $request->db,
            'observer' => $request->observer,
            'relevance' => $request->relevance,
        ];
        file_put_contents($path . '/dsshop.json', json_encode($json));
    }

    /**
     * 更新插件配置文件
     * @param $request
     */
    protected function editPlugInJson($request)
    {
        // 插件目录
        $path = $this->pluginPath . '/' . $request->abbreviation . '/dsshop.json';
        $json = [
            'name' => $request->name,
            'abbreviation' => $request->abbreviation,
            'describe' => $request->describe,
            'instructions' => $request->instructions,
            'versions' => $request->versions,
            'author' => $request->author,
            'local' => true,
            'client' => $request->client,
            'db' => $request->db,
            'observer' => $request->observer,
            'relevance' => $request->relevance,
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
            $' . $this->convertUnderline($db['name']) . '->' . $a['name'] . ' = $request->' . $a['name'] . ';';
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
                $this->convertUnderline($db['name']),
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
                $attribute_default = '';
                if (isset($attribute['default'])) {
                    if ($attribute['default'] == 'null') {
                        $attribute_default = '->nullable()';
                    } else {
                        $attribute_default = '->default(' . $attribute['default'] . ')';
                    }
                }
                $attribute_nullable = $attribute['is_empty'] ? '->nullable()' : '';
                $newContent .= "
            \$table->$attribute_type('" . $attribute['name'] . "')" . $attribute_default . $attribute_nullable . "->comment('" . $attribute['annotation'] . "');";
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
     * @return void
     */
    protected function getLocalMigrations($table)
    {
        $return = '';
        foreach ($this->migrations as $d) {
            if (strstr($d, $table)) {
                $return = $d;
                break;
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
