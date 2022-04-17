<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Parsers\SXParser;

use Aliyun\Common\Communication\HttpResponse;

use Aliyun\OSS\Models\Bucket;

use Aliyun\OSS\Models\OSSOptions;

class SXCreateBucketParser extends SXParser {

    public function parse(HttpResponse $response, $options) {
        return new Bucket($options[OSSOptions::BUCKET]);
    }
}