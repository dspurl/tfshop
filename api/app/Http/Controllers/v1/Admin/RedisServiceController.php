<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\common\RedisService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redis;

/**
 * @group redis
 * Redis管理
 * Class RedisServiceController
 * @package App\Http\Controllers\v1\Admin
 */
class RedisServiceController extends Controller
{

    /**
     * RedisServiceList
     * Redis列表
     * @param Request $request
     * @return Response
     */
    public function list(Request $request)
    {
        $default = null;
        $cache = null;
        $queue = null;
        $data = [];
        if ($request->site) {
            switch ($request->site) {
                case 1:
                    $default = Redis::connection('default');
                    $data['default'] = $default->keys('*');
                    break;
                case 2:
                    $cache = Redis::connection('cache');
                    $data['cache'] = $cache->keys('*');
                    break;
                case 3:
                    $queue = Redis::connection('queue');
                    $data['queue'] = $queue->keys('*');
                    break;
            }
        } else {
            $default = Redis::connection('default');
            $cache = Redis::connection('cache');
            $queue = Redis::connection('queue');
            $data['default'] = $default->keys('*');
            $data['cache'] = $cache->keys('*');
            $data['queue'] = $queue->keys('*');
        }
        $return = [];
        foreach ($data as $key => $d) {
            $db = null;
            switch ($key) {
                case 'default':
                    $db = $default;
                    break;
                case 'cache':
                    $db = $cache;
                    break;
                case 'queue':
                    $db = $queue;
                    break;

            }
            foreach ($d as $v) {
                if ($request->type && $request->type != $db->type($v)) {
                    continue;
                }
                if ($db->type($v) == 1) {
                    $return[] = array(
                        'name' => $v, //字段名
                        'type' => $key,  //站点
                        'type_show' => 'string', //类型
                        'size' => $db->strlen($v) //大小KB
                    );
                }
                if ($db->type($v) == 2) {
                    $return[] = array(
                        'name' => $v, //字段名
                        'type' => $key,  //站点
                        'type_show' => 'set', //类型
                        'size' => $db->scard($v) //大小KB
                    );
                }
                if ($db->type($v) == 3) {
                    $return[] = array(
                        'name' => $v, //字段名
                        'type' => $key,  //站点
                        'type_show' => 'list', //类型
                        'size' => $db->lLen($v) //大小KB
                    );
                }
                if ($db->type($v) == 4) {
                    $return[] = array(
                        'name' => $v, //字段名
                        'type' => $key,  //站点
                        'type_show' => 'zset', //类型
                        'size' => $db->zcard($v) //大小KB
                    );
                }
                if ($db->type($v) == 5) {
                    $return[] = array(
                        'name' => $v, //字段名
                        'type' => $key,  //站点
                        'type_show' => 'hash', //类型
                        'size' => $db->Hlen($v) //大小KB
                    );
                }
                if ($db->type($v) == 6) {
                    $return[] = array(
                        'name' => $v, //字段名
                        'type' => $key,  //站点
                        'type_show' => 'other', //类型
                        'size' => null //大小KB
                    );
                }

            }
        }
        $msg['data'] = $return;
        return resReturn(1, $msg);

    }

    /**
     * RedisServiceDetail
     * 获取Redis详情
     * @param $name
     * @param Request $request
     * @return string
     */
    public function detail($name, Request $request)
    {

        if (!$request->has('type') || !$name) {
            return resReturn(0, '参数有误', Code::CODE_PARAMETER_WRONG);
        }
        $redis = new RedisService($request->type);
        $data = null;
        $type = 0;
        if ($redis->type($name) == 1) {
            $data = $redis->get($name);
            $type = 0;
        }
        if ($redis->type($name) == 2) {
            $data = json_encode($redis->sMembers($name));
            $type = 1;
        }
        if ($redis->type($name) == 3) {
            $data = $redis->lrange($name, 0, -1);
            $type = 0;
        }
        if ($redis->type($name) == 4) {
            $data = $redis->zRange($name, 0, -1, true);
            $type = 0;
        }
        if ($redis->type($name) == 5) {
            $data = json_encode($redis->hGetAll($name));
            $type = 1;
        }
        if ($redis->type($name) == 6) {
            $data = null;
            $type = 0;
        }

        $return['data'] = $data;
        $return['type'] = $type;

        return resReturn(1, $return);
    }

    /**
     * RedisPanel
     * redis面板
     * @return string
     */
    public function panel()
    {
        $default = new RedisService('default');
        $cache = new RedisService('cache');
        $queue = new RedisService('queue');
        $data['default'] = $default->keys('*');
        $data['cache'] = $cache->keys('*');
        $data['queue'] = $queue->keys('*');
        $msg['default'] = $default->info();
        $msg['cache'] = $cache->info();
        $msg['queue'] = $queue->info();
        return resReturn(1, $msg);
    }

    /**
     * RedisServiceDestroy
     * 删除Redis
     * @param $name
     * @param Request $request
     * @return Response
     */
    public function destroy($name, Request $request)
    {
        if ($name != 1) {
            $redis = new RedisService($request->type);
            $redis->del($name);
        } else {
            foreach ($request->all() as $all) {
                $redis = new RedisService($all['type']);
                $redis->del($all['name']);
            }
        }
        return resReturn(1, '删除成功');
    }
}
