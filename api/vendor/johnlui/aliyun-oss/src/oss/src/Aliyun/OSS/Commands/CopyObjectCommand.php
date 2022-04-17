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

class CopyObjectCommand extends OSSCommand {
    protected function checkOptions($options) {
        $options = parent::checkOptions($options);
        AssertUtils::assertSet(array(
            OSSOptions::SOURCE_BUCKET,
            OSSOptions::SOURCE_KEY,
            OSSOptions::DEST_BUCKET,
            OSSOptions::DEST_KEY,
        ), $options);
        $options[OSSOptions::BUCKET] = $options[OSSOptions::DEST_BUCKET];
        $options[OSSOptions::KEY] = $options[OSSOptions::DEST_KEY];

        OSSUtils::assertBucketName($options[OSSOptions::BUCKET]);
        OSSUtils::assertObjectKey($options[OSSOptions::KEY]);

        return $options;
    }

    protected function getRequest($options) {

        $builder = OSSRequestBuilder::factory();

        if (isset($options[OSSOptions::MODIFIED_SINCE_CONSTRAINT])) {
            $builder->addHeader(OSSHeaders::COPY_OBJECT_SOURCE_IF_MODIFIED_SINCE, DateUtils::formatDate($options[OSSOptions::MODIFIED_SINCE_CONSTRAINT]));
        }

        if (isset($options[OSSOptions::UNMODIFIED_SINCE_CONSTRAINT])) {
            $builder->addHeader(OSSHeaders::COPY_OBJECT_SOURCE_IF_UNMODIFIED_SINCE, DateUtils::formatDate($options[OSSOptions::UNMODIFIED_SINCE_CONSTRAINT]));
        }

        if (isset($options[OSSOptions::MATCHING_ETAG_CONSTRAINTS])) {
            $constraints = $options[OSSOptions::MATCHING_ETAG_CONSTRAINTS];
            $builder->addHeader(OSSHeaders::COPY_OBJECT_SOURCE_IF_MATCH, join(', ', $constraints));
        }

        if (isset($options[OSSOptions::NO_MATCHING_ETAG_CONSTRAINTS])) {
            $constraints = $options[OSSOptions::NO_MATCHING_ETAG_CONSTRAINTS];
            $builder->addHeader(OSSHeaders::COPY_OBJECT_SOURCE_IF_NONE_MATCH, join(', ', $constraints));
        }

        $builder->addHeader(OSSHeaders::COPY_OBJECT_SOURCE,
            "/".$options[OSSOptions::SOURCE_BUCKET]."/".$options[OSSOptions::SOURCE_KEY]);

        if (OSSUtils::containsMetaOptions($options)) {
            $builder->addObjectMetadataHeaders($options);
            $builder->addHeader(OSSHeaders::COPY_OBJECT_METADATA_DIRECTIVE, 'REPLACE');
        } else {
            $builder->addHeader(OSSHeaders::COPY_OBJECT_METADATA_DIRECTIVE, 'COPY');
        }

        return $builder
            ->setEndpoint($options[OSSOptions::ENDPOINT])
            ->setBucket($options[OSSOptions::DEST_BUCKET])
            ->setKey($options[OSSOptions::DEST_KEY])
            ->setMethod(HttpMethods::PUT)
            ->build();
    }
}