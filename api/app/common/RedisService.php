<?php
/** +----------------------------------------------------------------------
 * | redis连接
 * +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\common;

use Redis;
class RedisService extends Redis
{
    private $config;

    public function __construct($select = 'default')
    {
        $this->config = config('database.redis');
        $this->connection($select);
    }

    /**
     * connect redis
     * @desc 连接redis，外部调用
     * @param string $select 选择redis连接方式
     * @return mixed \Redis|string
     */
    public function connection($select = 'default')
    {
        $this->config = config('database.redis');
        if (array_key_exists($select, $this->config)) {
            return $this->do_connect($this->config[$select]);
        } else {
            return 'config error';
        }
    }

    /**
     * @desc 进行redis连接
     * @param $config
     * @return mixed
     */
    private function do_connect($config)
    {
        $this->pconnect($config['host'], $config['port'], $config['timeout']);
        if ($config['password']) {
            $this->auth($config['password']); //密码验证
        }
        $this->select($config['database']);
        return $this;
    }
}
