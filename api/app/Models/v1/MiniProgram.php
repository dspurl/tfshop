<?php

namespace App\Models\v1;

use App\Code;
use Illuminate\Database\Eloquent\Model;
use EasyWeChat\Factory;

class MiniProgram extends Model
{
    /**
     * 小程序授权统一入口
     * @param $platform
     * @param $code
     * @return mixed
     */
    public function mini($platform, $code)
    {
        return $this->$platform($code);
    }

    /**
     * 小程序获取手机号统一入口
     * @param $platform
     * @param $session_key
     * @param $iv
     * @param $encryptedData
     * @return mixed
     */
    public function miniPhoneNumber($platform, $session_key, $iv, $encryptedData)
    {
        $platform = $platform . 'PhoneNumber';
        return $this->$platform($session_key, $iv, $encryptedData);
    }

    /**
     * 支付统一入口
     * @param $platform
     * @param $body
     * @param $fee
     * @param $openid
     * @param $trade_type
     * @return mixed
     */
    public function payment($platform, $body, $fee, $openid, $trade_type)
    {
        $platform = $platform . 'Payment';
        return $this->$platform($body, $fee, $openid, $trade_type);
    }

    /**
     * 退款统一入口
     * @param $platform //平台
     * @param $number //商户订单号
     * @param $totalFee //订单金额
     * @param $refundFee //退款金额
     * @param $why //退款原因
     * @return mixed
     */
    public function refund($platform, $number, $totalFee, $refundFee, $why)
    {
        $platform = $platform . 'Refund';
        return $this->$platform($number, $totalFee, $refundFee, $why);
    }

    /**
     * 统一查询入口
     * @param $platform //平台
     * @param $number //商户订单号
     * @param $type //订单类型
     * @return mixed
     */
    public function queryNumber($platform, $number, $type)
    {
        $platform = $platform . 'Query';
        return $this->$platform($number, $type);
    }

    /**
     * 支付宝小程序
     * @param $code
     * @return array
     * @throws \Exception
     */
    public function miniAlipay($code)
    {
        $mini_program_alipay = config('miniprogram.alipay');
        $aop = new \AopClient();
        $aop->gatewayUrl = $mini_program_alipay['gatewayUrl'];
        $aop->appId = $mini_program_alipay['app_id'];
        $aop->rsaPrivateKey = $mini_program_alipay['rsaPrivateKey'];
        $aop->alipayrsaPublicKey = $mini_program_alipay['rsaPublicKey'];
        $aop->apiVersion = '1.0';
        $aop->signType = 'RSA2';
        $aop->postCharset = 'UTF-8';
        $aop->format = 'json';
        $request = new \AlipaySystemOauthTokenRequest();
        $request->setGrantType("authorization_code");
        $request->setCode($code);
        $result = json_decode(json_encode($aop->execute($request)), true);
        if (array_key_exists('error_response', $result)) {
            throw new \Exception($result['error_response']['sub_msg'], $result['error_response']['code']);
        } else {
            return [
                'result' => 'ok',
                'openid' => $result['alipay_system_oauth_token_response']['user_id'],
                'session_key' => $result['alipay_system_oauth_token_response']['access_token']
            ];
        }
    }

    /**
     * 微信小程序
     * @param $code
     * @return array
     * @throws \Exception
     */
    public function miniWeixin($code)
    {
        $config = config('wechat.mini_program.default');
        $miniProgram = Factory::miniProgram($config); // 小程序
        $result = $miniProgram->auth->session((string)$code);
        if (array_key_exists('errcode', $result)) {
            throw new \Exception($result['errmsg'], $result['errcode']);
        } else {
            return [
                'result' => 'ok',
                'openid' => $result['openid'],
                'session_key' => $result['session_key']
            ];
        }
    }

    /**
     * 头条小程序
     * @param $code
     * @return array
     * @throws \Exception
     */
    public function miniToutiao($code)
    {
        $mini_program_toutiao = config('miniprogram.toutiao');
        $factory = new \Qbhy\TtMicroApp\Factory($factoryConfig = [
            'debug' => true,
            'default' => 'default',
            'drivers' => [
                'default' => $appConfig = [
                    'access_key' => $mini_program_toutiao['app_id'],
                    'secret_key' => $mini_program_toutiao['secret'],

                    'payment_app_id' => $mini_program_toutiao['app_id'],
                    'payment_merchant_id' => '',
                    'payment_secret' => 'y'
                ]
            ],
        ]);
        $app = $factory->make('default');
        $result = $app->auth->session($code);
        if (array_key_exists('openid', $result)) {
            return [
                'result' => 'ok',
                'openid' => $result['openid'],
                'session_key' => $result['session_key']
            ];
        } else {
            throw new \Exception($result['errmsg'], $result['errcode']);
        }
    }

    /**
     * 微信小程序获取手机号
     * @param $session_key
     * @param $iv
     * @param $encryptedData
     * @return array
     * @throws \EasyWeChat\Kernel\Exceptions\DecryptException
     */
    public function miniWeixinPhoneNumber($session_key, $iv, $encryptedData)
    {
        $config = config('wechat.mini_program.default');
        $miniProgram = Factory::miniProgram($config); // 小程序
        $result = $miniProgram->encryptor->decryptData($session_key, $iv, $encryptedData);
        if (array_key_exists('purePhoneNumber', $result)) {
            return [
                'result' => 'ok',
                'purePhoneNumber' => $result['purePhoneNumber']
            ];
        } else {
            throw new \Exception('获取手机号失败', Code::CODE_WRONG);
        }
    }

