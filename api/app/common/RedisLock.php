<?php
/** +----------------------------------------------------------------------
 * | redis 加锁 --单Redis实例实现分布式锁
 * +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 * -- 分布式请使用：Redlock:https://github.com/ronnylt/redlock-php
 * -- 详情参考： http://www.redis.cn/topics/distlock.html
 * +----------------------------------------------------------------------
 */
namespace App\common;

class RedisLock
{
    const IF_NOT_EXISTS = 'NX';
    const MILLISECOND_EXPIRE_TIME = 'PX';
    const EXPIRE_TIME = 5;
    const LOCK_VALUE = 5;

    /**
     * 加锁
     * @param $redis object
     * @param $key
     * @param string $expire_time 60000
     * @return bool
     */
    public static function lock($redis, $key, $expire_time = '')
    {
        if (empty($expire_time)) {
            $expire_time = self::EXPIRE_TIME;
        }
        return $redis->set($key, self::LOCK_VALUE, $expire_time);
    }

    /**
     * 解锁
     *
     * 参考： https://github.com/phpredis/phpredis/blob/develop/tests/RedisTest.php
     * @param $redis
     * @param $key
     * @return mixed
     */
    public static function unlock($redis, $key)
    {
        $lua = <<<EOT
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
EOT;
        return $redis->eval($lua, [$key], 1);
    }
}
