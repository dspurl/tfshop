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

use Aliyun\OSS\Models\OSSObjectSummary;

use Aliyun\OSS\Models\ObjectListing;

use Aliyun\OSS\Models\Owner;

use Aliyun\OSS\Utilities\OSSUtils;

class SXListObjectsParser extends SXParser {
    public function parse(HttpResponse $response, $options) {
        $xml = $this->getXmlObject($response->getContent());

        $objectListing = new ObjectListing();

        $name = (string) $xml->Name;
        $prefix = (string) $xml->Prefix ? (string) $xml->Prefix : null;
        $marker = $xml->Marker ? (string) $xml->Marker : null;
        $maxKeys = $xml->MaxKeys ? (int) $xml->MaxKeys : null;
        $delimiter = $xml->Delimiter ? (string) $xml->Delimiter : null;
        $isTruncated = $xml->IsTruncated ? (string) $xml->IsTruncated : null;
        $nextMarker = $xml->NextMarker ? (string) $xml->NextMarker : null;

        if ($isTruncated === 'true') {
            $isTruncated = true;
        } else {
            $isTruncated = false;
        }

        $objectListing->setBucketName($name);
        $objectListing->setPrefix($prefix);
        $objectListing->setMarker($marker);
        $objectListing->setMaxKeys($maxKeys);
        $objectListing->setDelimiter($delimiter);
        $objectListing->setIsTruncated($isTruncated);
        $objectListing->setNextMarker($nextMarker);

        if ($xml->Contents) {
            $objectSummarys = array();
            foreach ($xml->Contents as $content) {
                $objectSummary = new OSSObjectSummary();
                $key = (string) $content->Key;
                $lastModified = DateUtils::parseDate((string) $content->LastModified);
                $eTag = OSSUtils::trimQuotes((string) $content->ETag);
                $size = (int) $content->Size;
                $storageClass = (string) $content->StorageClass;
                $owner = new Owner();
                $owner->setDisplayName((string) $content->Owner->DisplayName);
                $owner->setId((string) $content->Owner->ID);

                $objectSummary->setBucketName($name);
                $objectSummary->setKey($key);
                $objectSummary->setLastModified($lastModified);
                $objectSummary->setETag($eTag);
                $objectSummary->setSize($size);
                $objectSummary->setStorageClass($storageClass);
                $objectSummary->setOwner($owner);

                $objectSummarys[] = $objectSummary;
            }
            $objectListing->setObjectSummarys($objectSummarys);
        }

        if ($xml->CommonPrefixes) {
            $commonPrefixes = array();
            foreach ($xml->CommonPrefixes as $commonPrefix) {
                $commonPrefixes[] = (string) $commonPrefix->Prefix;
            }
            $objectListing->setCommonPrefixes($commonPrefixes);
        }

        return $objectListing;
    }
}
