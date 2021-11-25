<?php

return
    /*
    |--------------------------------------------------------------------------
    | Sitemap配置
    | Sitemap configuration
    |--------------------------------------------------------------------------
    |   model       // 模型名  //没有模型的为单页面，只需配置url
    |   url         // 前端路由
    |   key         // 参数名
    |   connector   //  参数连接符&最前面会换成?其它符号原样拼接
    |   where       // 查询条件，支持多个条件
    |
    */
    env('SITE_MAP', [
        [
            'model' => '',
            'url' => '',
        ],
        [
            'model' => '',
            'url' => 'category/list',
        ],
        [
            'model' => 'Good',
            'url' => 'product/detail',
            'connector' => '&',
            'key' => ['id'],
            'where' => [
                [
                    'column' => 'is_show',
                    'operator' => '=',
                    'value' => 1
                ]
            ],
        ]
    ]);
