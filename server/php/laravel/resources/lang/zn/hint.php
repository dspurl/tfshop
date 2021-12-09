<?php
return [
    /*
    |--------------------------------------------------------------------------
    | 提示信息语言包
    |--------------------------------------------------------------------------
    |
    |
    */
    // 常见提示
    'common' => [
        'add'               =>  '添加',
        'amend'             =>  '修改',
        'save'              =>  '保存',
        'sort'              =>  '排序',
        'delete'            =>  '删除',
        'content_delete'     => '要删除的内容',
    ],
    // 错误提示
    'error' => [
        'nonentity'         =>  ':attribute不存在',
        'falseness'         =>  ':attribute不正确',
        'mistake'           =>  ':attribute有误',
        'not_null'          =>  ':attribute不能为空',
        'exist'             =>  ':attribute已存在',
        'exceed'            =>  ':attribute不能超过:place',
        'uploading'         =>  ':attribute必须上传',
        'illegality'        =>  '非法:specification',
        'distribution'      =>  '请分配:specification',
        'configuration'     =>  '请配置:specification',
        'select'            =>  '请选择:specification',
        'key_wrong'         =>  ':specification密钥有误',
        'alpha'             =>  ':attribute只能是字母',
        'accepted'          =>  ':attribute必须是"yes"，"on"，1或true',
        'active_url'        =>  ':attribute必须具有有效的 A 或 AAAA 记录',
        'after'             =>  '必须是:attribute之后的值对应的日期',
        'after_or_equal'    =>  '必须在:attribute之后或与给定的日期相同',
        'before'            =>  '必须是:attribute之前的值对应的日期',
        'date_equals'       =>  '必须等于给定日期',
        'before_or_equal'   =>  '必须在:attribute之前或与给定的日期相同',
        'alpha_dash'        =>  ':attribute只能包含字母、数字，短破折号（-）和下划线（_）',
        'alpha_num'         =>  ':attribute只能由字母和数字组成',
        'array'             =>  ':attribute必须是数组',
        'between'           =>  '必须在:min和:max之间',
        'boolean'           =>  ':attribute必须是true，false，1，0，"1"和"0"',
        'confirmed'         =>  ':attribute必须具有匹配字段_confirmation',
        'date'              =>  ':attribute必须是有效的日期',
        'date_format'       =>  '必须匹配给定的 format（日期格式）',
        'different'         =>  ':attribute必须与给定的字段field的值不同',
        'dimensions'        =>  ':attribute必须是图片并且图片比例必须符合规则',
        'integer'           =>  ':attribute必须是整数',
        'email'             =>  ':attribute必须是邮箱',
        'filled'            =>  ':attribute存在时不能为空',
        'image'             =>  ':attribute必须是图片',
        'ip'                =>  ':attribute必须是ip',
        'ipv4'              =>  ':attribute必须是ipv4地址',
        'ipv6'              =>  ':attribute必须是ipv6地址',
        'ipv6'              =>  ':attribute必须是ipv6地址',
        'numeric'           =>  ':attribute必须为数值',
        'url'               =>  ':attribute必须为有效的URL',
        'uuid'              =>  ':attribute必须为有效的UUID',
        'parameter_wrong'   =>  '参数有误',


    ],
    // 成功提示
    'succeed' => [
        'win'           =>  ':attribute成功',
    ],
    // 系统提示
    'system' => [
        'login_timeout'                         =>  '登录超时，请重新登录',
        'incorrect_permission_configuration'    =>  '权限配置有误',
        'account_has_no_permission'             =>  '该账号无权限',
        'permission_is_not_configured'          =>  '该权限未配置',
    ]
];
