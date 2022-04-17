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

class PutObjectCommand extends OSSCommand {

    protected function checkOptions($options) {
        $options = parent::checkOptions($options);
        AssertUtils::assertSet(array(
            OSSOptions::CONTENT,
            OSSOptions::BUCKET,
            OSSOptions::KEY,
        ), $options);

        OSSUtils::assertBucketName($options[OSSOptions::BUCKET]);
        OSSUtils::assertObjectKey($options[OSSOptions::KEY]);

        if (isset($options[OSSOptions::CONTENT_LENGTH])) {
            AssertUtils::assertNumber($options[OSSOptions::CONTENT_LENGTH], OSSOptions::CONTENT_LENGTH);
        }

        if (is_resource($options[OSSOptions::CONTENT]) && !isset($options[OSSOptions::CONTENT_LENGTH])) {
            throw new \InvalidArgumentException(OSSOptions::CONTENT_LENGTH.' must be set when the content is a resource.');
        }

        return $options;
    }

    protected function commandOptions() {
        return array(
            OSSOptions::CONTENT_TYPE => OSSUtils::DEFAULT_CONTENT_TYPE,
        );
    }

    protected function leaveRequestOpen($options) {
        return true;
    }

    protected function getRequest($options) {
        $builder = OSSRequestBuilder::factory();

        if (isset($options[OSSOptions::CONTENT_LENGTH])) {
            $builder->setContentLength((string) intval($options[OSSOptions::CONTENT_LENGTH]));
        }

        return $builder
                ->addObjectMetadataHeaders($options)
                ->setEndpoint($options[OSSOptions::ENDPOINT])
                ->setMethod(HttpMethods::PUT)
                ->setBucket($options[OSSOptions::BUCKET])
                ->setKey($options[OSSOptions::KEY])
                ->setContent($options[OSSOptions::CONTENT])
                ->build();
    }
}