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
    'service'=>env('SMS_SERVICE', 'aliyun'),         // 服务商
    // 阿里云
    'aliyun'=>[
        'access_id' => env('SMS_ALIYUN_ACCESS_ID', ''),         // 账号ID
        'secret' => env('SMS_ALIYUN_SECRET', ''),         // 密钥
        'signature' => env('SMS_ALIYUN_SIGNATURE', ''),         // 签名
        'verification_code'=> env('SMS_ALIYUN_VERIFICATION_CODE', ''),  //验证码模版CODE
    ]
];
