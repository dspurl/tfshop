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
        'table_name'                => 'Administrator',
        'user_id'                   => 'Associated user ID',
        'name'                      => 'Account',
        'real_name'                 => 'Real name',
        'email'                     => 'Email',
        'cellphone'                 => 'Cellphone',
        'password'                  => 'Password',
        'portrait'                  => 'Portrait',
        'state'                     => 'State:1=Normal-normal,2=Forbid-forbid',
    ],
    'auth_rule' => [
        'table_name'                => 'Permission',
        'title'                     => 'Permission name',
        'api'                       => 'Alias',
        'path'                      => 'Route',
        'active'                    => 'Menu highlighting',
        'redirect_url'              => 'redirect',
        'view'                      => 'View',
        'icon'                      => 'Icon',
        'color'                     => 'Color',
        'pid'                       => 'PID',
        'type'                      => 'Type:1=Menu-menu,2=Iframe-iframe,3=Link-link,4=Button-button',
        'is_hidden'                 => 'Whether to hide in the menu:1=Yes-yes,0=No-no',
        'is_hidden_breadcrumb'      => 'Whether to hide the bread crumbs:1=Yes-yes,0=No-no',
        'is_affix'                  => 'Whether fixed:1=Yes-yes,0=No-no',
        'is_full_page'              => 'Whether to open routing on the whole page:1=Yes-yes,0=No-no',
        'sort'                      => 'Sort'
    ],
    'admin_auth_group' => [
        'admin_id'                  => 'Permissions group ID',
        'auth_group_id'             => 'Permission ID'
    ],
    'resource' => [
        'table_name'                => 'Resource',
        'resource_type_id'          => 'Resource Type ID',
        'resource_group_id'         => 'Resource group ID',
        'resource_id'               => 'Associated resource ID',
        'name'                      => 'Resource name',
        'depict'                    => 'Resources alias',
        'url'                       => 'Resources url',
        'info'                      => 'upload information',
    ],
    'resource_group' => [
        'table_name'                => 'Resource group',
        'pid'                       => 'PID',
        'name'                      => 'Resource group name',
        'sort'                      => 'Sort',
    ],
    'resource_type' => [
        'table_name'                => 'Resource type',
        'name'                      => 'Resource type name',
        'alias'                     => 'Resource type alias',
        'icon'                      => 'Resource type icon',
        'size'                      => 'Resource type size',
        'extension'                 => 'Resource type suffix',
        'specification'             => 'Resource type specifications',
    ],
];
