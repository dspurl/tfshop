<?php

namespace App\common;

use Redis;

/**
 *
 * redis连接
 *
 * @package app\common
 */
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
