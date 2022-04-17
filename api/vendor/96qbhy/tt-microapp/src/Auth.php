<?php

namespace Qbhy\TtMicroApp;

/**
 * Class Auth
 * @package Qbhy\TtMicroApp
 */
class Auth
{
    const CODE = 'code';
    const ANONYMOUS_CODE = 'anonymous_code';

    protected $app;

    public function __construct(TtMicroApp $microApp)
    {
        $this->app = $microApp;
    }

    /**
     * @param string $code
     * @param string $type code或者anonymous_code
     * @return array
     * @throws
     */
    public function session(string $code, $type = Auth::CODE)
    {
        if (!in_array($type, $limit = [Auth::ANONYMOUS_CODE, Auth::CODE])) {
            throw new TtMicroAppException('type 只能是 ' . implode('或者', $limit));
        }

        return json_decode((string)$this->app->http->get('https://developer.toutiao.com/api/apps/jscode2session', [
            'appid' => $this->app->getAppId(),
            'secret' => $this->app->getAppSecret(),
            $type => $code,
        ])->getBody(), true);
    }

}