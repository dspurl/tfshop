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
        'client_id' => env('PASSPORT_CLIENT_ID', 0),
        'client_secret' => env('PASSPORT_CLIENT_SECRET', 0),
        'scope' => '*',
    ],

    //刷新token
    'refresh' => [
        'grant_type' => 'refresh_token',
        'client_id' => env('PASSPORT_CLIENT_ID', 0),
        'client_secret' => env('PASSPORT_CLIENT_SECRET', 0),
        'scope' => '*',
    ],
];
