<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Parsers\SXParser;

use Aliyun\OSS\Models\PutObjectResult;

use Aliyun\Common\Communication\HttpResponse;

use Aliyun\OSS\Utilities\OSSHeaders;

use Aliyun\Common\Communication\ResponseParserInterface;

use Aliyun\OSS\Utilities\OSSUtils;


class SXPutObjectParser implements ResponseParserInterface {

    public function parse(HttpResponse $response, $options) {
        $putObjectResult = new PutObjectResult();
        $putObjectResult->setETag(OSSUtils::trimQuotes($response->getHeader(OSSHeaders::ETAG)));
        return $putObjectResult;
    }
}