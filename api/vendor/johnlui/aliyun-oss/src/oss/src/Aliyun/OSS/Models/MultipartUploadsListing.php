<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

/**
 * List multipart uploads 的返回结果
 *
 * @package Aliyun\OSS\Models
 */
class MultipartUploadsListing {

    /**
     * @var string Bucket的名字
     */
    private $bucketName;

    /**
     * @var string 列表的起始Object位置。
     */
    private $keyMarker;

    /**
     * @var string
     */
    private $delimiter;

    /**
     * @var string
     */
    private $prefix;

    /**
     * @var string
     */
    private $uploadIdMarker;

    /**
     * @var integer
     */
    private $maxUploads;

    /**
     * @var bool
     */
    private $isTruncated;

    /**
     * @var string
     */
    private $nextKeyMarker;

    /**
     * @var string
     */
    private $nextUploadIdMarker;

    /**
     * @var array
     */
    private $multipartUploads = array();

    /**
     * @var array
     */
    private $commonPrefixes = array();

    /**
     * @internal
     * @param string $uploadIdMarker
     */
    public function setUploadIdMarker($uploadIdMarker) {
        $this->uploadIdMarker = $uploadIdMarker;
    }

    /**
     * 获取UploadIdMarker
     *
     * @return string
     */
    public function getUploadIdMarker() {
        return $this->uploadIdMarker;
    }

    /**
     * 获取Bucket的名字
     *
     * @param string $bucketName
     */
    public function setBucketName($bucketName) {
        $this->bucketName = $bucketName;
    }

    /**
     * @internal
     * @return string
     */
    public function getBucketName() {
        return $this->bucketName;
    }

    /**
     * @internal
     *
     * @param array $commonPrefixes
     */
    public function setCommonPrefixes($commonPrefixes) {
        $this->commonPrefixes = $commonPrefixes;
    }

    /**
     * 获取返回的CommonPrefixes
     *
     * @return array
     */
    public function getCommonPrefixes() {
        return $this->commonPrefixes;
    }

    /**
     * @internal
     * @param string $delimiter
     */
    public function setDelimiter($delimiter) {
        $this->delimiter = $delimiter;
    }

    /**
     * 获取Delimiter
     *
     * @return string
     */
    public function getDelimiter() {
        return $this->delimiter;
    }

    /**
     * @internal
     * @param boolean $isTruncated
     */
    public function setIsTruncated($isTruncated) {
        $this->isTruncated = $isTruncated;
    }

    /**
     * 获取IsTruncated，标明是否本次返回的Multipart Upload结果列表被截断
     *
     * @return boolean
     */
    public function getIsTruncated() {
        return $this->isTruncated;
    }

    /**
     * @internal
     * @param string $keyMarker
     */
    public function setKeyMarker($keyMarker) {
        $this->keyMarker = $keyMarker;
    }

    /**
     * 获取KeyMarker
     *
     * @return string
     */
    public function getKeyMarker() {
        return $this->keyMarker;
    }

    /**
     * @internal
     * @param int $maxUploads
     */
    public function setMaxUploads($maxUploads) {
        $this->maxUploads = $maxUploads;
    }

    /**
     * 获取MaxUploads
     *
     * @return int
     */
    public function getMaxUploads() {
        return $this->maxUploads;
    }

    /**
     * @internal
     * @param array $multipartUploads
     */
    public function setMultipartUploads($multipartUploads) {
        $this->multipartUploads = $multipartUploads;
    }

    /**
     * 获取所有的分块上传事件
     *
     * @return array
     */
    public function getMultipartUploads() {
        return $this->multipartUploads;
    }

    /**
     * @internal
     * @param string $nextKeyMarker
     */
    public function setNextKeyMarker($nextKeyMarker) {
        $this->nextKeyMarker = $nextKeyMarker;
    }

    /**
     * 获取NextKeyMarker
     *
     * @return string
     */
    public function getNextKeyMarker() {
        return $this->nextKeyMarker;
    }

    /**
     * @internal
     * @param string $nextUploadIdMarker
     */
    public function setNextUploadIdMarker($nextUploadIdMarker) {
        $this->nextUploadIdMarker = $nextUploadIdMarker;
    }

    /**
     * 获取NextUploadIdMarker
     *
     * @return string
     */
    public function getNextUploadIdMarker() {
        return $this->nextUploadIdMarker;
    }

    /**
     * @internal
     * @param string $prefix
     */
    public function setPrefix($prefix)  {
        $this->prefix = $prefix;
    }

    /**
     * 获取Prefix
     *
     * @return string
     */
    public function getPrefix() {
        return $this->prefix;
    }
}