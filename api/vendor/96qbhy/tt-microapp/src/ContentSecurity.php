<?php

namespace Qbhy\TtMicroApp;

use GuzzleHttp\RequestOptions;

/**
 * Class ContentSecurity
 * @package Qbhy\TtMicroApp
 */
class ContentSecurity
{
    protected $app;

    public function __construct(TtMicroApp $microApp)
    {
        $this->app = $microApp;
    }

    const TARGET_PORN = 'porn';
    const TARGET_POLITICS = 'politics';
    const TARGET_AD = 'ad';
    const TARGET_DISGUSTING = 'disgusting';

    /**
     * 检测一段文本是否包含违法违规内容
     * @param array|string $contents
     * @return array
     * @throws
     */
    public function text($contents)
    {
        if (!is_array($contents)) {
            $contents = [$contents];
        }

        return json_decode((string)$this->app->http->request('POST', 'https://developer.toutiao.com/api/v2/tags/text/antidirt', [
            RequestOptions::HEADERS => [
                'X-Token' => $this->app->access_token->getToken(),
            ],
            RequestOptions::JSON => [
                'tasks' => array_map(function ($content) {
                    return compact('content');
                }, $contents)
            ]
        ])->getBody(), true);
    }

    public function image($images, array $targets)
    {
        if (!is_array($images)) {
            $images = [$images];
        }

        return json_decode((string)$this->app->http->request('POST', 'https://developer.toutiao.com/api/v2/tags/image/', [
            RequestOptions::HEADERS => [
                'X-Token' => $this->app->access_token->getToken(),
            ],
            RequestOptions::JSON => [
                'tasks' => array_map(function ($image) {
                    return compact('image');
                }, $images),
                'targets' => $targets,
            ]
        ])->getBody(), true);
    }

}