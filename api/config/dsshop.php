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
    'appVersion' => '2.4.0',   //当前应用版本，此为固定值，用于版本升级所用，请不要随意修改
    'applySecret' => env('PROJECT_KEY', 'base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM='), //API密钥串
    'orderOvertime' => env('ORDER_OVERTIME', 1440),  // 订单超时时间(分钟)
    'automaticReceivingState' => env('AUTOMATIC_RECEIVING_STATE', true),  // 是否开启自动收货
    'automaticReceiving' => env('AUTOMATIC_RECEIVING', 7),  // 多少天后自动收货(天)
    'maxFileUploadSize' => env('MAX_FILE_UPLOAD_SIZE', 2 * 1024 * 1024),  // 文件最大上传大小2M
    'down'  => env('APP_DOWN', false),   // 维护模式

    // 插件市场相关配置
    'marketApplicationSecret' => env('MARKET_APPLICATION_SECRET', null),    // 插件市场应用密钥
    'marketApplySecret' => env('MARKET_APPLY_SECRET', null),    // 开发者密钥
    'marketUrl' => 'https://dsshoping.dswjcms.com',    // 插件市场地址，此为固定值，请不要随意修改
];
