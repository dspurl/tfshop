<?php

return [
    'debug' => env('TT_DEBUG', true),

    'default' => env('TT_DEFAULT_APP', 'default'),

    'drivers' => [
        'default' => [
            'access_key' => env('TT_APP_ID'),
            'secret_key' => env('TT_APP_SECRET'),

            'payment_app_id' => env('TT_PAYMENT_APP_ID'),
            'payment_merchant_id' => env('TT_PAYMENT_MERCHANT_ID'),
            'payment_secret' => env('TT_PAYMENT_SECRET'),
            'payment_salt' => env('TT_PAYMENT_SALT'),
            'payment_token' => env('TT_PAYMENT_TOKEN'),
        ]
    ],
];
