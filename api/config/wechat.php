<?php

/*
 * This file is part of the overtrue/laravel-wechat.
 *
 * (c) overtrue <i@overtrue.me>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

return [
    /*
     * 默认配置，将会合并到各模块中
     */
    'defaults' => [
        /*
         * 指定 API 调用返回结果的类型：array(default)/collection/object/raw/自定义类名
         */
        'response_type' => 'array',

        /*
         * 使用 Laravel 的缓存系统
         */
        'use_laravel_cache' => true,

        /*
         * 日志配置
         *
         * level: 日志级别，可选为：
         *                 debug/info/notice/warning/error/critical/alert/emergency
         * file：日志文件位置(绝对路径!!!)，要求可写权限
         */
        'log' => [
            'level' => env('WECHAT_LOG_LEVEL', 'debug'),
            'file' => env('WECHAT_LOG_FILE', storage_path('logs/wechat.log')),
        ],
    ],

    /*
     * 路由配置
     */
    'route' => [
        /*
         * 开放平台第三方平台路由配置
         */
        // 'open_platform' => [
        //     'uri' => 'serve',
        //     'action' => Overtrue\LaravelWeChat\Controllers\OpenPlatformController::class,
        //     'attributes' => [
        //         'prefix' => 'open-platform',
        //         'middleware' => null,
        //     ],
        // ],
    ],

    /*
     * 公众号
     */
    'official_account' => [
        'default' => [
            'app_id' => env('WECHAT_OFFICIAL_ACCOUNT_APPID', 'your-app-id'),         // AppID
            'secret' => env('WECHAT_OFFICIAL_ACCOUNT_SECRET', 'your-app-secret'),    // AppSecret
            'token' => env('WECHAT_OFFICIAL_ACCOUNT_TOKEN', 'your-token'),           // Token
            'aes_key' => env('WECHAT_OFFICIAL_ACCOUNT_AES_KEY', ''),                 // EncodingAESKey

            /*
             * OAuth 配置
             *
             * scopes：公众平台（snsapi_userinfo / snsapi_base），开放平台：snsapi_login
             * callback：OAuth授权完成后的回调页地址(如果使用中间件，则随便填写。。。)
             */
            // 'oauth' => [
            //     'scopes'   => array_map('trim', explode(',', env('WECHAT_OFFICIAL_ACCOUNT_OAUTH_SCOPES', 'snsapi_userinfo'))),
            //     'callback' => env('WECHAT_OFFICIAL_ACCOUNT_OAUTH_CALLBACK', '/examples/oauth_callback.php'),
            // ],
        ],
    ],

    /*
     * 开放平台第三方平台
     */
    // 'open_platform' => [
    //     'default' => [
    //         'app_id'  => env('WECHAT_OPEN_PLATFORM_APPID', ''),
    //         'secret'  => env('WECHAT_OPEN_PLATFORM_SECRET', ''),
    //         'token'   => env('WECHAT_OPEN_PLATFORM_TOKEN', ''),
    //         'aes_key' => env('WECHAT_OPEN_PLATFORM_AES_KEY', ''),
    //     ],
    // ],

    /*
     * 小程序
     */
     'mini_program' => [
         'default' => [
             'app_id'  => env('WECHAT_MINI_PROGRAM_APPID', ''),
             'secret'  => env('WECHAT_MINI_PROGRAM_SECRET', ''),
             'token'   => env('WECHAT_MINI_PROGRAM_TOKEN', ''),
             'aes_key' => env('WECHAT_MINI_PROGRAM_AES_KEY', ''),
             'response_type'=> 'array',
         ],
     ],

    /*
     * 微信支付
     */
     'payment' => [
         'default' => [
             'sandbox'            => env('WECHAT_PAYMENT_SANDBOX', false),
             'app_id'             => env('WECHAT_PAYMENT_APPID', ''),
             'mch_id'             => env('WECHAT_PAYMENT_MCH_ID', ''),
             'key'                => env('WECHAT_PAYMENT_KEY', ''),
             'cert_path'          => storage_path().env('WECHAT_PAYMENT_CERT_PATH', ''),    // XXX: 绝对路径！！！！
             'key_path'           => storage_path().env('WECHAT_PAYMENT_KEY_PATH', ''),      // XXX: 绝对路径！！！！
             'notify_url'         => '',                           // 默认支付结果通知地址
         ],
         // ...
     ],

    /*
     * 企业微信
     */
    // 'work' => [
    //     'default' => [
    //         'corp_id' => 'xxxxxxxxxxxxxxxxx',
    //         'agent_id' => 100020,
    //         'secret'   => env('WECHAT_WORK_AGENT_CONTACTS_SECRET', ''),
    //          //...
    //      ],
    // ],
    /**
     * 访问来源 key 对应关系
     */
    'access_source_session_cnt' => [
        1 => '小程序历史列表',
        2 => '搜索',
        3 => '会话',
        4 => '扫一扫二维码',
        5 => '公众号主页',
        6 => '聊天顶部',
        7 => '系统桌面',
        8 => '小程序主页',
        9 => '附近的小程序',
        11 => '模板消息',
        12 => '客服消息',
        13 => '公众号菜单',
        14 => 'APP分享',
        15 => '支付完成页',
        16 => '长按识别二维码',
        17 => '相册选取二维码',
        18 => '公众号文章',
        19 => '钱包',
        20 => '卡包',
        21 => '小程序内卡券',
        22 => '其他小程序',
        23 => '其他小程序返回',
        24 => '卡券适用门店列表',
        25 => '搜索框快捷入口',
        26 => '小程序客服消息',
        27 => '公众号下发',
        28 => '系统会话菜单',
        29 => '任务栏-最近使用',
        30 => '长按小程序菜单圆点',
        31 => '连wifi成功页',
        32 => '城市服务',
        33 => '微信广告',
        34 => '其他移动应用',
        35 => '发现入口-我的小程序',
        36 => '任务栏-我的小程序',
        37 => '微信圈子',
        38 => '手机充值',
        39 => 'H5',
        40 => '插件',
        41 => '大家在用',
        42 => '发现页',
        43 => '浮窗',
        44 => '附近的人',
        45 => '看一看',
        46 => '朋友圈',
        47 => '企业微信',
        48 => '视频',
        49 => '收藏',
        50 => '微信红包',
        51 => '微信游戏中心',
        52 => '摇一摇',
        53 => '公众号导购消息',
        54 => '识物',
        55 => '小程序订单',
        56 => '小程序直播',
        57 => '群工具',
        10 => '其他'
    ]
];
