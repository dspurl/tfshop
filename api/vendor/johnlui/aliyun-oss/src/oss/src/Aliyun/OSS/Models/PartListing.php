<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

/**
 * List Parts 的返回结果
 * @package Aliyun\OSS\Models
 */
class PartListing {

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
    private $uploadId;

    /**
     * @var integer
     */
    private $partNumberMarker;

    /**
     * @var integer
     */
    private $nextPartNumberMarker;

    /**
     * @var integer
     */
    private $maxParts;

    /**
     * @var bool
     */
    private $isTruncated;

    /**
     * @var string
     */
    private $storageClass;

    /**
     * @var array
     */
    private $parts = array();

    /**
     * @internal
     * @param string $bucketName
     */
    public function setBucketName($bucketName) {
        $this->bucketName = $bucketName;
    }

    /**
     * 返回请求的Bucket的名称
     *
     * @return string
     */
    public function getBucketName() {
        return $this->bucketName;
    }

    /**
     * @internal
     * @param string $key
     */
    public function setKey($key) {
        $this->key = $key;
    }

    /**
     * 返回请求的Object的Key
     *
     * @return string
     */
    public function getKey() {
        return $this->key;
    }

    /**
     * @internal
     *
     * @param boolean $isTruncated
     */
    public function setIsTruncated($isTruncated) {
        $this->isTruncated = $isTruncated;
    }

    /**
     * 返回IsTruncated，表示结果列表是否被截断
     *
     * @return boolean
     */
    public function getIsTruncated() {
        return $this->isTruncated;
    }

    /**
     * @internal
     *
     * @param int $maxParts
     */
    public function setMaxParts($maxParts) {
        $this->maxParts = $maxParts;
    }

    /**
     * 返回MaxParts
     *
     * @return int
     */
    public function getMaxParts() {
        return $this->maxParts;
    }

    /**
     * @internal
     * @param int $nextPartNumberMarker
     */
    public function setNextPartNumberMarker($nextPartNumberMarker) {
        $this->nextPartNumberMarker = $nextPartNumberMarker;
    }

    /**
     * 返回NextPartNumberMarker
     *
     * @return int
     */
    public function getNextPartNumberMarker() {
        return $this->nextPartNumberMarker;
    }

    /**
     * @internal
     * @param int $partNumberMarker
     */
    public function setPartNumberMarker($partNumberMarker) {
        $this->partNumberMarker = $partNumberMarker;
    }

    /**
     * 返回PartNumberMarker
     *
     * @return int
     */
    public function getPartNumberMarker() {
        return $this->partNumberMarker;
    }

    /**
     * @internal
     * @param array $parts
     */
    public function setParts($parts) {
        $this->parts = $parts;
    }

    /**
     * 返回上传事件已经上传的所有Part
     *
     * @return array
     */
    public function getParts() {
        return $this->parts;
    }

    /**
     * @internal
     * @param string $uploadId
     */
    public function setUploadId($uploadId) {
        $this->uploadId = $uploadId;
    }

    /**
     * 返回上传事件的UploadId
     *
     * @return string
     */
    public function getUploadId() {
        return $this->uploadId;
    }

    /**
     * @internal
     * @param string $storageClass
     */
    public function setStorageClass($storageClass) {
        $this->storageClass = $storageClass;
    }

    /**
     * 返回存储类型
     *
     * @return string
     */
    public function getStorageClass() {
        return $this->storageClass;
    }
}