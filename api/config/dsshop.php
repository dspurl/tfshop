<?php

return [

    /*
    |--------------------------------------------------------------------------
    | dsshop个性化配置
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | Homestead windows
    |--------------------------------------------------------------------------
    |
    |  windows下搭建的Homestead，因软链接无法使用，故进行了特别处理
    |
    */

    'homestead' => env('HOMESTEAD_WINDOWS', false),
    'failuretime' => env('VERIFICATION_CODE_FAILURE_TIME', 60), // 验证码失效时间秒，默认60秒
    'versions' => env('API_VERSIONS', 1),   //当前版本
    'applySecret' => env('PROJECT_KEY', 'base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM='), //API密钥串
    'orderOvertime' => env('ORDER_OVERTIME', 1440),  // 订单超时时间(分钟)
    'automaticReceivingState' => env('AUTOMATIC_RECEIVING_STATE', true),  // 是否开启自动收货
    'automaticReceiving' => env('AUTOMATIC_RECEIVING', 7),  // 多少天后自动收货(天)
];
