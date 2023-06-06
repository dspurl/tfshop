<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
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
