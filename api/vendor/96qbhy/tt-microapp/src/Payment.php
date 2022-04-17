<?php


namespace Qbhy\TtMicroApp;

use function Qbhy\TtMicroApp\Support\get_client_ip;

class Payment
{
    protected $app;

    public function __construct(TtMicroApp $microApp)
    {
        $this->app = $microApp;
    }

    public function pay(string $uid, string $outTradeNo, int $totalAmount, string $subject, array $optional = [])
    {
        $data = [
            'app_id' => $this->app->getPaymentAppId(),
            'merchant_id' => $this->app->getPaymentMerchantId(),
            'timestamp' => $time = (string)time(),
            'sign_type' => 'MD5',
            'out_order_no' => $outTradeNo,
            'total_amount' => $totalAmount,
            'product_code' => 'pay',
            'payment_type' => 'direct',
            'trade_type' => 'H5',
            'version' => '2.0',
            'currency' => 'CNY',
            'subject' => $subject,
            'body' => $optional['body'] ?? '',
            'uid' => $uid,
            'trade_time' => $time,
            'valid_time' => $optional['valid_time'] ?? 300,
            'notify_url' => $optional['notify_url'] ?? '',
            'risk_info' => $optional['risk_info'] ?? json_encode(['ip' => $ip = get_client_ip()]),
            'wx_type' => 'MWEB',
            'wx_url' => $optional['wx_url'] ?? '',
            'alipay_url' => $optional['alipay_url'] ?? '',
        ];

        $data['sign'] = $this->sign($data);

        return $data;

    }

    public function sign(array $data)
    {
        $signData = '';
        ksort($data);
        foreach ($data as $k => $v) {
            if (is_array($v)) {
                $value = json_encode($v);
            } else {
                $value = $v;
            }
            if ($value) {
                $signData .= '&' . $k . '=' . $value;
            }
        }

        $signData = ltrim($signData, '&');
        return md5($signData . $this->app->getPaymentSecret());
    }

}