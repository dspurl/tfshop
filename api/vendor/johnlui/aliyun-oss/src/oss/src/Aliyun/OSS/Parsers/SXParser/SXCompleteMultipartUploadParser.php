<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Parsers\SXParser;

use Aliyun\Common\Communication\HttpResponse;

use Aliyun\OSS\Models\CompleteMultipartUploadResult;

use Aliyun\OSS\Utilities\OSSUtils;

class SXCompleteMultipartUploadParser extends SXParser {

    public function parse(HttpResponse $response, $options) {
        $xml = $this->getXmlObject($response->getContent());
        $result = new CompleteMultipartUploadResult();
        $result->setETag(OSSUtils::trimQuotes((string) $xml->ETag));
        $result->setLocation((string) $xml->Location);
        $result->setBucketName((string) $xml->Bucket);
        $result->setKey((string) $xml->Key);

        return $result;
    }
}