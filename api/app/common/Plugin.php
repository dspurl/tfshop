<?php

namespace App\common;

use App\Code;
class Plugin
{
    private $pluginPath;
    private $path;

    function __construct() {
        $file_path=explode("/",base_path());
        unset($file_path[count($file_path)-1]);
        $this->path=implode("/",$file_path);
        $this->pluginPath=implode("/",$file_path).'/plugin';
    }
    /**
     * 获取dswjcms.json
     */
    public function getDswjcmsJson(){
        $json_dswjcms= file_get_contents($this->pluginPath.'/dswjcms.json');
        return json_decode($json_dswjcms, true);
    }

    /**
     * 获取本地插件列表
     */
    public function getLocalPlugin(){
        $data = scandir($this->pluginPath);
        $list=[];
        $json_dswjcms= json_decode(file_get_contents($this->pluginPath.'/dswjcms.json'), true);
        foreach ($data as $value){
            if($value != '.' && $value != '..' && $value != 'dswjcms.json'){
                $dswjcms= json_decode(file_get_contents($this->pluginPath.'/'.$value.'/dswjcms.json'), true);
                foreach ($json_dswjcms as $js){
                    if($js['name']== $dswjcms['abbreviation']){
                        $dswjcms['locality_versions']=$js['versions'];
                    }
                }
                $list[]=$dswjcms;
            }
        }
        return $list;
    }

