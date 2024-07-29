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

    /**
     * 预下单
     */
    public function createOrder(array $params): array
    {
        $opt = array_merge([
            'app_id' => $this->app->getAppId(),
        ], $params);
        $opt['sign'] = $this->signPay($opt);
        $result = $this->app->http->json('https://developer.toutiao.com/api/apps/ecpay/v1/create_order', $opt)->getBody();

        return @json_decode($result, true) ?: $result;
    }

    /**
     * 订单查询
     */
    public function queryOrder(string $out_order_no): array
    {
        $opt = [
            'app_id' => $this->app->getAppId(),
            'out_order_no' => $out_order_no,
        ];
        $opt['sign'] = $this->signPay($opt);
        $result = $this->app->http->json('https://developer.toutiao.com/api/apps/ecpay/v1/query_order', $opt)->getBody();

        return @json_decode($result, true) ?: $result;
    }

    /**
     * 退款请求
     */
    public function createRefund(array $params): array
    {
        $opt = array_merge([
            'app_id' => $this->app->getAppId(),
        ], $params);
        $opt['sign'] = $this->signPay($opt);
        $result = $this->app->http->json('https://developer.toutiao.com/api/apps/ecpay/v1/create_refund', $opt)->getBody();

        return @json_decode($result, true) ?: $result;
    }

    /**
     * 查询退款
     */
    public function queryRefund(string $out_refund_no): array
    {
        $opt = [
            'app_id' => $this->app->getAppId(),
            'out_refund_no' => $out_refund_no,
        ];
        $opt['sign'] = $this->signPay($opt);
        $result = $this->app->http->json('https://developer.toutiao.com/api/apps/ecpay/v1/query_refund', $opt)->getBody();

        return @json_decode($result, true) ?: $result;
    }

    /**
     * 分账请求
     */
    public function settle(array $params): array
    {
        $opt = array_merge([
            'app_id' => $this->app->getAppId(),
        ], $params);
        $opt['sign'] = $this->signPay($opt);
        $result = $this->app->http->json('https://developer.toutiao.com/api/apps/ecpay/v1/settle', $opt)->getBody();

        return @json_decode($result, true) ?: $result;
    }

    /**
     * 查询分账
     */
    public function querySettle(string $out_settle_no): array
    {
        $opt = [
            'app_id' => $this->app->getAppId(),
            'out_settle_no' => $out_settle_no,
        ];
        $opt['sign'] = $this->signPay($opt);
        $result = $this->app->http->json('https://developer.toutiao.com/api/apps/ecpay/v1/query_settle', $opt)->getBody();

        return @json_decode($result, true) ?: $result;
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

    /**
     * 担保支付的请求签名算法
     *
     * 官方文档地址：
     * https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/server/ecpay/appendix#%E8%AF%B7%E6%B1%82%E7%AD%BE%E5%90%8D%E7%AE%97%E6%B3%95
     */
    public function signPay(array $data): string
    {
        unset($data['app_id'], $data['thirdparty_id'], $data['sign']);

        $signData = '';
        $data['salt'] = $this->app->getPaymentSalt();
        sort($data, SORT_STRING);
        foreach ($data as $v) {
            if (is_array($v)) {
                $val = json_encode($v, JSON_UNESCAPED_UNICODE);
            }
            $val = trim($v);
            if ($val === '') {
                continue;
            }
            $signData .= '&' . $val;
        }
        $signData = substr($signData, 1);
        return md5($signData);
    }

    /**
     * 回调签名算法
     *
     * 官方文档地址：
     * https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/server/ecpay/appendix#%E5%9B%9E%E8%B0%83%E7%AD%BE%E5%90%8D%E7%AE%97%E6%B3%95
     */
    public function signCallback(array $param): bool
    {
        $data = [
            $param['timestamp'],
            $param['nonce'],
            $param['msg'],
            $this->app->getPaymentToken(),
        ];
        sort($data, SORT_STRING);
        $str = implode('', $data);
        return !strcmp(sha1($str), $param['msg_signature']);
    }
}
