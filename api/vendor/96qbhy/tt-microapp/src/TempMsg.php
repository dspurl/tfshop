<?php

namespace Qbhy\TtMicroApp;

/**
 * Class TempMsg
 * @package Qbhy\TtMicroApp
 */
class TempMsg
{
    protected $app;

    public function __construct(TtMicroApp $microApp)
    {
        $this->app = $microApp;
    }

    /**
     * 发送模版消息 (本接口在服务器端调用,目前只有今日头条支持，抖音和 lite 接入中, 2020-03-02)
     * @param string $to
     * @param string $tempId
     * @param string $formId
     * @param array $data
     * @param null $page
     * @return mixed
     */
    public function send(string $to, string $tempId, string $formId, array $data, $page = null)
    {
        return json_decode((string)$this->app->http->json('https://developer.toutiao.com/api/apps/game/template/send', [
            'access_token' => $this->app->access_token->getToken(),
            'touser' => $to,
            'template_id' => $tempId,
            'page' => $page,
            'form_id' => $formId,
            'data' => $data,
        ])->getBody(), true);
    }

}