<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */

namespace Aliyun\OSS\Commands;

use Aliyun\Common\Auth\ServiceSignature;

use Aliyun\Common\Communication\HttpRequest;

use Aliyun\Common\Utilities\AssertUtils;

use Aliyun\Common\Utilities\HttpHeaders;
use Aliyun\Common\Utilities\HttpMethods;
use Aliyun\OSS\Auth\OSSRequestSigner;

use Aliyun\OSS\Models\OSSOptions;

use Aliyun\OSS\OSSClient;

use Aliyun\OSS\Utilities\OSSHeaders;

use Aliyun\OSS\Utilities\OSSRequestBuilder;

use Aliyun\OSS\Utilities\OSSUtils;

use Aliyun\OSS\Utilities\SignUtils;

use Aliyun\Common\Exceptions\ClientException;

class GeneratePresignedUrlCommand {

    private $name;

    public function __construct($name) {
        $this->name = $name;
    }

    private function getCommandOptions() {
        return array(
            OSSOptions::METHOD => 'GET',
        );
    }

    private function checkOptions($options) {
        AssertUtils::assertSet(array(
            OSSOptions::BUCKET,
            OSSOptions::KEY,
            OSSOptions::EXPIRES,
        ), $options);

        OSSUtils::assertBucketName($options[OSSOptions::BUCKET]);
        if (isset($options[OSSOptions::KEY])) {
            OSSUtils::assertObjectKey($options[OSSOptions::KEY]);
        }

        if (!($options[OSSOptions::EXPIRES] instanceof \DateTime)) {
            throw new \InvalidArgumentException(OSSOptions::EXPIRES . ' must be instance of \DateTime');
        }

        $options[OSSOptions::METHOD] = strtoupper($options[OSSOptions::METHOD]);

        return $options;
    }

    private function generate($options) {
        $bucket = $options[OSSOptions::BUCKET];
        $key = $options[OSSOptions::KEY];
        $method = $options[OSSOptions::METHOD];

        $expires = $options[OSSOptions::EXPIRES];
        $expires = (string) $expires->getTimeStamp();

        $builder = OSSRequestBuilder::factory()
            ->setEndpoint($options[OSSOptions::ENDPOINT])
            ->setBucket($bucket)
            ->setKey($key)
            ->setMethod($method)
            ->addHeader(HttpHeaders::DATE, $expires);

        if (isset($options[OSSOptions::CONTENT_TYPE])) {
            $builder->addHeader(OSSHeaders::CONTENT_TYPE, $options[OSSOptions::CONTENT_TYPE]);
        }

        if (isset($options[OSSOptions::USER_METADATA])) {
            foreach ($options[OSSOptions::USER_METADATA] as $metakey => $value) {
                $builder->addHeader(OSSHeaders::OSS_USER_META_PREFIX . $metakey, $value);
            }
        }

        // Overrides
        $builder->addOverrides($options);

        $request = $builder->build();

        $canonicalString = SignUtils::buildCanonicalString($request, $bucket, $key);

        $signature = ServiceSignature::factory()->computeSignature($options[OSSOptions::ACCESS_KEY_SECRET], $canonicalString);

        $request->addParameter('OSSAccessKeyId', $options[OSSOptions::ACCESS_KEY_ID]);
        $request->addParameter('Signature', $signature);
        $request->addParameter('Expires', $expires);

        return $request->getFullUrl();
    }

    public function execute($clientOptions, $userOptions) {
        $options = array_merge($clientOptions, $this->getCommandOptions(), $userOptions);
        $options = $this->checkOptions($options);
        try {
            return $this->generate($options);
        } catch (\Exception $ex) {

            if ($ex instanceof ClientException) {
                throw $ex;
            }

            throw new ClientException($ex->getMessage(), $ex);
        }
    }
}