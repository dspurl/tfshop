<?php
return [
    /*
    |--------------------------------------------------------------------------
    | 提示信息语言包
    |--------------------------------------------------------------------------
    |
    |
    */
    //常规
    'routine' =>[
        'user'          =>  '用户',
        'username'      =>  '用户名',
        'cellphone'     =>  '手机号码',
        'password'      =>  '密码',
        'delete'        =>  '删除',
        'add'           =>  '添加',
        'modification'  =>  '修改',
        'parameter'     =>  '参数',
        'email'         =>  '邮箱',
        'portrait'      =>  '头像',
        'character'     =>  '角色名称',
        'describe'      =>  '描述',
        'permissions'   =>  '权限',
        'permissions_name'=>  '权限名称',
        'api'           =>  'API',
        'grouping'      =>  '分组',
    ],
    //错误提示
    'error' =>[
        'nonentity'     =>  ':attribute不存在',
        'falseness'     =>  ':attribute不正确',
        'mistake'       =>  ':attribute有误',
        'not_null'      =>  ':attribute不能为空',
        'exist'         =>  ':attribute已存在',
        'exceed'        =>  ':attribute不能超过:place',
        'uploading'     =>  ':attribute必须上传',
        'distribution'  =>  '请分配:specification',
        'select'        =>  '请选择:specification',
    ],
    //成功提示
    'succeed' =>[
        'win'           =>  ':attribute成功',
    ],
    //权限提示
    'rules' =>[
        'config_wrong'  => '权限配置有误',
        'account_without'=> '该账号无权限',
        'without'       => '无权限访问',
        'unconfigured'  => '该权限未配置',
    ],
];