<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Commands;

use Aliyun\Common\Utilities\HttpMethods;

use Aliyun\OSS\Utilities\OSSHeaders;

use Aliyun\OSS\Models\OSSOptions;

use Aliyun\Common\Utilities\AssertUtils;

use Aliyun\OSS\Utilities\OSSRequestBuilder;

use Aliyun\OSS\Utilities\OSSUtils;

class InitiateMultipartUploadCommand extends OSSCommand {

    protected function checkOptions($options) {
        $options = parent::checkOptions($options);
        AssertUtils::assertSet(array(
            OSSOptions::BUCKET,
            OSSOptions::KEY,
        ), $options);

        OSSUtils::assertBucketName($options[OSSOptions::BUCKET]);
        OSSUtils::assertObjectKey($options[OSSOptions::KEY]);

        return $options;
    }

    protected function commandOptions() {
        return array(
            OSSOptions::CONTENT_TYPE => OSSUtils::DEFAULT_CONTENT_TYPE,
        );
    }

    protected function getRequest($options) {

        return OSSRequestBuilder::factory()
            ->addObjectMetadataHeaders($options)
            ->setEndpoint($options[OSSOptions::ENDPOINT])
            ->setMethod(HttpMethods::POST)
            ->setBucket($options[OSSOptions::BUCKET])
            ->setKey($options[OSSOptions::KEY])
            ->addParameter(OSSUtils::SUBRESOURCE_UPLOADS, null)
            ->setContent('')
            ->build();
    }
}