<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Parsers\SXParser;


use Aliyun\Common\Communication\HttpResponse;

use Aliyun\OSS\Models\AccessControlPolicy;

use Aliyun\OSS\Models\Owner;

class SXGetBucketAclParser extends SXParser {

    public function parse(HttpResponse $response, $options) {
        $xml = $this->getXmlObject($response->getContent());

        $accessPolicy = new AccessControlPolicy();

        if (isset($xml->Owner)) {
            $owner  = new Owner();
            $owner->setId((string) $xml->Owner->ID);
            $owner->setDisplayName((string) $xml->Owner->DisplayName);
            $accessPolicy->setOwner($owner);
        }

        if (isset($xml->AccessControlList)) {
            $grants = array();
            foreach ($xml->AccessControlList as $access) {
                $grants[] = (string) $access->Grant;
            }
            $accessPolicy->setGrants($grants);
        }
        return $accessPolicy;
    }
}