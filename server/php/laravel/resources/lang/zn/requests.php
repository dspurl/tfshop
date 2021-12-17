<?php
return [
    /*
    |--------------------------------------------------------------------------
    | 请求语言包
    |--------------------------------------------------------------------------
    |
    |
    */
    'user' => [
        'name'                      => '用户名',
        'email'                     => '邮箱',
        'cellphone'                 => '手机号',
        'password'                  => '密码',
        'portrait'                  => '头像',
    ],
    'role' => [
        'roles'                     => '角色别名',
        'introduction'              => '角色名称',
    ],
    'power' => [
        'title'                     => '权限名称',
        'api'                       => '权限别名',
        'dragging_node'             => '拖拽对象',
        'drop_node'                 => '释放对象',
        'drop_type'                 => '释放对象的位置',
    ],
    'auth_group_auth_rule' => [
        'ids'                       => '权限ID'
    ],
    'resource' => [
        'resource_group_id'         => '资源分组ID',
        'ids'                       => '资源ID',
    ],
    'resource_group' => [
        'name'                      => '资源分组名称',
    ],
    'resource_type' => [
        'name'                      => '资源类型名称',
        'alias'                     => '资源类型别名',
        'icon'                      => '资源类型图标',
        'extension'                 => '资源类型后缀',
        'specification'             => '资源类型规格',
        'size'                      => '资源类型大小'
    ],
    'resource_upload' => [
        'uuid'                      => 'UUID'
    ],
    'admin_filter' => [
        'title'                     => '过滤器名称',
        'auth_rule_id'              => '过滤器对应权限',
        'type'                      => '类型',
        'data'                      => '过滤器条件'
    ],
];
