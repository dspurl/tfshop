<?php
include_once 'common.php';
/**
 * 服务器检测
 */
$return=[
    [
        'server'=>'php(version '.PHP_VERSION.' required)',
        'value'=>'7.4',
        'state'=>PHP_VERSION >= '7.4' ? PHP_VERSION : false
    ],
    [
        'server'=>'curl',
        'value'=>'',
        'state'=>extension_loaded('curl') ? true : false
    ],
    [
        'server'=>'pdo',
        'value'=>'',
        'state'=>extension_loaded('pdo') ? true : false
    ],
    [
        'server'=>'openssl',
        'value'=>'',
        'state'=>extension_loaded('openssl') ? true : false
    ],
    /*  [
          'install'=>'pcntl',
          'value'=>'',
          'state'=>extension_loaded('pcntl') ? true : false
      ],*/
    [
        'server'=>'redis',
        'value'=>'',
        'state'=>extension_loaded('redis') ? true : false
    ],
];
resReturn($return);
