<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Parsers\SXParser;

use Aliyun\Common\Utilities\DateUtils;

use Aliyun\Common\Communication\HttpResponse;

use Aliyun\OSS\Models\OSSObject;

use Aliyun\OSS\Utilities\OSSHeaders;

use Aliyun\OSS\Models\OSSOptions;

use Aliyun\OSS\Utilities\OSSUtils;

class SXGetObjectParser extends SXParser {

    public function parse(HttpResponse $response, $options) {
        $object = new OSSObject();
        $object->setBucketName($options[OSSOptions::BUCKET]);
        $object->setKey($options[OSSOptions::KEY]);

        if (!$options[OSSOptions::META_ONLY])
            $object->setObjectContent($response->getContent());

        foreach ($response->getHeaders() as $key => $value) {
            if ($key == OSSHeaders::LAST_MODIFIED) {
                $object->addMetadata(OSSHeaders::LAST_MODIFIED, DateUtils::parseDate($value));
            } else if ($key == OSSHeaders::CONTENT_LENGTH) {
                $object->addMetadata(OSSHeaders::CONTENT_LENGTH, (int) $value);
            } else if ($key == OSSHeaders::ETAG) {
                $object->addMetadata(OSSHeaders::ETAG, OSSUtils::trimQuotes($value));
            } else if (strpos($key, OSSHeaders::OSS_USER_META_PREFIX) === 0) {
                $key = substr($key, strlen(OSSHeaders::OSS_USER_META_PREFIX));
                $object->addUserMetadata($key, $value);
            } else {
                $object->addMetadata($key, $value);
            }
        }
        return $object;
    }
}
