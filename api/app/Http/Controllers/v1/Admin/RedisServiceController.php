<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\common\RedisService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RedisServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $default= new RedisService();
        $cache= new RedisService('cache');
        $queue= new RedisService('queue');
        if($request->has('type')){
            switch ($request->type){
                case 1:
                    $data['default']=$default->Keys('*');
                    break;
                case 2:
                    $data['cache']=$cache->Keys('*');
                    break;
                case 3:
                    $data['queue']=$queue->Keys('*');
                    break;
            }
        }else{
            $data['default']=$default->Keys('*');
            $data['cache']=$cache->Keys('*');
            $data['queue']=$queue->Keys('*');
        }

        $return=array();
        foreach ($data as $key => $d){
            $type=0;
            $db=null;
            switch ($key){
                case 'default':
                    $type='默认';
                    $db=$default;
                    break;
                case 'cache':
                    $type='数据库';
                    $db=$cache;
                    break;
                case 'queue':
                    $type='队列';
                    $db=$queue;
                    break;

            }
            foreach ($d as $value){
                $return[]=array(
                    'name'=>$value, //字段名
                    'type'=>$key,  //类型
                    'type_show'=>$type, //类型
                    'size'=>round($db->strlen($value)/1024,2) //大小KB
                );
            }
        }
        $msg['data']=$return;
        return resReturn(1,$msg);
    }

    //获取Redis详情
    public function show($name,Request $request){
        if(!$request->has('type') || !$name){
            return resReturn(0,'参数有误',Code::CODE_PARAMETER_WRONG);
        }
        $redis= new RedisService($request->type);
        $data=$redis->get($name);
        $return['type']=0;
        $return['data']=$data;
        if(!is_null(json_decode($data))){
            $return['data']=json_decode($data);
            $return['type']=1;
        }

        return resReturn(1,$return);
    }

    //redis面板
    public function panel(){
        $default= new RedisService('default');
        $cache= new RedisService('cache');
        $queue= new RedisService('queue');
        $data['default']=$default->keys('*');
        $data['cache']=$cache->keys('*');
        $data['queue']=$queue->keys('*');
        $msg['default']=$default->info();
        $msg['cache']=$cache->info();
        $msg['queue']=$queue->info();
        return resReturn(1,$msg);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $name
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroy($name, Request $request)
    {
        if($name !=1) {
            $redis = new RedisService($request->type);
            $redis->del($name);
        }else{
            foreach ($request->all() as $all){
                $redis= new RedisService($all['type']);
                $redis->del($all['name']);
            }
        }
        return resReturn(1,'删除成功');
    }
}
