<?php
namespace Aliyun\OSS\Commands;
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
use Aliyun\Common\Utilities\HttpMethods;

use Aliyun\OSS\Parsers\OSSResponseParserFactory;

use Aliyun\OSS\Parsers\ListBucketParser;

use Aliyun\OSS\Models\OSSOptions;

use Aliyun\OSS\Utilities\OSSRequestBuilder;

use Aliyun\OSS\Utilities\OSSUtils;


class ListBucketsCommand extends OSSCommand {
    protected function checkOptions($options) {
        $options = parent::checkOptions($options);
        if (isset($options[OSSOptions::BUCKET])) {
            unset($options[OSSOptions::BUCKET]);
        }

        if (isset($options[OSSOptions::KEY])) {
            unset($options[OSSOptions::KEY]);
        }

        return $options;
    }

    protected function getRequest($options) {
        return OSSRequestBuilder::factory()
                        ->setEndpoint($options[OSSOptions::ENDPOINT])
                        ->setMethod(HttpMethods::GET)
                        ->build();
    }
}
