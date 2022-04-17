<?php

namespace Qbhy\TtMicroApp;

use Hanson\Foundation\Http;
use Pimple\Container;
use Pimple\ServiceProviderInterface;

class ServiceProvider implements ServiceProviderInterface
{
    public function register(Container $pimple)
    {
        $pimple['access_token'] = function (TtMicroApp $microApp) {
            return (new AccessToken($microApp))->setCache($microApp->cache);
        };

        $pimple['http'] = function (TtMicroApp $microApp) {
            return new Http($microApp);
        };

        $pimple['auth'] = function (TtMicroApp $microApp) {
            return new Auth($microApp);
        };

        $pimple['storage'] = function (TtMicroApp $microApp) {
            return new Storage($microApp);
        };

        $pimple['qr_code'] = function (TtMicroApp $microApp) {
            return new QrCode($microApp);
        };

        $pimple['temp_msg'] = function (TtMicroApp $microApp) {
            return new TempMsg($microApp);
        };

        $pimple['content_security'] = function (TtMicroApp $microApp) {
            return new ContentSecurity($microApp);
        };

        $pimple['decrypt'] = function (TtMicroApp $microApp) {
            return new Decrypt($microApp);
        };

        $pimple['payment'] = function (TtMicroApp $microApp) {
            return new Payment($microApp);
        };
    }
}