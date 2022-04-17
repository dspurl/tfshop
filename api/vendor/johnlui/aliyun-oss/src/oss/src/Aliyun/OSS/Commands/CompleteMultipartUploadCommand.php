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

use Aliyun\Common\Utilities\AssertUtils;

use Aliyun\OSS\Utilities\OSSRequestBuilder;

use Aliyun\OSS\Utilities\OSSUtils;

class CompleteMultipartUploadCommand extends OSSCommand {

    protected function checkOptions($options) {
        $options = parent::checkOptions($options);
        AssertUtils::assertSet(array(
            OSSOptions::BUCKET,
            OSSOptions::KEY,
            OSSOptions::UPLOAD_ID,
            OSSOptions::PART_ETAGS,
        ), $options);

        OSSUtils::assertBucketName($options[OSSOptions::BUCKET]);
        OSSUtils::assertObjectKey($options[OSSOptions::KEY]);

        AssertUtils::assertArray($options[OSSOptions::PART_ETAGS], OSSOptions::PART_ETAGS);
        for ($i = 0; $i < count($options[OSSOptions::PART_ETAGS]); $i++) {
            $partETag = $options[OSSOptions::PART_ETAGS][$i];
            AssertUtils::assertArray($partETag, OSSOptions::PART_ETAGS.'.'.$i);
            AssertUtils::assertSet(array(OSSOptions::PART_NUMBER, OSSOptions::ETAG), $partETag);
        }
        return $options;
    }

    protected function getRequest($options) {
        return OSSRequestBuilder::factory()
            ->setEndpoint($options[OSSOptions::ENDPOINT])
            ->setBucket($options[OSSOptions::BUCKET])
            ->setKey($options[OSSOptions::KEY])
            ->addParameter('uploadId', $options[OSSOptions::UPLOAD_ID])
            ->setMethod(HttpMethods::POST)
            ->setContent($this->buildXmlBody($options[OSSOptions::PART_ETAGS]))
            ->build();
    }

    private function buildXmlBody(array $partETags) {
        $xml = new \SimpleXMLElement('<CompleteMultipartUpload />');
        foreach ($partETags as $partEtag) {
            $partETagNode = $xml->addChild('Part');
            $partETagNode->addChild('PartNumber', $partEtag[OSSOptions::PART_NUMBER]);
            $partETagNode->addChild('ETag', '"'.$partEtag[OSSOptions::ETAG].'"');
        }
        return $xml->asXML();
    }
}