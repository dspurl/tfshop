<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */

namespace Aliyun\OSS\Models;

/**
 * CompleteMultipartUpload的返回结果
 *
 * @package Aliyun\OSS\Models
 */
class CompleteMultipartUploadResult {
    /**
     * @var string
     */
    private $location;

    /**
     * @var string
     */
    private $bucketName;

    /**
     * @var string
     */
    private $key;

    /**
     * @var string
     */
    private $eTag;

    /**
     * @internal
     *
     * @param string $bucketName
     */
    public function setBucketName($bucketName) {
        $this->bucketName = $bucketName;
    }

    /**
     * 获取Bucket的名字
     *
     * @return string
     */
    public function getBucketName() {
        return $this->bucketName;
    }

    /**
     * @internal
     *
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
     * @param string $key
     */
    public function setKey($key) {
        $this->key = $key;
    }

    /**
     * 获取Object的Key
     *
     * @return string
     */
    public function getKey() {
        return $this->key;
    }

    /**
     * @internal
     *
     * @param string $location
     */
    public function setLocation($location) {
        $this->location = $location;
    }

    /**
     * 获取上传的Object地址
     *
     * @return string
     */
    public function getLocation() {
        return $this->location;
    }

}
