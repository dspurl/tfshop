<?php

return [
    'service'=>env('SMS_SERVICE', 'aliyun'),         // 服务商
    // 阿里云
    'aliyun'=>[
        'access_id' => env('SMS_ALIYUN_ACCESS_ID', ''),         // 账号ID
        'secret' => env('SMS_ALIYUN_SECRET', ''),         // 密钥
        'signature' => env('SMS_ALIYUN_SIGNATURE', ''),         // 签名
        'verification_code'=> env('SMS_ALIYUN_VERIFICATION_CODE', ''),  //验证码模版CODE
    ]
];
