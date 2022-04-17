<h1 align="center">laravel filesystem oss</h1>

<p align="center">
<a href="https://www.aliyun.com/product/oss">AliOss</a> storage for Laravel based on <a href="https://github.com/iiDestiny/flysystem-oss">iidestiny/flysystem-oss</a>.
</p>

<p align="center">
<a href="https://github.com/iiDestiny/flysystem-oss"><img src="https://travis-ci.org/iiDestiny/flysystem-oss.svg?branch=master"></a>
<a href="https://github.com/iiDestiny/flysystem-oss"><img src="https://github.styleci.io/repos/163501119/shield"></a>
<a href="https://github.com/iiDestiny/laravel-filesystem-oss"><img src="https://poser.pugx.org/iidestiny/laravel-filesystem-oss/v/stable"></a>
<a href="https://github.com/iiDestiny/laravel-filesystem-oss"><img src="https://poser.pugx.org/iidestiny/laravel-filesystem-oss/downloads"></a>
<a href="https://github.com/iiDestiny/laravel-filesystem-oss"><img src="https://poser.pugx.org/iidestiny/laravel-filesystem-oss/v/unstable"></a>
<a href="https://scrutinizer-ci.com/g/iiDestiny/flysystem-oss/?branch=master"><img src="https://scrutinizer-ci.com/g/iiDestiny/flysystem-oss/badges/quality-score.png?b=master"></a>
<a href="https://github.com/iiDestiny/laravel-filesystem-oss"><img src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103"></a>
<a href="https://github.com/iiDestiny/laravel-filesystem-oss"><img src="https://poser.pugx.org/iidestiny/laravel-filesystem-oss/license"></a>
</p>

## Requirement

-   PHP >= 7.0

## Installing

```shell
$ composer require "iidestiny/laravel-filesystem-oss" -vvv
```

## Configuration

1. After installing the library, register the `Iidestiny\LaravelFilesystemOss\OssStorageServiceProvider::class` in your `config/app.php` file:

```php
'providers' => [
    // Other service providers...
    Iidestiny\LaravelFilesystemOss\OssStorageServiceProvider::class,
],
```

> Laravel 5.5+ skip

2. Add a new disk to your `config/filesystems.php` config:

```php
<?php

return [
   'disks' => [
        //...
        'oss' => [
            'driver' => 'oss',
            'root' => '',
            'access_key' => env('OSS_ACCESS_KEY'),
            'secret_key' => env('OSS_SECRET_KEY'),
            'endpoint'   => env('OSS_ENDPOINT'), // 使用 ssl 这里设置如: https://oss-cn-beijing.aliyuncs.com
            'bucket'     => env('OSS_BUCKET'),
            'isCName'    => env('OSS_IS_CNAME', false), // 如果 isCname 为 false，endpoint 应配置 oss 提供的域名如：`oss-cn-beijing.aliyuncs.com`，否则为自定义域名，，cname 或 cdn 请自行到阿里 oss 后台配置并绑定 bucket
            //如果有更多的bucket需要切换，就添加所有bucket，默认的bucket填写到上面，不要加到buckets中
            'buckets'=>[
                'test'=>[
                    'access_key' => env('OSS_ACCESS_KEY'),
                    'secret_key' => env('OSS_SECRET_KEY'),
                    'bucket'     => env('OSS_TEST_BUCKET'),
                    'endpoint'   => env('OSS_TEST_ENDPOINT'),
                    'isCName'    => env('OSS_TEST_IS_CNAME', false),
                ],
                //...
            ],
        ],
        //...
    ]
];
```

## Usage

```php
<?php

$disk = Storage::disk('oss');

// create a file
$disk->put('avatars/filename.jpg', $fileContents);

// check if a file exists
$exists = $disk->has('file.jpg');

// get timestamp
$time = $disk->lastModified('file1.jpg');
$time = $disk->getTimestamp('file1.jpg');

// copy a file
$disk->copy('old/file1.jpg', 'new/file1.jpg');

// move a file
$disk->move('old/file1.jpg', 'new/file1.jpg');

// get file contents
$contents = $disk->read('folder/my_file.txt');

// get file url
$url = $disk->getUrl('folder/my_file.txt');

// file access period & file handle
$url = $disk->signUrl('cat.png', $timeout, ['x-oss-process' => 'image/circle,r_100']);

//other bucket
$exists = $disk->bucket('test')->has('file.jpg');
```

See more methods [laravel-filesystem-doc](https://laravel.com/docs/5.5/filesystem)

## 前端 web 直传配置

oss 直传有三种方式，当前扩展包使用的是最完整的 [服务端签名直传并设置上传回调](https://help.aliyun.com/document_detail/31927.html?spm=a2c4g.11186623.2.10.5602668eApjlz3#concept-qp2-g4y-5db) 方式，扩展包只生成前端页面上传所需的签名参数，前端上传实现可参考 [官方文档中的实例](https://help.aliyun.com/document_detail/31927.html?spm=a2c4g.11186623.2.10.5602668eApjlz3#concept-qp2-g4y-5db) 或自行搜索

```php
$config = $disk->signatureConfig($prefix, $callBackUrl, $expire);
```

## depend

-   [iidestiny/flysystem-oss](https://github.com/iiDestiny/flysystem-oss)

## reference

-   [overtrue/flysystem-qiniu](https://github.com/overtrue/flysystem-qiniu)

## License

MIT
