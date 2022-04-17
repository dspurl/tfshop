<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Commands;

use Aliyun\Common\Utilities\HttpMethods;

use Aliyun\OSS\Parsers\OSSResponseParserFactory;

use Aliyun\OSS\Parsers\ListBucketParser;

use Aliyun\OSS\Models\OSSOptions;

use Aliyun\OSS\Utilities\OSSRequestBuilder;

use Aliyun\Common\Utilities\AssertUtils;

use Aliyun\OSS\Utilities\OSSUtils;


class ListPartsCommand extends OSSCommand {

    protected function checkOptions($options) {
        $options = parent::checkOptions($options);
        AssertUtils::assertSet(array(
            OSSOptions::BUCKET,
            OSSOptions::KEY,
            OSSOptions::UPLOAD_ID,
        ), $options);

        OSSUtils::assertBucketName($options[OSSOptions::BUCKET]);
        OSSUtils::assertObjectKey($options[OSSOptions::KEY]);

        if (isset($options[OSSOptions::PART_NUMBER_MARKER])) {
            AssertUtils::assertNumber($options[OSSOptions::PART_NUMBER_MARKER], OSSOptions::PART_NUMBER_MARKER);
        }

        if (isset($options[OSSOptions::MAX_PARTS])) {
            AssertUtils::assertNumber($options[OSSOptions::MAX_PARTS], OSSOptions::MAX_PARTS);
        }

        return $options;
    }

    protected function getRequest($options) {
        $builder = OSSRequestBuilder::factory();

        $builder->addParameter('uploadId', $options[OSSOptions::UPLOAD_ID]);

        if (isset($options[OSSOptions::MAX_PARTS])) {
            $builder->addParameter('max-parts', (string) $options[OSSOptions::MAX_PARTS]);
        }

        if (isset($options[OSSOptions::PART_NUMBER_MARKER])) {
            $builder->addParameter('part-number-marker', (string) intval($options[OSSOptions::PART_NUMBER_MARKER]));
        }

        return $builder
            ->setEndpoint($options[OSSOptions::ENDPOINT])
            ->setBucket($options[OSSOptions::BUCKET])
            ->setKey($options[OSSOptions::KEY])
            ->setMethod(HttpMethods::GET)
            ->build();
    }
}