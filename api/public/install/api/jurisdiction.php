<?php

include_once 'common.php';
/**
 * 目录权限
 */
$return =[
    [
        'catalogue'=>'storage/framework/',
        'jurisdiction'=>getPermission('../../../storage/framework/')['jurisdiction'],
        'state'=>getPermission('../../../storage/framework/')['state'],
    ],
    [
        'catalogue'=>'storage/logs/',
        'jurisdiction'=>getPermission('../../../storage/framework/')['jurisdiction'],
        'state'=>getPermission('../../../storage/framework/')['state'],
    ],
    [
        'catalogue'=>'bootstrap/cache/',
        'jurisdiction'=>getPermission('../../../storage/framework/')['jurisdiction'],
        'state'=>getPermission('../../../storage/framework/')['state'],
    ],
];

resReturn($return);