<?php

return [

    /*
    |--------------------------------------------------------------------------
    | 智能设备
    |--------------------------------------------------------------------------
    */


    'category' => [
    /*
    |--------------------------------------------------------------------------
    | Home Assistant品类
    |--------------------------------------------------------------------------
    |
    |  windows下搭建的Homestead，因软链接无法使用，故进行了特别处理
    |
    */
      'hass'  =>[
          'alarm',
          'automation',
          'binary-sensor',
          'calendar',
          'camera',
          'climate',
          'cover',
          'diy',
          'device-automation',
          'doorbell',
          'downloading',
          'energy',
          'environment',
          'fan',
          'finance',
          'front-end',
          'geolocation',
          'health',
          'history',
          'hub',
          'image-processing',
          'intent',
          'irrigation',
          'light',
          'lock',
          'mailbox',
          'light',
          'lock',
          'mailbox',
          'media-player',
          'multimedia',
          'network',
          'notifications',
          'organization',
          'postal-service',
          'presence-detection',
          'remote',
          'scene',
          'sensor',
          'social',
          'switch',
          'system-monitor',
          'text-to-speech',
          'transport',
          'utility',
          'vacuum',
          'voice',
          'water-heater',
          'weather',
          'other'
      ]
    ],
    //指令
    'service'=>[
        //天猫精灵转HASS
        //参考：https://doc-bot.tmall.com/docs/doc.htm?spm=0.0.0.0.0ovNsV&treeId=393&articleId=107454&docType=1#
        'aligenie'=>[
            'TurnOn'=>'turn_on',
            'TurnOff'=>'turn_off',
        ]
    ]
];
