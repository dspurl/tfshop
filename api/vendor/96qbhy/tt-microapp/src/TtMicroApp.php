<?php

namespace Qbhy\TtMicroApp;

use Doctrine\Common\Cache\Cache;
use Hanson\Foundation\Foundation;

/**
 * Class TtMicroApp
 * @package Qbhy\TtMicroApp
 *
 * @property-read AccessToken $access_token
 * @property-read Auth $auth
 * @property-read QrCode $qr_code
 * @property-read Storage $storage
 * @property-read TempMsg $temp_msg
 * @property-read ContentSecurity $content_security
 * @property-read Decrypt $decrypt
 * @property-read Payment $payment
 * @property-read Cache $cache
 */
class TtMicroApp extends Foundation
{
    protected $providers = [
        ServiceProvider::class,
    ];

    public function getAppId()
    {
        return $this->getConfig('access_key');
    }

    public function getAppSecret()
    {
        return $this->getConfig('secret_key');
    }

    public function getPaymentAppId()
    {
        return $this->getConfig('payment_app_id');
    }

    public function getPaymentSecret()
    {
        return $this->getConfig('payment_secret');
    }

    public function getPaymentMerchantId()
    {
        return $this->getConfig('payment_merchant_id');
    }

    public function getPaymentSalt()
    {
        return $this->getConfig('payment_salt');
    }

    public function getPaymentToken()
    {
        return $this->getConfig('payment_token');
    }

    public function rebind(string $id, $value)
    {
        $this->offsetUnset($id);
        $this->offsetSet($id, $value);

        return $this;
    }
}
