<?php

return [

    /*
    |--------------------------------------------------------------------------
    | oauth验证
    |--------------------------------------------------------------------------
    |
    */
    // 后台
    'admin' => [
        'proxy' => [
            'grant_type' => 'password',
            'client_id' => env('PASSPORT_CLIENT_ID',''),
            'client_secret' => env('PASSPORT_CLIENT_SECRET',''),
            'scope' => '*',
        ],
        'refresh' => [
            'grant_type' => 'refresh_token',
            'client_id' => env('PASSPORT_CLIENT_ID',''),
            'client_secret' => env('PASSPORT_CLIENT_SECRET',''),
            'scope' => '*',
        ],
    ],
    // web
    'web' => [
        'proxy' => [
            'grant_type' => 'password',
            'client_id' => env('PASSPORT_WEB_ID',''),
            'client_secret' => env('PASSPORT_WEB_SECRET',''),
            'scope' => '*',
        ],
        'refresh' => [
            'grant_type' => 'refresh_token',
            'client_id' => env('PASSPORT_WEB_ID',''),
            'client_secret' => env('PASSPORT_WEB_SECRET',''),
            'scope' => '*',
        ],
    ],
    'hash_client_secrets' => env('HASH_CLIENT_SECRETS', false),   //客户端秘钥的 hash 加密
    'expires_in' => env('PASSPORT_EXPIRES_IN','7200'),  // token失效时间(单位秒)，默认为2小时;这里设置超过1天，移动端的token刷新才会有效
    'refresh_expires_in' => env('REFRESH_PASSPORT_EXPIRES_IN','604800'),  // token刷新失效时间(单位秒)，默认为7天
];
