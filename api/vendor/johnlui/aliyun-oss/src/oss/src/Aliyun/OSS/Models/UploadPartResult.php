<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

use Aliyun\OSS\Models\OSSOptions;

/**
 * Upload Part的返回结果
 * @package Aliyun\OSS\Models
 */
class UploadPartResult {

    /**
     * @var integer
     */
    private $partNumber;

    /**
     * @var string
     */
    private $eTag;

    /**
     * @internal
     * @param string $eTag
     */
    public function setETag($eTag) {
        $this->eTag = $eTag;
    }

    /**
     * 获取ETag
     *
     * @return string
     */
    public function getETag() {
        return $this->eTag;
    }

    /**
     * @internal
     *
     * @param int $partNumber
     */
    public function setPartNumber($partNumber) {
        $this->partNumber = $partNumber;
    }

    /**
     * 获取PartNumber
     *
     * @return int
     */
    public function getPartNumber() {
        return $this->partNumber;
    }

    /**
     * 获取PartETag，用于构造CompleteMultipartUpload请求
     *
     * @return array
     */
    public function getPartETag() {
        return array(
            OSSOptions::PART_NUMBER => $this->partNumber,
            OSSOptions::ETAG => $this->eTag,
        );
    }

}