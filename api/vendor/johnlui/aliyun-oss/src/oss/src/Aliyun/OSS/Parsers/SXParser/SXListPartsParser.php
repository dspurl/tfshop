<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Parsers\SXParser;

use Aliyun\Common\Communication\HttpResponse;

use Aliyun\Common\Utilities\DateUtils;

use Aliyun\OSS\Models\PartListing;

use Aliyun\OSS\Models\PartSummary;

use Aliyun\OSS\Utilities\OSSUtils;

class SXListPartsParser extends SXParser {

    public function parse(HttpResponse $response, $options) {
        $xml = $this->getXmlObject($response->getContent());

        $partListing = new PartListing();

        $bucket = (string) $xml->Bucket;
        $key = (string) $xml->Key;
        $uploadId = (string) $xml->UploadId;
        $partNumberMarker = $xml->PartNumberMarker ? (int) $xml->PartNumberMarker : null;
        $nextPartNumberMarker = $xml->NextPartNumberMarker ? (int) $xml->NextPartNumberMarker : null;
        $maxParts = $xml->MaxParts ? (int) $xml->MaxParts : null;
        $isTruncated = $xml->IsTruncated ? (string) $xml->IsTruncated : null;
        $storageClass = $xml->StorageClass ? (string) $xml->StorageClass : null;

        if ($isTruncated === 'true') {
            $isTruncated = true;
        } else {
            $isTruncated = false;
        }

        $partListing->setBucketName($bucket);
        $partListing->setKey($key);
        $partListing->setUploadId($uploadId);
        $partListing->setPartNumberMarker($partNumberMarker);
        $partListing->setNextPartNumberMarker($nextPartNumberMarker);
        $partListing->setMaxParts($maxParts);
        $partListing->setIsTruncated($isTruncated);
        $partListing->setStorageClass($storageClass);

        if ($xml->Part) {
            $parts = array();
            foreach ($xml->Part as $part) {
                $parSummary = new PartSummary();
                $parSummary->setPartNumber((int) $part->PartNumber);
                $parSummary->setLastModified(DateUtils::parseDate((string) $part->LastModified));
                $parSummary->setETag(OSSUtils::trimQuotes((string) $part->ETag));
                $parSummary->setSize((int) $part->Size);
                $parts[] = $parSummary;
            }
            $partListing->setParts($parts);
        }
        return $partListing;
    }
}