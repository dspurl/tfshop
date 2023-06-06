<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
return [

    /*
    |--------------------------------------------------------------------------
    | 模板通知配置
    |--------------------------------------------------------------------------
    */

    'account' => env('NOTIFICATION_ACCOUNT', null), //后台模板通知接收的user用户ID（非后台用户）
    /**
     * 模板信息
     */
    'miniweixin'=>[ //微信小程序
        'delivery_release'=>env('MINIWEIXIN_SUBSCRIPTION_INFORMATION_SHIPMENTS',''),  //发货通知
    ],
    'wechat'=>[ //微信公众号
        'finish_payment'=>env('WECHAT_SUBSCRIPTION_INFORMATION_FINISH_PAYMENT',''),  //订单支付成功通知
        'order_confirm_receipt'=>env('WECHAT_SUBSCRIPTION_INFORMATION_ORDER_CONFIRM_RECEIPT',''),  //订单确认收货通知
        'delivery_release'=>env('WECHAT_SUBSCRIPTION_INFORMATION_SHIPMENTS',''),  //发货通知
        'refund_success'=>env('WECHAT_SUBSCRIPTION_INFORMATION_REFUND_SUCCESS',''),  //退款成功通知
        'admin_order_send_good'=>env('WECHAT_SUBSCRIPTION_INFORMATION_ADMIN_ORDER_SEND_GOOD',''),  //待发货提醒
        'admin_order_completion'=>env('WECHAT_SUBSCRIPTION_INFORMATION_ADMIN_ORDER_COMPLETION',''),  //订单完成通知
    ],
];
