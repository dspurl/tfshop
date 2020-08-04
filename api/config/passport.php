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
        'client_id' => '2',
        'client_secret' => 'CbEkExxg7yDmb4vQBYeEIiXG9wv5yS7qhc8nvf6e',
        'scope' => '*',
    ],

    //刷新token
    'refresh' => [
        'grant_type' => 'refresh_token',
        'client_id' => '2',
        'client_secret' => 'CbEkExxg7yDmb4vQBYeEIiXG9wv5yS7qhc8nvf6e',
        'scope' => '*',
    ],
];
