<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Parsers\SXParser;

use Aliyun\Common\Communication\HttpResponse;

use Aliyun\Common\Utilities\DateUtils;

use Aliyun\OSS\Models\CopyObjectResult;

use Aliyun\OSS\Utilities\OSSUtils;

class SXCopyObjectParser extends SXParser {

    public function parse(HttpResponse $response, $options) {
        $xml = $this->getXmlObject($response->getContent());
        $lastModified = DateUtils::parseDate((string) $xml->LastModified);
        $eTag = OSSUtils::trimQuotes((string) $xml->ETag);

        $copyObjectResult = new CopyObjectResult();

        $copyObjectResult->setLastModified($lastModified);
        $copyObjectResult->setETag($eTag);
        return $copyObjectResult;
    }
}