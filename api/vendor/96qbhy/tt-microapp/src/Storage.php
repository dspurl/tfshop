<?php

namespace Qbhy\TtMicroApp;

/**
 * Class Storage
 * @package Qbhy\TtMicroApp
 */
class Storage
{
    protected $app;

    public function __construct(TtMicroApp $microApp)
    {
        $this->app = $microApp;
    }

    /**
     * 以 key-value 形式上报用户数据到字节跳动的云存储服务。
     * @param string $openid
     * @param $list
     * @param string $signature
     * @param string $sigMethod
     * @return mixed
     */
    public function set(string $openid, $list, string $signature, string $sigMethod)
    {
        return json_decode((string)$this->app->http->post('https://developer.toutiao.com/api/apps/set_user_storage', [
            'access_token' => $this->app->access_token->getToken(),
            'openid' => $openid,
            'signature' => $signature,
            'sig_method' => $sigMethod,
            'kv_list' => $list,
        ])->getBody(), true);
    }

    /**
     * 删除上报到字节跳动的云存储服务的 key-value 数据。
     * @param string $openid
     * @param $key
     * @param string $signature
     * @param string $sigMethod
     * @return mixed
     */
    public function remove(string $openid, $key, string $signature, string $sigMethod)
    {
        return json_decode((string)$this->app->http->post('https://developer.toutiao.com/api/apps/remove_user_storage', [
            'access_token' => $this->app->access_token->getToken(),
            'openid' => $openid,
            'signature' => $signature,
            'sig_method' => $sigMethod,
            'key' => $key,
        ])->getBody(), true);
    }

}