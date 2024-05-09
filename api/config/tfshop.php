<?php
/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
return [

    /*
    |--------------------------------------------------------------------------
    | tfshop个性化配置
    |--------------------------------------------------------------------------
    */
    /**
     * 项目所有配置说明，用来后台配置和配置数据库生成所用
     *
     * children         // 子级
     * name             // 配置名称
     * maxlength        // 配置长度
     * required         // 是否必填
     * remark          // 配置说明
     * input_type        // 配置表单类型
     * style            // 配置表单样式json
     * key              // 配置key，需要和文件配置名相同，如tfshop.config
     * value            // 配置value
     * input_option      // 表单选项json
     */
    'config' => [
        [
            'name' => '开发配置',
            'remark' =>'开发相关配置，请不要随意修改，修改后可能导致项目无法正常运行',
            'children' => [
                [
                    'name' => '客户端密钥',
                    'remark' => '用与后端与客户端通信所用，修改后需要修改客户端的密钥',
                    'input_type' => 'input',
                    'required' => true,
                    'style' => [
                        'width' => 200
                    ],
                    'keys' => 'tfshop.applySecret',
                    'value' => env('PROJECT_KEY', 'base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM=')
                ],
                [
                    'name' => '默认语言',
                    'remark' => '设置系统默认语言，默认为zh',
                    'input_type' => 'input',
                    'required' => true,
                    'style' => [
                        'width' => 200
                    ],
                    'keys' => 'tfshop.defaultLanguage',
                    'value' => 'zh'
                ],
                [
                    'name' => '调试模式',
                    'remark' => '开启后，接口错误信息将全部返回，正式环境请保持关闭状态',
                    'input_type' => 'switch',
                    'input_option' => [
                        [
                            'name'=> '关',
                            'value'=> false
                        ],
                        [
                            'name'=> '开',
                            'value'=> true
                        ]
                    ],
                    'required' => true,
                    'keys' => 'app.debug',
                    'value' => env('APP_DEBUG')
                ],
                [
                    'name' => '配置重置',
                    'remark' => '开启后，所有后台配置都将还原到config目录下配置的内容，重置后无法找回，请谨慎操作！！！',
                    'input_type' => 'switch',
                    'input_option' => [
                        [
                            'name'=> '否',
                            'value'=> false
                        ],
                        [
                            'name'=> '是',
                            'value'=> true
                        ]
                    ],
                    'required' => true,
                    'keys' => 'tfshop.reset',
                    'value' => false
                ],
                [
                    'name' => '配置同步',
                    'remark' => '开启后，config目录下配置的内容如果不存在数据库中，则会添加',
                    'input_type' => 'switch',
                    'input_option' => [
                        [
                            'name'=> '否',
                            'value'=> false
                        ],
                        [
                            'name'=> '是',
                            'value'=> true
                        ]
                    ],
                    'required' => true,
                    'keys' => 'tfshop.sync',
                    'value' => false
                ],
            ]
        ],
        [
            'name' => '商品配置',
            'remark' =>'涉及商品的相关配置',
            'children' => [
                [
                    'name' => '低库存数量',
                    'remark' => '低于该值，刚标记为低库存商品',
                    'input_type' => 'input',
                    'required' => true,
                    'style' => [
                        'width' => 200
                    ],
                    'keys' => 'tfshop.lowInventory',
                    'value' => env('LOW_INVENTORY', 10)
                ]
            ]
        ],
        [
            'name' => '邮箱配置',
            'remark' =>'邮箱配置后项目才会开启邮件相关通知',
            'children' => [
                [
                    'name' => '邮箱地址',
                    'input_type' => 'input',
                    'maxlength' => 255,
                    'required' => true,
                    'style' => [
                        'width' => 300
                    ],
                    'keys' => 'mail.host',
                    'value' => env('MAIL_HOST')
                ],
                [
                    'name' => '邮箱服务',
                    'input_type' => 'input',
                    'maxlength' => 20,
                    'required' => true,
                    'style' => [
                        'width' => 100
                    ],
                    'keys' => 'mail.driver',
                    'value' => env('MAIL_DRIVER')
                ],
                [
                    'name' => '邮箱端口',
                    'input_type' => 'input',
                    'maxlength' => 20,
                    'required' => true,
                    'style' => [
                        'width' => 100
                    ],
                    'keys' => 'mail.port',
                    'value' => env('MAIL_PORT')
                ],
                [
                    'name' => '邮箱账号',
                    'input_type' => 'input',
                    'maxlength' => 255,
                    'required' => true,
                    'style' => [
                        'width' => 300
                    ],
                    'keys' => 'mail.username',
                    'value' => env('MAIL_USERNAME')
                ],
                [
                    'name' => '邮箱密码',
                    'input_type' => 'inputShowPassword',
                    'maxlength' => 255,
                    'required' => true,
                    'style' => [
                        'width' => 300
                    ],
                    'keys' => 'mail.password',
                    'value' => env('MAIL_PASSWORD')
                ],
                [
                    'name' => '邮箱加密协议',
                    'input_type' => 'input',
                    'maxlength' => 50,
                    'required' => true,
                    'style' => [
                        'width' => 100
                    ],
                    'keys' => 'mail.encryption',
                    'value' => env('MAIL_ENCRYPTION')
                ],
                [
                    'name' => '发件人地址',
                    'input_type' => 'input',
                    'maxlength' => 255,
                    'required' => true,
                    'style' => [
                        'width' => 300
                    ],
                    'keys' => 'mail.from.address',
                    'value' => env('MAIL_FROM_ADDRESS')
                ],
                [
                    'name' => '发件人名称',
                    'input_type' => 'input',
                    'maxlength' => 200,
                    'required' => true,
                    'style' => [
                        'width' => 200
                    ],
                    'keys' => 'mail.from.name',
                    'value' => env('MAIL_FROM_NAME')
                ],
            ]
        ],
        [
            'name' => '小程序配置',
            'remark' =>'小程序相关配置，需要分别配置不同平台的小程序信息',
            'children' => [
                [
                    'name' => '微信小程序',
                    'remark' =>'微信小程序相关配置',
                    'children' => [
                        [
                            'name' => 'ID',
                            'input_type' => 'input',
                            'remark' =>'微信小程序ID',
                            'required' => false,
                            'keys' => 'wechat.mini_program.default.app_id',
                            'value' => env('WECHAT_MINI_PROGRAM_APPID')
                        ],
                        [
                            'name' => '密钥',
                            'input_type' => 'input',
                            'remark' =>'微信小程序密钥',
                            'required' => false,
                            'keys' => 'wechat.mini_program.default.secret',
                            'value' => env('WECHAT_MINI_PROGRAM_SECRET')
                        ],
                        [
                            'name' => 'token',
                            'input_type' => 'input',
                            'remark' =>'微信小程序token',
                            'required' => false,
                            'keys' => 'wechat.mini_program.default.token',
                            'value' => env('WECHAT_MINI_PROGRAM_TOKEN')
                        ],
                        [
                            'name' => '消息加密密钥',
                            'input_type' => 'input',
                            'remark' =>'微信小程序消息加密密钥',
                            'required' => false,
                            'keys' => 'wechat.mini_program.default.aes_key',
                            'value' => env('WECHAT_MINI_PROGRAM_AES_KEY')
                        ],
                    ]
                ],
                [
                    'name' => '支付宝小程序',
                    'remark' =>'支付宝小程序相关配置',
                    'children' => [
                        [
                            'name' => 'ID',
                            'input_type' => 'input',
                            'remark' =>'支付宝小程序ID',
                            'required' => false,
                            'keys' => 'miniprogram.alipay.app_id',
                            'value' => env('ALIPAY_MINI_PROGRAM_APPID')
                        ],
                        [
                            'name' => '地址',
                            'input_type' => 'input',
                            'remark' =>'支付宝小程序地址',
                            'required' => false,
                            'keys' => 'miniprogram.alipay.gatewayUrl',
                            'value' => env('ALIPAY_MINI_PROGRAM_GATEWAY_URL', 'https://openapi.alipay.com/gateway.do')
                        ],
                        [
                            'name' => '私钥',
                            'input_type' => 'input',
                            'remark' =>'支付宝小程序私钥',
                            'required' => false,
                            'keys' => 'miniprogram.alipay.rsaPrivateKey',
                            'value' => env('ALIPAY_MINI_PROGRAM_RSA_PRIVATE_KEY')
                        ],
                        [
                            'name' => '公钥',
                            'input_type' => 'input',
                            'remark' =>'支付宝小程序公钥',
                            'required' => false,
                            'keys' => 'miniprogram.alipay.rsaPublicKey',
                            'value' => env('ALIPAY_MINI_PROGRAM_RSA_PUBLIC_KEY')
                        ],
                    ]
                ],
                [
                    'name' => '头条小程序',
                    'remark' =>'头条小程序相关配置',
                    'children' => [
                        [
                            'name' => 'ID',
                            'input_type' => 'input',
                            'remark' =>'头条小程序ID',
                            'required' => false,
                            'keys' => 'miniprogram.toutiao.app_id',
                            'value' => env('TOUTIAO_MINI_PROGRAM_APPID')
                        ],
                        [
                            'name' => '密钥',
                            'input_type' => 'input',
                            'remark' =>'头条小程序密钥',
                            'required' => false,
                            'keys' => 'miniprogram.toutiao.secret',
                            'value' => env('TOUTIAO_MINI_PROGRAM_SECRET')
                        ],
                    ]
                ],
            ]
        ],
        [
            'name' => '公众平台配置',
            'remark' =>'公众平台相关配置，需要分别配置不同平台的小程序信息',
            'children' => [
                [
                    'name' => '微信公众平台',
                    'remark' =>'微信公众平台相关配置',
                    'children' => [
                        [
                            'name' => 'ID',
                            'input_type' => 'input',
                            'remark' =>'微信公众平台ID',
                            'required' => false,
                            'keys' => 'wechat.official_account.default.app_id',
                            'value' => env('WECHAT_OFFICIAL_ACCOUNT_APPID')
                        ],
                        [
                            'name' => '密钥',
                            'input_type' => 'input',
                            'remark' =>'微信公众平台密钥',
                            'required' => false,
                            'keys' => 'wechat.official_account.default.secret',
                            'value' => env('WECHAT_OFFICIAL_ACCOUNT_SECRET')
                        ],
                        [
                            'name' => 'token',
                            'input_type' => 'input',
                            'remark' =>'微信公众平台token',
                            'required' => false,
                            'keys' => 'wechat.official_account.default.token',
                            'value' => env('WECHAT_OFFICIAL_ACCOUNT_TOKEN')
                        ],
                        [
                            'name' => '消息加密密钥',
                            'input_type' => 'input',
                            'remark' =>'微信公众平台消息加密密钥',
                            'required' => false,
                            'keys' => 'wechat.official_account.default.aes_key',
                            'value' => env('WECHAT_OFFICIAL_ACCOUNT_AES_KEY')
                        ],
                    ]
                ],
            ]
        ],
        [
            'name' => '支付配置',
            'remark' =>'支付相关配置',
            'children' => [
                [
                    'name' => '微信支付',
                    'children' => [
                        [
                            'name' => 'AppID',
                            'input_type' => 'input',
                            'remark' =>'微信支付账号的AppID',
                            'required' => true,
                            'keys' => 'wechat.payment.default.app_id',
                            'value' => env('WECHAT_PAYMENT_APPID')
                        ],
                        [
                            'name' => '商户号',
                            'input_type' => 'input',
                            'remark' =>'微信支付商户号',
                            'required' => true,
                            'keys' => 'wechat.payment.default.mch_id',
                            'value' => env('WECHAT_PAYMENT_MCH_ID')
                        ],
                        [
                            'name' => '密钥',
                            'input_type' => 'input',
                            'remark' =>'微信支付密钥',
                            'required' => true,
                            'keys' => 'wechat.payment.default.key',
                            'value' => env('WECHAT_PAYMENT_KEY')
                        ],
                        [
                            'name' => '微信支付公钥',
                            'input_type' => 'input',
                            'remark' =>'微信支付公钥绝对地址，位于storage目录下，需自行上传',
                            'required' => true,
                            'keys' => 'wechat.payment.default.cert_path',
                            'value' => env('WECHAT_PAYMENT_CERT_PATH')
                        ],
                        [
                            'name' => '微信支付私钥',
                            'input_type' => 'input',
                            'remark' =>'微信支付私钥绝对地址，位于storage目录下，需自行上传',
                            'required' => true,
                            'keys' => 'wechat.payment.default.key_path',
                            'value' => env('WECHAT_PAYMENT_KEY_PATH')
                        ],
                        [
                            'name' => '沙箱环境',
                            'input_type' => 'switch',
                            'input_option' => [
                                [
                                    'name'=> '否',
                                    'value'=> false
                                ],
                                [
                                    'name'=> '是',
                                    'value'=> true
                                ]
                            ],
                            'remark' =>'沙箱环境下不会拉起支付界面，不管是否支付成功，都会返回成功状态',
                            'required' => true,
                            'keys' => 'wechat.payment.default.sandbox',
                            'value' => env('WECHAT_PAYMENT_SANDBOX')
                        ],
                    ]
                ],
            ]
        ],
        [
            'name' => '模板消息',
            'remark' =>'小程序、公众平台订阅、模板相关消息的配置',
            'children' => [
                [
                    'name' => '微信小程序订阅消息',
                    'remark' =>'订阅消息需要用户主动发起',
                    'children' => [
                        [
                            'name' => '发货通知',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.miniweixin.delivery_release',
                            'value' => env('MINIWEIXIN_SUBSCRIPTION_INFORMATION_SHIPMENTS')
                        ],
                    ]
                ],
                [
                    'name' => '微信公众平台模板消息',
                    'remark' =>'微信公众平台模板消息，需要用户关注公众号，可以主动下发消息',
                    'children' => [
                        [
                            'name' => '订单支付成功通知',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.finish_payment',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_FINISH_PAYMENT')
                        ],
                        [
                            'name' => '订单确认收货通知',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.order_confirm_receipt',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_ORDER_CONFIRM_RECEIPT')
                        ],
                        [
                            'name' => '发货通知',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.delivery_release',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_SHIPMENTS')
                        ],
                        [
                            'name' => '退款成功通知',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.refund_success',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_REFUND_SUCCESS')
                        ],
                        [
                            'name' => '待发货提醒',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.admin_order_send_good',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_ADMIN_ORDER_SEND_GOOD')
                        ],
                        [
                            'name' => '订单完成通知',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.admin_order_completion',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_ADMIN_ORDER_COMPLETION')
                        ],
                        [
                            'name' => '接收账号',
                            'remark' =>'部分模板消息是发给平台的，需要配置接收消息的主体（通过用户管理中找到需要接收消息主体的ID填入，多个账号以英文逗号分割）',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.finish_payment',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_FINISH_PAYMENT')
                        ],
                    ]
                ],
            ]
        ],
        [
            'name' => '短信配置',
            'children' => [
                [
                    'name' => '服务商',
                    'remark' =>'请确保已选择的服务商已正常配置，不然将无法发送',
                    'input_type' => 'select',
                    'input_option' => [
                        [
                            'name'=> '阿里云',
                            'value'=> 'aliyun'
                        ]
                    ],
                    'required' => false,
                    'keys' => 'sms.service',
                    'value' => env('SMS_SERVICE', 'aliyun')
                ],
                [
                    'name' => '阿里云',
                    'children' => [
                        [
                            'name' => '账号ID',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'sms.aliyun.access_id',
                            'value' => env('SMS_ALIYUN_ACCESS_ID')
                        ],
                        [
                            'name' => '密钥',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'sms.aliyun.secret',
                            'value' => env('SMS_ALIYUN_SECRET')
                        ],
                        [
                            'name' => '签名',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'sms.aliyun.signature',
                            'value' => env('SMS_ALIYUN_SIGNATURE')
                        ],
                        [
                            'name' => '验证码模版CODE',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'sms.aliyun.verification_code',
                            'value' => env('SMS_ALIYUN_VERIFICATION_CODE')
                        ],
                    ]
                ],
            ]
        ],
        [
            'name' => '备份配置',
            'remark' =>'项目备份和数据库备份相关配置，按天配置，如果都需要备份，只需配置“备份时间”，一般只需要备份数据库即可',
            'children' => [
                [
                    'name' => '备份开关',
                    'remark' =>'是否需要开启备份',
                    'input_type' => 'switch',
                    'input_option' => [
                        [
                            'name'=> '关',
                            'value'=> false
                        ],
                        [
                            'name'=> '开',
                            'value'=> true
                        ]
                    ],
                    'required' => true,
                    'keys' => 'backup.switch',
                    'value' => env('BACKUP_SWITCH')
                ],
                [
                    'name' => '备份时间',
                    'remark' =>'设置后数据库和项目都会进行备份',
                    'input_type' => 'timeSelect',
                    'required' => false,
                    'keys' => 'backup.time',
                    'value' => env('BACKUP_TIME')
                ],
                [
                    'name' => '数据库备份时间',
                    'remark' =>'设置后仅备份数据库，备份时间失效',
                    'input_type' => 'timeSelect',
                    'required' => false,
                    'keys' => 'backup.db_time',
                    'value' => env('BACKUP_DB_TIME')
                ],
                [
                    'name' => '项目备份时间',
                    'remark' =>'设置后仅备份项目，备份时间失效',
                    'input_type' => 'timeSelect',
                    'required' => false,
                    'keys' => 'backup.files_time',
                    'value' => env('BACKUP_FILES_TIME')
                ],
                [
                    'name' => '备份消除时间',
                    'remark' =>'备份会在设置的时候进行自动清除最旧的备份，直到达到配置的存储大小',
                    'input_type' => 'timeSelect',
                    'required' => false,
                    'keys' => 'backup.clean_time',
                    'value' => env('BACKUP_CLEAN_TIME')
                ],
                [
                    'name' => '备份通知接收邮件',
                    'remark' =>'每天备份和清除后都会下发邮件到该账号，前提需要已完成邮件配置',
                    'input_type' => 'input',
                    'required' => false,
                    'keys' => 'backup.notifications.mail.to',
                    'value' => env('BACKUP_RECEIVE_MAIL')
                ],
            ]
        ],
        [
            'name' => '订单配置',
            'remark' =>'订单相关配置',
            'children' => [
                [
                    'name' => '订单超时时间',
                    'remark' =>'订单超时失效时间，单位：分钟',
                    'input_type' => 'input',
                    'required' => false,
                    'keys' => 'tfshop.orderOvertime',
                    'value' => env('ORDER_OVERTIME', 1440)
                ],
                [
                    'name' => '自动收货',
                    'remark' =>'开启自动收货后，系统在订单多少天后将自动帮客户进行收货',
                    'input_type' => 'switch',
                    'input_option' => [
                        [
                            'name'=> '关',
                            'value'=> false
                        ],
                        [
                            'name'=> '开',
                            'value'=> true
                        ]
                    ],
                    'required' => false,
                    'keys' => 'tfshop.automaticReceivingState',
                    'value' => env('AUTOMATIC_RECEIVING_STATE', true)
                ],
                [
                    'name' => '多少天后自动收货',
                    'remark' =>'多少天后自动收货，自动收货开启才有效',
                    'input_type' => 'input',
                    'required' => false,
                    'keys' => 'tfshop.automaticReceiving',
                    'value' => env('AUTOMATIC_RECEIVING', 7)
                ],
            ]
        ],
        [
            'name' => '上传配置',
            'children' => [
                [
                    'name' => '图片最大上传大小',
                    'remark' =>'单位:b',
                    'input_type' => 'input',
                    'required' => true,
                    'keys' => 'tfshop.file.image.size',
                    'value' => env('FILE_IMAGE_SIZE', 3 * 1024 * 1024)
                ],
                [
                    'name' => '图片支持的格式',
                    'remark' =>'用英文逗号分割',
                    'input_type' => 'input',
                    'required' => true,
                    'keys' => 'tfshop.file.image.extension',
                    'value' => env('FILE_IMAGE_EXTENSION', 'gif,jpg,jpeg,bmp,png')
                ],
                [
                    'name' => '自定义最大上传大小',
                    'remark' =>'单位:b',
                    'input_type' => 'input',
                    'required' => true,
                    'keys' => 'tfshop.file.custom.size',
                    'value' => env('FILE_CUSTOM_SIZE', 5 * 1024 * 1024)
                ],
                [
                    'name' => '自定义支持的格式',
                    'remark' =>'用英文逗号分割',
                    'input_type' => 'input',
                    'required' => true,
                    'keys' => 'tfshop.file.custom.extension',
                    'value' => env('FILE_CUSTOM_EXTENSION', 'gif,jpg,jpeg,bmp,png,zip,html,txt,json')
                ],
            ]
        ],
        // 英文
        [
            'lang' => 'en',
            'name' => 'Development configuration',
            'remark' =>'Do not modify development configurations. Otherwise, the project may fail to run properly',
            'children' => [
                [
                    'lang' => 'en',
                    'name' => 'Client key',
                    'remark' => 'For communication between the back-end and the client, the client key needs to be changed after modification',
                    'input_type' => 'input',
                    'required' => true,
                    'style' => [
                        'width' => 200
                    ],
                    'keys' => 'tfshop.applySecret',
                    'value' => env('PROJECT_KEY', 'base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM=')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Default language',
                    'remark' => 'Set the default system language. The default language is zh',
                    'input_type' => 'input',
                    'required' => true,
                    'style' => [
                        'width' => 200
                    ],
                    'keys' => 'tfshop.defaultLanguage',
                    'value' => 'zh'
                ],
                [
                    'lang' => 'en',
                    'name' => 'Debug mode',
                    'remark' => 'After this function is enabled, all interface error messages are returned. In the formal environment, keep the function disabled',
                    'input_type' => 'switch',
                    'input_option' => [
                        [
                            'name'=> 'Close',
                            'value'=> false
                        ],
                        [
                            'name'=> 'Open',
                            'value'=> true
                        ]
                    ],
                    'required' => true,
                    'keys' => 'app.debug',
                    'value' => env('APP_DEBUG')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Configuration reset',
                    'remark' => 'After this function is enabled, all background configurations will be restored to the configuration content in the config directory. After the reset, you cannot retrieve the configuration content.',
                    'input_type' => 'switch',
                    'input_option' => [
                        [
                            'name'=> 'No',
                            'value'=> false
                        ],
                        [
                            'name'=> 'Yes',
                            'value'=> true
                        ]
                    ],
                    'required' => true,
                    'keys' => 'tfshop.reset',
                    'value' => false
                ],
                [
                    'name' => 'Configuration synchronization',
                    'remark' => 'If the information configured in the config directory does not exist in the database, it is added to the database',
                    'input_type' => 'switch',
                    'input_option' => [
                        [
                            'name'=> 'No',
                            'value'=> false
                        ],
                        [
                            'name'=> 'Yes',
                            'value'=> true
                        ]
                    ],
                    'required' => true,
                    'keys' => 'tfshop.sync',
                    'value' => false
                ],
            ]
        ],
        [
            'lang' => 'en',
            'name' => 'Commodity allocation',
            'remark' =>'Related to the allocation of goods',
            'children' => [
                [
                    'name' => 'Low inventory quantity',
                    'remark' => 'Below this value, it is just marked as a low stock item',
                    'input_type' => 'input',
                    'required' => true,
                    'style' => [
                        'width' => 200
                    ],
                    'keys' => 'tfshop.lowInventory',
                    'value' => env('LOW_INVENTORY', 10)
                ]
            ]
        ],
        [
            'lang' => 'en',
            'name' => 'Mailbox configuration',
            'remark' =>'The email notification function is enabled only after the mailbox is configured',
            'children' => [
                [
                    'lang' => 'en',
                    'name' => 'E-mail Address',
                    'input_type' => 'input',
                    'maxlength' => 255,
                    'required' => true,
                    'style' => [
                        'width' => 300
                    ],
                    'keys' => 'mail.host',
                    'value' => env('MAIL_HOST')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Mailbox service',
                    'input_type' => 'input',
                    'maxlength' => 20,
                    'required' => true,
                    'style' => [
                        'width' => 100
                    ],
                    'keys' => 'mail.driver',
                    'value' => env('MAIL_DRIVER')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Mailbox port',
                    'input_type' => 'input',
                    'maxlength' => 20,
                    'required' => true,
                    'style' => [
                        'width' => 100
                    ],
                    'keys' => 'mail.port',
                    'value' => env('MAIL_PORT')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Email accounts',
                    'input_type' => 'input',
                    'maxlength' => 255,
                    'required' => true,
                    'style' => [
                        'width' => 300
                    ],
                    'keys' => 'mail.username',
                    'value' => env('MAIL_USERNAME')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Email password',
                    'input_type' => 'inputShowPassword',
                    'maxlength' => 255,
                    'required' => true,
                    'style' => [
                        'width' => 300
                    ],
                    'keys' => 'mail.password',
                    'value' => env('MAIL_PASSWORD')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Mailbox encryption protocol',
                    'input_type' => 'input',
                    'maxlength' => 50,
                    'required' => true,
                    'style' => [
                        'width' => 100
                    ],
                    'keys' => 'mail.encryption',
                    'value' => env('MAIL_ENCRYPTION')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Email Sender',
                    'input_type' => 'input',
                    'maxlength' => 255,
                    'required' => true,
                    'style' => [
                        'width' => 300
                    ],
                    'keys' => 'mail.from.address',
                    'value' => env('MAIL_FROM_ADDRESS')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Senders name',
                    'input_type' => 'input',
                    'maxlength' => 200,
                    'required' => true,
                    'style' => [
                        'width' => 200
                    ],
                    'keys' => 'mail.from.name',
                    'value' => env('MAIL_FROM_NAME')
                ],
            ]
        ],
        [
            'lang' => 'en',
            'name' => 'Small program configuration',
            'remark' =>'Small program related configuration, you need to configure small program information for different platforms',
            'children' => [
                [
                    'lang' => 'en',
                    'name' => 'WeChat Mini Program',
                    'remark' =>'Wechat small program related configuration',
                    'children' => [
                        [
                            'lang' => 'en',
                            'name' => 'ID',
                            'input_type' => 'input',
                            'remark' =>'Wechat mini program ID',
                            'required' => false,
                            'keys' => 'wechat.mini_program.default.app_id',
                            'value' => env('WECHAT_MINI_PROGRAM_APPID')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Keys',
                            'input_type' => 'input',
                            'remark' =>'Wechat small program key',
                            'required' => false,
                            'keys' => 'wechat.mini_program.default.secret',
                            'value' => env('WECHAT_MINI_PROGRAM_SECRET')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'token',
                            'input_type' => 'input',
                            'remark' =>'Wechat small program token',
                            'required' => false,
                            'keys' => 'wechat.mini_program.default.token',
                            'value' => env('WECHAT_MINI_PROGRAM_TOKEN')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Message encryption key',
                            'input_type' => 'input',
                            'remark' =>'Wechat small program message encryption key',
                            'required' => false,
                            'keys' => 'wechat.mini_program.default.aes_key',
                            'value' => env('WECHAT_MINI_PROGRAM_AES_KEY')
                        ],
                    ]
                ],
                [
                    'lang' => 'en',
                    'name' => 'Alipay mini program',
                    'remark' =>'Alipay small program related configuration',
                    'children' => [
                        [
                            'lang' => 'en',
                            'name' => 'ID',
                            'input_type' => 'input',
                            'remark' =>'Alipay mini program ID',
                            'required' => false,
                            'keys' => 'miniprogram.alipay.app_id',
                            'value' => env('ALIPAY_MINI_PROGRAM_APPID')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Address',
                            'input_type' => 'input',
                            'remark' =>'Alipay applet address',
                            'required' => false,
                            'keys' => 'miniprogram.alipay.gatewayUrl',
                            'value' => env('ALIPAY_MINI_PROGRAM_GATEWAY_URL', 'https://openapi.alipay.com/gateway.do')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Private key',
                            'input_type' => 'input',
                            'remark' =>'Alipay small program private key',
                            'required' => false,
                            'keys' => 'miniprogram.alipay.rsaPrivateKey',
                            'value' => env('ALIPAY_MINI_PROGRAM_RSA_PRIVATE_KEY')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Public key',
                            'input_type' => 'input',
                            'remark' =>'Alipay small program public key',
                            'required' => false,
                            'keys' => 'miniprogram.alipay.rsaPublicKey',
                            'value' => env('ALIPAY_MINI_PROGRAM_RSA_PUBLIC_KEY')
                        ],
                    ]
                ],
                [
                    'lang' => 'en',
                    'name' => 'Headline applet',
                    'remark' =>'Headline small program related configuration',
                    'children' => [
                        [
                            'lang' => 'en',
                            'name' => 'ID',
                            'input_type' => 'input',
                            'remark' =>'Headline applet ID',
                            'required' => false,
                            'keys' => 'miniprogram.toutiao.app_id',
                            'value' => env('TOUTIAO_MINI_PROGRAM_APPID')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Keys',
                            'input_type' => 'input',
                            'remark' =>'Headline small program key',
                            'required' => false,
                            'keys' => 'miniprogram.toutiao.secret',
                            'value' => env('TOUTIAO_MINI_PROGRAM_SECRET')
                        ],
                    ]
                ],
            ]
        ],
        [
            'lang' => 'en',
            'name' => 'Public platform configuration',
            'remark' =>'Public platform related configuration, need to configure the small program information of different platforms',
            'children' => [
                [
                    'lang' => 'en',
                    'name' => 'Wechat',
                    'remark' =>'Wechat public platform related configuration',
                    'children' => [
                        [
                            'lang' => 'en',
                            'name' => 'ID',
                            'input_type' => 'input',
                            'remark' =>'Wechat public platform ID',
                            'required' => false,
                            'keys' => 'wechat.official_account.default.app_id',
                            'value' => env('WECHAT_OFFICIAL_ACCOUNT_APPID')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Keys',
                            'input_type' => 'input',
                            'remark' =>'Wechat public platform key',
                            'required' => false,
                            'keys' => 'wechat.official_account.default.secret',
                            'value' => env('WECHAT_OFFICIAL_ACCOUNT_SECRET')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'token',
                            'input_type' => 'input',
                            'remark' =>'Wechat public platform token',
                            'required' => false,
                            'keys' => 'wechat.official_account.default.token',
                            'value' => env('WECHAT_OFFICIAL_ACCOUNT_TOKEN')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Message encryption key',
                            'input_type' => 'input',
                            'remark' =>'Wechat public platform message encryption key',
                            'required' => false,
                            'keys' => 'wechat.official_account.default.aes_key',
                            'value' => env('WECHAT_OFFICIAL_ACCOUNT_AES_KEY')
                        ],
                    ]
                ],
            ]
        ],
        [
            'lang' => 'en',
            'name' => 'Payment allocation',
            'remark' =>'Payment related configuration',
            'children' => [
                [
                    'lang' => 'en',
                    'name' => 'WeChat Pay',
                    'children' => [
                        [
                            'lang' => 'en',
                            'name' => 'AppID',
                            'input_type' => 'input',
                            'remark' =>'The AppID of the wechat Pay account',
                            'required' => true,
                            'keys' => 'wechat.payment.default.app_id',
                            'value' => env('WECHAT_PAYMENT_APPID')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'MCHID',
                            'input_type' => 'input',
                            'remark' =>'Wechat Pay merchant number',
                            'required' => true,
                            'keys' => 'wechat.payment.default.mch_id',
                            'value' => env('WECHAT_PAYMENT_MCH_ID')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Keys',
                            'input_type' => 'input',
                            'remark' =>'Wechat Pay key',
                            'required' => true,
                            'keys' => 'wechat.payment.default.key',
                            'value' => env('WECHAT_PAYMENT_KEY')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Wechat Pay public key',
                            'input_type' => 'input',
                            'remark' =>'Wechat Pay public key absolute address, located in the storage directory, you need to upload',
                            'required' => true,
                            'keys' => 'wechat.payment.default.cert_path',
                            'value' => env('WECHAT_PAYMENT_CERT_PATH')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Wechat Pay private key',
                            'input_type' => 'input',
                            'remark' =>'Wechat Pay private key absolute address, located in the storage directory, you need to upload',
                            'required' => true,
                            'keys' => 'wechat.payment.default.key_path',
                            'value' => env('WECHAT_PAYMENT_KEY_PATH')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Sandbox environment',
                            'input_type' => 'switch',
                            'input_option' => [
                                [
                                    'name'=> 'No',
                                    'value'=> false
                                ],
                                [
                                    'name'=> 'Yes',
                                    'value'=> true
                                ]
                            ],
                            'remark' =>'In the sandbox environment, the payment interface will not be pulled up, and the successful state will be returned regardless of whether the payment is successful',
                            'required' => true,
                            'keys' => 'wechat.payment.default.sandbox',
                            'value' => env('WECHAT_PAYMENT_SANDBOX')
                        ],
                    ]
                ],
            ]
        ],
        [
            'lang' => 'en',
            'name' => 'Template message',
            'remark' =>'Small program, public platform subscription, template related message configuration',
            'children' => [
                [
                    'lang' => 'en',
                    'name' => 'Wechat mini program subscribe message',
                    'remark' =>'Subscription messages need to be initiated by the user',
                    'children' => [
                        [
                            'lang' => 'en',
                            'name' => 'Delivery release',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.miniweixin.delivery_release',
                            'value' => env('MINIWEIXIN_SUBSCRIPTION_INFORMATION_SHIPMENTS')
                        ],
                    ]
                ],
                [
                    'lang' => 'en',
                    'name' => 'Wechat public platform template message',
                    'remark' =>'Wechat public platform template message, users need to pay attention to the public number, you can take the initiative to send a message',
                    'children' => [
                        [
                            'lang' => 'en',
                            'name' => 'Order payment success notification',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.finish_payment',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_FINISH_PAYMENT')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Order confirmation receipt notice',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.order_confirm_receipt',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_ORDER_CONFIRM_RECEIPT')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Delivery release',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.delivery_release',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_SHIPMENTS')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Refund success notice',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.refund_success',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_REFUND_SUCCESS')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Alert for shipment',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.admin_order_send_good',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_ADMIN_ORDER_SEND_GOOD')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Order completion notice',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.admin_order_completion',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_ADMIN_ORDER_COMPLETION')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Receiving account number',
                            'remark' =>'Some template messages are sent to the platform, and it is necessary to configure the subject to receive messages (fill in the ID of the subject to be received through user management, and separate multiple accounts with English commas).',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'notification.wechat.finish_payment',
                            'value' => env('WECHAT_SUBSCRIPTION_INFORMATION_FINISH_PAYMENT')
                        ],
                    ]
                ],
            ]
        ],
        [
            'lang' => 'en',
            'name' => 'SMS configuration',
            'children' => [
                [
                    'lang' => 'en',
                    'name' => 'Facilitator',
                    'remark' =>'Please ensure that the selected service provider is properly configured, otherwise it will not be sent',
                    'input_type' => 'select',
                    'input_option' => [
                        [
                            'name'=> 'Aliyun',
                            'value'=> 'aliyun'
                        ]
                    ],
                    'required' => false,
                    'keys' => 'sms.service',
                    'value' => env('SMS_SERVICE', 'aliyun')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Aliyun',
                    'children' => [
                        [
                            'lang' => 'en',
                            'name' => 'Account ID',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'sms.aliyun.access_id',
                            'value' => env('SMS_ALIYUN_ACCESS_ID')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Keys',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'sms.aliyun.secret',
                            'value' => env('SMS_ALIYUN_SECRET')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Signature',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'sms.aliyun.signature',
                            'value' => env('SMS_ALIYUN_SIGNATURE')
                        ],
                        [
                            'lang' => 'en',
                            'name' => 'Verification CODE template code',
                            'input_type' => 'input',
                            'required' => false,
                            'keys' => 'sms.aliyun.verification_code',
                            'value' => env('SMS_ALIYUN_VERIFICATION_CODE')
                        ],
                    ]
                ],
            ]
        ],
        [
            'lang' => 'en',
            'name' => 'Backup configuration',
            'remark' =>'Project backup and database backup can be configured daily. If you need to back up both items, you only need to set Backup Time. Generally, you only need to back up the database',
            'children' => [
                [
                    'lang' => 'en',
                    'name' => 'Backup switch',
                    'remark' =>'Whether to enable backup',
                    'input_type' => 'switch',
                    'input_option' => [
                        [
                            'name'=> 'Close',
                            'value'=> false
                        ],
                        [
                            'name'=> 'Open',
                            'value'=> true
                        ]
                    ],
                    'required' => true,
                    'keys' => 'backup.switch',
                    'value' => env('BACKUP_SWITCH')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Backup time',
                    'remark' =>'The database and project will be backed up after setting',
                    'input_type' => 'timeSelect',
                    'required' => false,
                    'keys' => 'backup.time',
                    'value' => env('BACKUP_TIME')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Database backup time',
                    'remark' =>'After the configuration, only the database is backed up, and the backup time becomes invalid',
                    'input_type' => 'timeSelect',
                    'required' => false,
                    'keys' => 'backup.db_time',
                    'value' => env('BACKUP_DB_TIME')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Project backup time',
                    'remark' =>'After the configuration, only items are backed up and the backup time becomes invalid',
                    'input_type' => 'timeSelect',
                    'required' => false,
                    'keys' => 'backup.files_time',
                    'value' => env('BACKUP_FILES_TIME')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Backup elimination time',
                    'remark' =>'The backup automatically deletes the oldest backup at setup time until the configured storage size is reached',
                    'input_type' => 'timeSelect',
                    'required' => false,
                    'keys' => 'backup.clean_time',
                    'value' => env('BACKUP_CLEAN_TIME')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Backup notification receive email',
                    'remark' =>'An email is sent to the account after the account is backed up and cleared every day. The email configuration must be complete',
                    'input_type' => 'input',
                    'required' => false,
                    'keys' => 'backup.notifications.mail.to',
                    'value' => env('BACKUP_RECEIVE_MAIL')
                ],
            ]
        ],
        [
            'lang' => 'en',
            'name' => 'Order allocation',
            'remark' =>'Order-related configuration',
            'children' => [
                [
                    'lang' => 'en',
                    'name' => 'Order timeout',
                    'remark' =>'Order timeout time, unit: minute',
                    'input_type' => 'input',
                    'required' => false,
                    'keys' => 'tfshop.orderOvertime',
                    'value' => env('ORDER_OVERTIME', 1440)
                ],
                [
                    'lang' => 'en',
                    'name' => 'Automatic receipt',
                    'remark' =>'After the automatic delivery is enabled, the system will automatically help the customer receive the goods how many days after the order',
                    'input_type' => 'switch',
                    'input_option' => [
                        [
                            'name'=> 'Close',
                            'value'=> false
                        ],
                        [
                            'name'=> 'Open',
                            'value'=> true
                        ]
                    ],
                    'required' => false,
                    'keys' => 'tfshop.automaticReceivingState',
                    'value' => env('AUTOMATIC_RECEIVING_STATE', true)
                ],
                [
                    'lang' => 'en',
                    'name' => 'How many days will automatically receive the goods',
                    'remark' =>'How many days after automatic delivery, automatic delivery is only effective',
                    'input_type' => 'input',
                    'required' => false,
                    'keys' => 'tfshop.automaticReceiving',
                    'value' => env('AUTOMATIC_RECEIVING', 7)
                ],
            ]
        ],
        [
            'lang' => 'en',
            'name' => 'Upload configuration',
            'children' => [
                [
                    'lang' => 'en',
                    'name' => 'Maximum upload size of the image',
                    'remark' =>'Unit :b',
                    'input_type' => 'input',
                    'required' => true,
                    'keys' => 'tfshop.file.image.size',
                    'value' => env('FILE_IMAGE_SIZE', 3 * 1024 * 1024)
                ],
                [
                    'lang' => 'en',
                    'name' => 'Supported formats for images',
                    'remark' =>'Separate with English comma',
                    'input_type' => 'input',
                    'required' => true,
                    'keys' => 'tfshop.file.image.extension',
                    'value' => env('FILE_IMAGE_EXTENSION', 'gif,jpg,jpeg,bmp,png')
                ],
                [
                    'lang' => 'en',
                    'name' => 'Customize the maximum upload size',
                    'remark' =>'Unit :b',
                    'input_type' => 'input',
                    'required' => true,
                    'keys' => 'tfshop.file.custom.size',
                    'value' => env('FILE_CUSTOM_SIZE', 5 * 1024 * 1024)
                ],
                [
                    'lang' => 'en',
                    'name' => 'Customize supported formats',
                    'remark' =>'Separate with English comma',
                    'input_type' => 'input',
                    'required' => true,
                    'keys' => 'tfshop.file.custom.extension',
                    'value' => env('FILE_CUSTOM_EXTENSION', 'gif,jpg,jpeg,bmp,png,zip,html,txt,json')
                ],
            ]
        ],
    ],
    /*
    |--------------------------------------------------------------------------
    | Homestead windows
    |--------------------------------------------------------------------------
    |
    |  windows下搭建的Homestead，因软链接无法使用，故进行了特别处理
    |
    */

    'homestead' => env('HOMESTEAD_WINDOWS', false),
    'failuretime' => env('VERIFICATION_CODE_FAILURE_TIME', 60), // 验证码失效时间秒，默认60秒
    'versions' => env('API_VERSIONS', 1),   //当前版本
    'appVersion' => '1.0.0',   //当前应用版本，此为固定值，用于版本升级所用，请不要随意修改
    'applySecret' => env('PROJECT_KEY', 'base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM='), //API密钥串
    'orderOvertime' => env('ORDER_OVERTIME', 1440),  // 订单超时时间(分钟)
    'automaticReceivingState' => env('AUTOMATIC_RECEIVING_STATE', true),  // 是否开启自动收货
    'automaticReceiving' => env('AUTOMATIC_RECEIVING', 7),  // 多少天后自动收货(天)
    'maxFileUploadSize' => env('MAX_FILE_UPLOAD_SIZE', 2 * 1024 * 1024),
    'defaultLanguage' => 'zh',  // 默认语言
    'down' => env('APP_DOWN', false),   // 维护模式
    'lowInventory' => env('LOW_INVENTORY', 10), // 低库存报警数
    'file' => [
        'image' => [
            'size' => env('FILE_IMAGE_SIZE', 3 * 1024 * 1024), // 图片最大上传大小2M
            'extension' => env('FILE_IMAGE_EXTENSION', 'gif,jpg,jpeg,bmp,png') // 图片支持的格式
        ],
        'custom' => [
            'size' => env('FILE_CUSTOM_SIZE', 5 * 1024 * 1024), // 自定义最大上传大小5M
            'extension' => env('FILE_CUSTOM_EXTENSION', 'gif,jpg,jpeg,bmp,png,zip,html,txt,json') // 自定义支持的格式
        ],
    ],

    // 插件市场相关配置
    'marketApplicationSecret' => env('MARKET_APPLICATION_SECRET', null),    // 插件市场应用密钥
    'marketApplySecret' => env('MARKET_APPLY_SECRET', null),    // 开发者密钥
    'marketUrl' => 'http://www.dswjcms.com',    // 插件市场地址，此为固定值，请不要随意修改
];
