<?php
return [
    /*
    |--------------------------------------------------------------------------
    | 数据迁移语言包
    |--------------------------------------------------------------------------
    |
    |
    */
    'admin' => [
        'table_name'                => '管理员',
        'user_id'                   => '关联用户ID',
        'name'                      => '账号',
        'real_name'                 => '真实姓名',
        'email'                     => '邮箱',
        'cellphone'                 => '手机',
        'password'                  => '密码',
        'portrait'                  => '头像',
        'state'                     => '状态:1=正常-normal,2=禁止-forbid',
    ],
    'auth_rule' => [
        'table_name'                => '权限',
        'title'                     => '权限名称',
        'api'                       => '别名',
        'path'                      => '路由',
        'active'                    => '菜单高亮',
        'redirect_url'              => '重定向',
        'view'                      => '视图',
        'icon'                      => '图标',
        'color'                     => '颜色值',
        'pid'                       => '父ID',
        'type'                      => '类型:1=菜单-menu,2=iframe-iframe,3=外链-link,4=按钮-button',
        'is_hidden'                 => '是否在菜单隐藏:1=是-yes,0=否-no',
        'is_hidden_breadcrumb'      => '是否隐藏面包屑:1=是-yes,0=否-no',
        'is_affix'                  => '是否固定:1=是-yes,0=否-no',
        'is_full_page'              => '是否整页打开路由:1=是-yes,0=否-no',
        'sort'                      => '排序'
    ],
    'admin_auth_group' => [
        'admin_id'                  => '权限组ID',
        'auth_group_id'             => '权限ID'
    ],
    'resource' => [
        'table_name'                => '资源',
        'resource_type_id'          => '资源类型ID',
        'resource_group_id'         => '资源分组ID',
        'resource_id'               => '关联资源ID',
        'name'                      => '资源名称',
        'depict'                    => '资源别名',
        'url'                       => '资源地址',
        'info'                      => '上传信息',
    ],
    'resource_group' => [
        'table_name'                => '资源分组',
        'pid'                       => '父ID',
        'name'                      => '资源分组名称',
        'sort'                      => '排序',
    ],
    'resource_type' => [
        'table_name'                => '资源类型',
        'name'                      => '资源类型名称',
        'alias'                     => '资源类型别名',
        'icon'                      => '资源类型图标',
        'size'                      => '资源类型大小',
        'extension'                 => '资源类型后缀',
        'specification'             => '资源类型规格',
    ],
];
