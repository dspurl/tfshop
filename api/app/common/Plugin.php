<?php

namespace App\common;

use App\Code;

/**
 * Created by PhpStorm.
 * User: pang
 * Date: 2020/8/24
 * Time: 21:02
 */
class Plugin
{

    /**
     * 获取dswjcms.json
     */
    public function getDswjcmsJson(){
        $file_path=explode("/",base_path());
        unset($file_path[count($file_path)-1]);
        $file_path=implode("/",$file_path);
        $json_dswjcms= file_get_contents($file_path.'/plugin/dswjcms.json');
        return json_decode($json_dswjcms, true);
    }

    /**
     * 获取本地插件列表
     */
    public function getLocalPlugin(){
        $file_path=explode("/",base_path());
        unset($file_path[count($file_path)-1]);
        $file_path=implode("/",$file_path);
        $data = scandir($file_path.'/plugin');
        $list=[];
        foreach ($data as $value){
            if($value != '.' && $value != '..' && $value != 'dswjcms.json'){
                $json_dswjcms= file_get_contents($file_path.'/plugin/'.$value.'/dswjcms.json');
                $list[]=json_decode($json_dswjcms, true);

            }
        }
        return $list;
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