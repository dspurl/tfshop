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

    /**
     * 发送短信
     * @param $config
     * @param $query
     * @return \AlibabaCloud\Client\Result\Result|string
     */
    protected function sendNote($config,$query)
    {
        AlibabaCloud::accessKeyClient($config['accessKeyId'], $config['accessSecret'])
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
     */
    public function sendCode($config,$phone,$code){
        $query=[
            'RegionId' => "cn-hangzhou",
            'PhoneNumbers' => $phone,
            'SignName' => $config['SignName'],
            'TemplateCode' => $config['TemplateCode'],
            'TemplateParam' => '{"code":"'.$code.'"}',
        ];
       return $this->sendNote($config,$query);
    }
}