    /**
     * 字节跳动小程序获取手机号
     * @param $session_key
     * @param $iv
     * @param $encryptedData
     * @return array
     * @throws \Qbhy\TtMicroApp\Support\DecryptException
     * @throws \Qbhy\TtMicroApp\TtMicroAppException
     */
    public function miniToutiaoPhoneNumber($session_key, $iv, $encryptedData)
    {
        $mini_program_toutiao = config('miniprogram.toutiao');
        $factory = new \Qbhy\TtMicroApp\Factory($factoryConfig = [
            'debug' => true,
            'default' => 'default',
            'drivers' => [
                'default' => $appConfig = [
                    'access_key' => $mini_program_toutiao['app_id'],
                    'secret_key' => $mini_program_toutiao['secret'],

                    'payment_app_id' => $mini_program_toutiao['app_id'],
                    'payment_merchant_id' => '',
                    'payment_secret' => 'y'
                ]
            ],
        ]);
        $app = $factory->make('default');
        $result = $app->decrypt->decrypt($encryptedData, $session_key, $iv);
        if (array_key_exists('purePhoneNumber', $result)) {
            return [
                'result' => 'ok',
                'purePhoneNumber' => $result['purePhoneNumber']
            ];
        } else {
            throw new \Exception('获取手机号失败', Code::CODE_WRONG);
        }
    }

    /**
     * 微信统一支付
     * @param $body
     * @param $fee
     * @param $openid
     * @param string $trade_type
     * @return array
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function weixinPayment($body, $fee, $openid, $trade_type = 'JSAPI')
    {
        $number = orderNumber();
        $config = config('wechat.payment.default');
        $config['notify_url'] = request()->root() . '/api/v1/app/paymentNotify';
        $app = Factory::payment($config);
        if ($config['sandbox'] == true) {
            $fee = '101';
        }
        $result = $app->order->unify([
            'body' => $body,
            'out_trade_no' => $number,
            'total_fee' => $fee,
            'trade_type' => $trade_type,
            'openid' => $openid,
        ]);
        if ($result['return_code'] == 'SUCCESS' && $result['result_code'] == 'SUCCESS') {
            $prepayId = $result['prepay_id'];
            $config = $app->jssdk->sdkConfig($prepayId);
            return [
                'result' => 'ok',
                'msg' => $config,
                'number' => $number,
                'mweb_url' => array_key_exists('mweb_url', $result) ? $result['mweb_url'] : '',
                'code_url' => array_key_exists('code_url', $result) ? $result['code_url'] : '',
            ];
        }
        if ($result['return_code'] == 'FAIL' && array_key_exists('return_msg', $result)) {
            throw new \Exception($result['return_msg'], Code::CODE_WRONG);
        }
        throw new \Exception('支付异常，请联系管理员', Code::CODE_WRONG);
    }

    /**
     * 微信统一退款
     * @param $number
     * @param $totalFee
     * @param $refundFee
     * @param string $why
     * @return array
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     */
    public function weixinRefund($number, $totalFee, $refundFee, $why = '')
    {
        $return = [
            'result' => 'error',
            'msg' => '退款异常，请联系管理员'
        ];
        $refundNumber = orderNumber();
        $config = config('wechat.payment.default');
        $config['notify_url'] = request()->root() . '/api/v1/app/refundNotify';
        $app = Factory::payment($config);
        $result = $app->refund->byOutTradeNumber($number, $refundNumber, $totalFee, $refundFee, [
            // 可在此处传入其他参数，详细参数见微信支付文档
            'refund_desc' => $why,
        ]);
        if ($result['return_code'] == 'SUCCESS' && $result['result_code'] == 'SUCCESS') {
            return [
                'result' => 'ok',
                'msg' => $config,
                'number' => $refundNumber
            ];
        }
        if ($result['return_code'] == 'FAIL' && array_key_exists('return_msg', $result)) {
            throw new \Exception($result['return_msg'], Code::CODE_WRONG);
        }
        if ($result['return_code'] == 'SUCCESS' && $result['result_code'] == 'FAIL' && isset($result['err_code_des'])) {
            throw new \Exception($result['err_code_des'], Code::CODE_WRONG);
        }
        throw new \Exception('退款异常，请联系管理员', Code::CODE_WRONG);
    }

    /**
     * 微信统一查询
     * @param $number
     * @param $type
     * @return array
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     */
    public function weixinQuery($number, $type)
    {
        $return = [
            'result' => 'error',
            'msg' => '查询异常，请联系管理员'
        ];
        $config = config('wechat.payment.default');
        $app = Factory::payment($config);

        if ($type == PaymentLog::PAYMENT_LOG_TYPE_REFUND) {   //退款
            $result = $app->refund->queryByOutRefundNumber($number);
            $transaction_id = $result['refund_id_0'];
        } else {  //其它
            $result = $app->order->queryByOutTradeNumber($number);
            $transaction_id = isset($result['transaction_id']) ? $result['transaction_id'] : '';
        }
        if ($result['return_code'] == 'SUCCESS' && $result['result_code'] == 'SUCCESS') {
            return [
                'result' => 'ok',
                'transaction_id' => $transaction_id,
                'msg' => '需要同步'
            ];
        }
        if ($result['return_code'] == 'SUCCESS' && $result['result_code'] == 'FAIL') {
            throw new \Exception($result['err_code_des'], Code::CODE_WRONG);
        }
        if ($result['return_code'] == 'FAIL' && array_key_exists('return_msg', $result)) {
            throw new \Exception($result['return_msg'], Code::CODE_WRONG);
        }
        throw new \Exception('查询异常，请联系管理员', Code::CODE_WRONG);
    }
}
