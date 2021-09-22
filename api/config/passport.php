<?php

return [

    /*
    |--------------------------------------------------------------------------
    | oauth验证
    |--------------------------------------------------------------------------
    |
    */

    //获取token
    'proxy' => [
        'grant_type' => 'password',
        'client_id' => env('PASSPORT_CLIENT_ID',''),
        'client_secret' => env('PASSPORT_CLIENT_SECRET',''),
        'scope' => '*',
    ],

    //刷新token
    'refresh' => [
        'grant_type' => 'refresh_token',
        'client_id' => env('PASSPORT_CLIENT_ID',''),
        'client_secret' => env('PASSPORT_CLIENT_SECRET',''),
        'scope' => '*',
    ],
    'expires_in' => env('PASSPORT_EXPIRES_IN','7200'),  // token失效时间(单位秒)，默认为2小时
    'refresh_expires_in' => env('REFRESH_PASSPORT_EXPIRES_IN','604800'),  // token刷新失效时间(单位秒)，默认为7天
];
