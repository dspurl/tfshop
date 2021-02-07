<?php

namespace App\common;

/**
 *
 * 阿里云短信
 *
 */

use AlibabaCloud\Client\AlibabaCloud;
use AlibabaCloud\Client\Exception\ClientException;
use AlibabaCloud\Client\Exception\ServerException;

class Aliyun
{
    public $config;

    public function __construct()
    {
        $aliyunConfig = config('sms.aliyun');
        $config = [
            'accessKeyId' => $aliyunConfig['access_id'],
            'accessSecret' => $aliyunConfig['secret'],
            'SignName' => $aliyunConfig['signature'],
            'TemplateCode' => $aliyunConfig['verification_code'],
        ];
        $this->config = $config;
    }

    /**
     * 发送短信
     * @param $query
     * @return \AlibabaCloud\Client\Result\Result|string
     * @throws ClientException
     */
    protected function sendNote($query)
    {
        AlibabaCloud::accessKeyClient($this->config['accessKeyId'], $this->config['accessSecret'])
            ->regionId('cn-hangzhou')
            ->asDefaultClient();

        try {
            $result = AlibabaCloud::rpc()
                ->product('Dysmsapi')
                // ->scheme('https') // https | http
                ->version('2017-05-25')
                ->action('SendSms')
                ->method('POST')
                ->host('dysmsapi.aliyuncs.com')
                ->options([
                    'query' => $query,
                ])
                ->request();
            return $result->toArray();
        } catch (ClientException $e) {
            return $e->getErrorMessage() . PHP_EOL;
        } catch (ServerException $e) {
            return $e->getErrorMessage() . PHP_EOL;
        }
    }

    /**
     * 发送短信验证码
     * @param $phone
     * @param $code
     * @return \AlibabaCloud\Client\Result\Result|string
     * @throws ClientException
     */
    public function sendCode($phone, $code)
    {
        $query = [
            'RegionId' => "cn-hangzhou",
            'PhoneNumbers' => $phone,
            'SignName' => $this->config['SignName'],
            'TemplateCode' => $this->config['TemplateCode'],
            'TemplateParam' => '{"code":"' . $code . '"}',
        ];
        return $this->sendNote($query);
    }
}
