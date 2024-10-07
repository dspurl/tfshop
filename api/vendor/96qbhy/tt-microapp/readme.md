## tt-microapp
字节跳动小程序 sdk
字节跳动服务端API官方文档 [点击前往](https://microapp.bytedance.com/dev/cn/mini-app/develop/server/server-api-introduction)

* API 齐全
* 丰富合理的注释
* 完善的参数提示
* 支持 `composer` 安装
* 支持 laravel/lumen、hyperf 框架

## 相关资源
* QQ小程序php-sdk https://github.com/qbhy/qq-microapp

## 安装 - install
```bash
$ composer require 96qbhy/tt-microapp
```

## 使用 - usage
```php
require 'vendor/autoload.php';

// 更多缓存驱动请移步 https://www.doctrine-project.org/projects/doctrine-orm/en/current/reference/caching.html
$redisCache = new \Doctrine\Common\Cache\RedisCache();
//$redisCache->setRedis($redis); // 设置你的 redis 实例，可选

$factory = new \Qbhy\TtMicroApp\Factory($factoryConfig = [
    'debug' => true,
    'default' => 'default',
    'drivers' => [
        'default' => $appConfig = [
            'access_key' => 'your app id',
            'secret_key' => 'your app secret',

            'payment_app_id' => 'your payment_app_id',
            'payment_merchant_id' => 'your payment_merchant_id',
            'payment_secret' => 'your payment_secret',
            'payment_salt' => 'your payment_salt',
            'payment_token' => 'your payment_token',
            'cache' => $redisCache, // 可选参数，你也可以用 \Doctrine\Common\Cache\ 下面得其他缓存驱动，比如 sqlite 等
        ]
    ],
]);

// 使用工厂创建实例
$app = $factory->make('default');

// 直接 new
//    $app = new \Qbhy\TtMicroApp\TtMicroApp($appConfig);

// 协程环境下，支持自定义 guzzle handler
//    $app->rebind('guzzle_handler', \Hyperf\Guzzle\CoroutineHandler::class);

var_dump($app->access_token->getToken()); // 获取 access token
var_dump($app->auth->session('client code')); // 获取 openid
var_dump($app->temp_msg->send('openid', 'template id', 'form id', [], 'page')); //模板消息
var_dump($app->storage); // 存储接口
var_dump($app->qr_code->create()); // 创建二维码接口
var_dump($app->content_security); // 内容安全接口、图片和文本检测
var_dump($app->decrypt->decrypt('encrypted data', 'session key', 'iv')); // 敏感数据处理
var_dump($app->payment); // 支付
var_dump($app->payment->create_order([
    'out_order_no' => $your_order_no,
    'total_amount' => $your_amount,
    'subject' => $your_subject,
    'body' => $your_body,
    'valid_time' => $your_valid_time,
    'notify_url' => $your_notify_url,
])); // 生成预订单
var_dump($app->payment->query_order($your_order_no)); // 查询订单
var_dump($app->payment->settle([
    'out_settle_no' => $your_settle_no,
    'out_order_no' => $your_order_no,
    'settle_desc' => $your_settle_desc,
    'notify_url' => $your_notify_url,
    // 如需分账，请完善下面的分账信息
    // 'settle_params' => [
    //     'merchant_uid' => $your_merchant_uid,
    //     'amount' => $your_amount,
    // ],
])); // 分账
var_dump($app->payment->create_refund([
    'out_order_no' => $your_order_no,
    'out_refund_no' => $your_refund_no,
    'refund_amount' => $your_refund_amount,
    'reason' => $your_reason,
])); // 退款
var_dump($app->payment->signPay($pay_param)); // 担保支付的请求签名算法，一般不需要直接调用
var_dump($app->payment->signCallback($callback_param)); // 担保支付的回调签名算法，用于在支付回调、退款回调、分账回调进行数据校验的
```

php吹水交流群请添加: 873213948
https://github.com/qbhy/tt-microapp
96qbhy@gmail.com