    /**
     * 安装和更新插件
     * @param $name //插件简称
     * @return string
     */
    public function autoPlugin($name){
        $routes=$this->pluginPath.'/'.$name.'/routes.json';
        $dswjcms=$this->pluginPath.'/'.$name.'/dswjcms.json';
        if(!file_exists($routes)){
            return resReturn(0,'插件缺少routes.json文件',Code::CODE_WRONG);
        }
        if(!file_exists($dswjcms)){
            return resReturn(0,'插件缺少dswjcms.json文件',Code::CODE_WRONG);
        }
        $dswjcms=json_decode(file_get_contents($dswjcms), true);
        // 文件自动部署
        $this->fileDeployment($this->pluginPath.'/'.$name.'/admin/api',$this->path.'/admin/src/api');
        $this->fileDeployment($this->pluginPath.'/'.$name.'/admin/views/'.ucwords($name),$this->path.'/admin/src/views/tool/'.ucwords($name));
        $this->fileDeployment($this->pluginPath.'/'.$name.'/api/config',$this->path.'/api/config');
        $this->fileDeployment($this->pluginPath.'/'.$name.'/api/console',$this->path.'/api/app/Console/Commands');
        $this->fileDeployment($this->pluginPath.'/'.$name.'/api/models',$this->path.'/api/app/Models/v1');
        $this->fileDeployment($this->pluginPath.'/'.$name.'/api/plugin',$this->path.'/api/app/Http/Controllers/v1/Plugin');
        $this->fileDeployment($this->pluginPath.'/'.$name.'/api/requests',$this->path.'/api/app/Http/Requests/v1');
        $this->fileDeployment($this->pluginPath.'/'.$name.'/database',$this->path.'/api/database/migrations');
        $this->fileDeployment($this->pluginPath.'/'.$name.'/uniApp/api',$this->path.'/trade/Dsshop/api');
        $this->fileDeployment($this->pluginPath.'/'.$name.'/uniApp/components'.$name,$this->path.'/trade/Dsshop/components');
        $this->fileDeployment($this->pluginPath.'/'.$name.'/uniApp/pages',$this->path.'/trade/Dsshop/pages');
        // 路由自动部署
        $routes=json_decode(file_get_contents($routes), true);
        // api
        if(array_key_exists('admin',$routes) || array_key_exists('app',$routes)){
            $targetPath=$this->path.'/api/routes/api.php';
            $file_get_contents=file_get_contents($targetPath);
            //去除已存在的插件代码
            $file_get_contents=preg_replace('/\/\/'.$dswjcms['name'].'_s(.*?)\/\/'.$dswjcms['name'].'_e/is','',$file_get_contents);
            $file_get_contents=preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n",$file_get_contents);
            // 添加新的插件代码
            if(array_key_exists('admin',$routes)){
                $file_get_contents=str_replace("前台插件列表",$dswjcms['name']."_s
        ".$routes['admin']."
        //".$dswjcms['name']."_e
        //前台插件列表",$file_get_contents);
            }

            if(array_key_exists('app',$routes)){
                $file_get_contents=str_replace("APP插件列表",$dswjcms['name']."_s
        ".$routes['app']."
        //".$dswjcms['name']."_e
        //APP插件列表",$file_get_contents);
            }
            file_put_contents($targetPath,$file_get_contents);
            unset($targetPath);
            unset($file_get_contents);
            unset($metadata);
        }
        // permission
        if(array_key_exists('permission',$routes)){
            $targetPath=$this->path.'/admin/src/store/modules/permission.js';
            $file_get_contents=file_get_contents($targetPath);
            //去除已存在的插件代码
            $file_get_contents=preg_replace('/\/\/ '.$dswjcms['name'].'_s(.*?)\/\/ '.$dswjcms['name'].'_e/is','',$file_get_contents);
            $file_get_contents=preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n",$file_get_contents);
            // 添加新的插件代码
            $metadata=str_replace("插件列表",$dswjcms['name']."_s
  ".$routes['permission']."
  // ".$dswjcms['name']."_e
  // 插件列表",$file_get_contents);
            $file_put_contents=file_put_contents($targetPath,$metadata);
            unset($targetPath);
            unset($file_get_contents);
            unset($metadata);
        }
        // uni-app
        if(array_key_exists('uniApp',$routes)){
            $targetPath=$this->path.'/trade/Dsshop/pages.json';
            $file_get_contents=file_get_contents($targetPath);
            //去除已存在的插件代码
            $file_get_contents=preg_replace('/\/\/ '.$dswjcms['name'].'_s(.*?)\/\/ '.$dswjcms['name'].'_e/is','',$file_get_contents);
            $file_get_contents=preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n",$file_get_contents);
            // 添加新的插件代码
            $metadata=str_replace("插件列表",$dswjcms['name']."_s
		".$routes['uniApp']."
		// ".$dswjcms['name']."_e
		// 插件列表",$file_get_contents);
            $file_put_contents=file_put_contents($targetPath,$metadata);
            unset($targetPath);
            unset($file_get_contents);
            unset($metadata);
        }
        //写入本地插件列表
        $json_dswjcms=json_decode(file_get_contents($this->pluginPath.'/dswjcms.json'),true);
        if(collect($json_dswjcms)->firstWhere('name',$name)){
            foreach ($json_dswjcms as $id=>$js){
                if($js['name'] == $dswjcms['abbreviation']){
                    $json_dswjcms[$id]['versions']=$dswjcms['versions'];
                    $json_dswjcms[$id]['time']=date('Y-m-d H:i:s');
                }
            }
        }else{
            $json_dswjcms[]=array(
                'name'=>$name,
                'versions'=>$dswjcms['versions'],
                'time'=>date('Y-m-d H:i:s')
            );
        }
        file_put_contents($this->pluginPath.'/dswjcms.json',json_encode($json_dswjcms));
        return resReturn(1,'成功');
    }

    /**
     * 拷贝目录下文件到指定目录下，没有目录则创建
     * @param string $original//原始目录
     * @param string $target//目标目录
     */
    protected function fileDeployment($original,$target){
        if(file_exists($original)){
            if(!file_exists($target)){
                mkdir ($target,0777,true);
            }
            $data = scandir($original);
            foreach ($data as $value){
                if($value != '.' && $value != '..'){
                    if(is_dir($original.'/'.$value)){ //如果是目录
                        $this->fileDeployment($original.'/'.$value,$target.'/'.$value);
                    }else{
                        copy($original.'/'.$value,$target.'/'.$value);
                    }
                }
            }
        }
    }

    /**
     * 自动生成标准的控制器、前端模板、API路由
     * @param  string $name //组件名称
     * @param  string $api  //组件标识
     * @return string
     */
    protected function autoElement($name,$api){
        // 添加路由
        $routes=base_path().'/routes/api.php';    //路由文件
        $metadata=str_replace("自动组件添加",$name."
        Route::get('$api', '".$api."Controller@index')->middleware(['lpower:".ucwords($api)."List']);    //列表
        Route::post('$api', '".$api."Controller@store')->middleware(['lpower:".ucwords($api)."Create']);    //添加保存
        Route::put('$api/{photo}', '".$api."Controller@update')->middleware(['lpower:".ucwords($api)."Update']);    //编辑保存
        Route::delete('$api/{photo}', '".$api."Controller@destroy')->middleware(['lpower:".ucwords($api)."Delete']);    //删除
        //自动组件添加     
        ",file_get_contents($routes));
        $file_put_contents=file_put_contents($routes,$metadata);
        if(!$file_put_contents){
            return resReturn(0,'创建路由失败',Code::CODE_WRONG);
        }
        unset($routes);
        unset($metadata);
        unset($file_put_contents);
        // 创建控制器
        $controllerPath=base_path().'/app/Http/Controllers/v'.config('dswjcms.versions').'/Element/'.ucwords($api).'Controller.php';    //生成的控制器路径
        $file_path=explode("/",base_path());
        unset($file_path[count($file_path)-1]);
        $file_path=implode("/",$file_path);
        $metadata=str_replace("Template",ucwords($api),file_get_contents($file_path.'/template/api/TemplateController.php')); //模板数据
        if(!file_exists($controllerPath)){
            $file_put_contents=file_put_contents($controllerPath,$metadata);
            if(!$file_put_contents){
                return resReturn(0,'创建Controller失败',Code::CODE_WRONG);
            }
        }
        unset($controllerPath);
        unset($metadata);
        unset($file_put_contents);
        // 创建models
        $modelsPath=base_path().'/app/Models/v'.config('dswjcms.versions').'/'.ucwords($api).'.php';    //生成的models路径
        $metadata=str_replace("Template",ucwords($api),file_get_contents($file_path.'/template/api/Template.php')); //模板数据
        if(!file_exists($modelsPath)){
            $file_put_contents=file_put_contents($modelsPath,$metadata);
            if(!$file_put_contents){
                return resReturn(0,'创建models失败',Code::CODE_WRONG);
            }
        }
        unset($modelsPath);
        unset($metadata);
        unset($file_put_contents);
        // 创建Requests
        $requestsPath=base_path().'/app/Http/Requests/v'.config('dswjcms.versions').'/Submit'.ucwords($api).'Request.php';    //生成的requests路径
        $metadata=str_replace("Template",ucwords($api),file_get_contents($file_path.'/template/api/SubmitTemplateRequest.php')); //模板数据
        if(!file_exists($requestsPath)){
            $file_put_contents=file_put_contents($requestsPath,$metadata);
            if(!$file_put_contents){
                return resReturn(0,'创建requests失败',Code::CODE_WRONG);
            }
        }
        unset($requestsPath);
        unset($metadata);
        unset($file_put_contents);

        // 创始前端模板
        // 添加路由
        $routes=$file_path.'/lessee/src/store/modules/permission.js';    //路由文件
        $metadata=str_replace("自定义模板",$name."
  ".ucwords($api).": () => import('@/views/elements/".ucwords($api)."/index'),
  ".ucwords($api)."List: () => import('@/views/elements/".ucwords($api)."/list'),
  ".ucwords($api)."Create: () => import('@/views/elements/".ucwords($api)."/create'),
  ".ucwords($api)."Update: () => import('@/views/elements/".ucwords($api)."/edit'),
  // 自定义模板",file_get_contents($routes));
        $file_put_contents=file_put_contents($routes,$metadata);
        if(!$file_put_contents){
            return resReturn(0,'创建前端路由失败',Code::CODE_WRONG);
        }
        unset($routes);
        unset($metadata);
        unset($file_put_contents);
        //生成模板文件
        $vuePath=$file_path.'/lessee/src/views/elements/'.ucwords($api);    //生成的路径
        if (!is_dir($vuePath)){ //创建目录
            mkdir($vuePath);
        }
        //生成所有文件
        $metadata=file_get_contents($file_path.'/template/vue/index.vue');
        if(!file_exists($vuePath.'/index.vue')){
            $file_put_contents=file_put_contents($vuePath.'/index.vue',$metadata);
            if(!$file_put_contents){
                return resReturn(0,'创建index.vue失败',Code::CODE_WRONG);
            }
        }
        unset($metadata);
        unset($file_put_contents);

        $metadata=str_replace("VueTemplate",ucwords($api),file_get_contents($file_path.'/template/vue/list.vue'));
        if(!file_exists($vuePath.'/list.vue')){
            $file_put_contents=file_put_contents($vuePath.'/list.vue',$metadata);
            if(!$file_put_contents){
                return resReturn(0,'创建list.vue失败',Code::CODE_WRONG);
            }
        }
        unset($metadata);
        unset($file_put_contents);

        $metadata=str_replace("VueTemplate",ucwords($api),file_get_contents($file_path.'/template/vue/create.vue'));
        if(!file_exists($vuePath.'/create.vue')){
            $file_put_contents=file_put_contents($vuePath.'/create.vue',$metadata);
            if(!$file_put_contents){
                return resReturn(0,'创建create.vue失败',Code::CODE_WRONG);
            }
        }
        unset($metadata);
        unset($file_put_contents);

        $metadata=str_replace("VueTemplate",ucwords($api),file_get_contents($file_path.'/template/vue/edit.vue'));
        if(!file_exists($vuePath.'/edit.vue')){
            $file_put_contents=file_put_contents($vuePath.'/edit.vue',$metadata);
            if(!$file_put_contents){
                return resReturn(0,'创建edit.vue失败',Code::CODE_WRONG);
            }
        }
        unset($metadata);
        unset($file_put_contents);

        $metadata=str_replace("vueTemplate",ucwords($api),file_get_contents($file_path.'/template/vue/Templates.js'));
        if(!file_exists($file_path.'/lessee/src/api/'.ucwords($api).'.js')){
            $file_put_contents=file_put_contents($file_path.'/lessee/src/api/'.ucwords($api).'.js',$metadata);
            if(!$file_put_contents){
                return resReturn(0,'创建'.ucwords($api).'.js失败',Code::CODE_WRONG);
            }
        }
        unset($metadata);
        unset($file_put_contents);

        if (!is_dir($vuePath.'/components')){ //创建子目录
            mkdir($vuePath.'/components');
        }
        $metadata=str_replace("VueTemplate",ucwords($api),file_get_contents($file_path.'/template/vue/Detail.vue'));
        if(!file_exists($vuePath.'/components/Detail.vue')){
            $file_put_contents=file_put_contents($vuePath.'/components/Detail.vue',$metadata);
            if(!$file_put_contents){
                return resReturn(0,'创建Detail.vue失败',Code::CODE_WRONG);
            }
        }
        unset($metadata);
        unset($file_put_contents);
        unset($vuePath);
        echo '创建成功';
    }
}