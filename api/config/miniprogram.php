<?php

return [
    /*
    |--------------------------------------------------------------------------
    | 支付宝小程序配置
    |--------------------------------------------------------------------------
    |
    |
    */
    'alipay' => [
        'app_id'=> env('ALIPAY_MINI_PROGRAM_APPID', ''),
        'gatewayUrl'=> env('ALIPAY_MINI_PROGRAM_GATEWAY_URL', 'https://openapi.alipay.com/gateway.do'),
        'rsaPrivateKey'=> env('ALIPAY_MINI_PROGRAM_RSA_PRIVATE_KEY', ''),
        'rsaPublicKey'=> env('ALIPAY_MINI_PROGRAM_RSA_PUBLIC_KEY', '')
    ],
    'toutiao' => [
        'app_id'=> env('TOUTIAO_MINI_PROGRAM_APPID', ''),
        'secret'=> env('TOUTIAO_MINI_PROGRAM_SECRET', '')
    ]
];
