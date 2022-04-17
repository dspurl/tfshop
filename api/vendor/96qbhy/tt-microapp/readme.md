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
```

php吹水交流群请添加: 873213948  
https://github.com/qbhy/tt-microapp  
96qbhy@gmail.com