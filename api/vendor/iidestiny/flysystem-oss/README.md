<h1 align="center">flysystem-oss </h1>

<p align="center">:floppy_disk:  Flysystem adapter for the oss storage.</p>

<p align="center">
<a href="https://github.com/iiDestiny/flysystem-oss"><img src="https://travis-ci.org/iiDestiny/flysystem-oss.svg?branch=master"></a>
<a href="https://github.com/iiDestiny/flysystem-oss"><img src="https://github.styleci.io/repos/163501119/shield"></a>
<a href="https://github.com/iiDestiny/flysystem-oss"><img src="https://poser.pugx.org/iidestiny/flysystem-oss/v/stable.svg"></a>
<a href="https://github.com/iiDestiny/flysystem-oss"><img src="https://poser.pugx.org/iidestiny/flysystem-oss/v/unstable.svg"></a>
<a href="https://github.com/iiDestiny/flysystem-oss"><img src="https://poser.pugx.org/iidestiny/flysystem-oss/downloads"></a>
<a href="https://scrutinizer-ci.com/g/iiDestiny/flysystem-oss/?branch=master"><img src="https://scrutinizer-ci.com/g/iiDestiny/flysystem-oss/badges/quality-score.png?b=master"></a>
<a href="https://github.com/iiDestiny/dependency-injection"><img src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103"></a>
<a href="https://github.com/iiDestiny/flysystem-oss"><img src="https://poser.pugx.org/iidestiny/flysystem-oss/license"></a>
<a href="https://996.icu"><img src="https://img.shields.io/badge/license-Anti%20996-blue.svg" alt="996.icu" /></a>
</p>

## 扩展包要求

-   PHP >= 7.0

## 安装命令

```shell
$ composer require "iidestiny/flysystem-oss" -vvv
```

## 使用

```php
use League\Flysystem\Filesystem;
use Iidestiny\Flysystem\Oss\OssAdapter;
use Iidestiny\Flysystem\Oss\Plugins\FileUrl;

$prefix = ''; // 前缀，非必填
$accessKeyId = 'xxxxxx';
$accessKeySecret = 'xxxxxx';
$endpoint= 'oss.iidestiny.com'; // ssl：https://iidestiny.com
$bucket = 'bucket';
$isCName = true; // 如果 isCname 为 false，endpoint 应配置 oss 提供的域名如：`oss-cn-beijing.aliyuncs.com`，cname 或 cdn 请自行到阿里 oss 后台配置并绑定 bucket

$adapter = new OssAdapter($accessKeyId, $accessKeySecret, $endpoint, $bucket, $isCName, $prefix);

$flysystem = new Filesystem($adapter);

```

## 常用方法

```php
bool $flysystem->write('file.md', 'contents');

bool $flysystem->write('file.md', 'http://httpbin.org/robots.txt', ['options' => ['xxxxx' => 'application/redirect302']]);

bool $flysystem->writeStream('file.md', fopen('path/to/your/local/file.jpg', 'r'));

bool $flysystem->update('file.md', 'new contents');

bool $flysystem->updateStream('file.md', fopen('path/to/your/local/file.jpg', 'r'));

bool $flysystem->rename('foo.md', 'bar.md');

bool $flysystem->copy('foo.md', 'foo2.md');

bool $flysystem->delete('file.md');

bool $flysystem->has('file.md');

string|false $flysystem->read('file.md');

array $flysystem->listContents();

array $flysystem->getMetadata('file.md');

int $flysystem->getSize('file.md');

string $flysystem->getAdapter()->getUrl('file.md');

string $flysystem->getMimetype('file.md');

int $flysystem->getTimestamp('file.md');
```

## 插件扩展

```php
use Iidestiny\Flysystem\Oss\Plugins\FileUrl;
use Iidestiny\Flysystem\Oss\Plugins\SignUrl;
use Iidestiny\Flysystem\Oss\Plugins\TemporaryUrl;
use Iidestiny\Flysystem\Oss\Plugins\SignatureConfig;

// 获取 oss 资源访问链接
$flysystem->addPlugin(new FileUrl());

string $flysystem->getUrl('file.md');

// url 访问有效期 & 图片处理「$timeout 为多少秒过期」
$flysystem->addPlugin(new SignUrl());

 string $flysystem->signUrl('file.md', $timeout, ['x-oss-process' => 'image/circle,r_100']);

 // url 访问有效期「$expiration 为未来时间 2019-05-05 17:50:32」
$flysystem->addPlugin(new TemporaryUrl());

string $flysystem->getTemporaryUrl('file.md', $expiration);

//多个bucket切换
$flysystem->addPlugin(new SetBucket());
$flysystem->bucket('test')->has('file.md');
```

## 前端 web 直传配置

oss 直传有三种方式，当前扩展包使用的是最完整的 [服务端签名直传并设置上传回调](https://help.aliyun.com/document_detail/31927.html?spm=a2c4g.11186623.2.10.5602668eApjlz3#concept-qp2-g4y-5db) 方式，扩展包只生成前端页面上传所需的签名参数，前端上传实现可参考 [官方文档中的实例](https://help.aliyun.com/document_detail/31927.html?spm=a2c4g.11186623.2.10.5602668eApjlz3#concept-qp2-g4y-5db) 或自行搜索

```php
use Iidestiny\Flysystem\Oss\Plugins\SignatureConfig

$flysystem->addPlugin(new SignatureConfig());

object $flysystem->signatureConfig($prefix, $callBackUrl, $expire);
```

## Laravel 适配包

-   Laravel 5：[iidestiny/laravel-filesystem-oss](https://github.com/iiDestiny/laravel-filesystem-oss)

## 参考

-   [overtrue/flysystem-qiniu](https://github.com/overtrue/flysystem-qiniu)

## License

[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
