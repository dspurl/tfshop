<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

/**
 * List Objects 返回的结果
 *
 * @package Aliyun\OSS\Models
 */
class ObjectListing {
    /**
     * @var array Object 信息列表
     */
    private $objectSummarys = array();

    /**
     * @var array
     */
    private $commonPrefixes = array();

    /**
     * @var string Bucket的名字
     */
    private $bucketName;

    /**
     * @var string 如果没有全部获取，nextMarker指明下一次获取的位置
     */
    private $nextMarker;

    /**
     * @var bool 是否全部获取完成
     */
    private $isTruncated;

    /**
     * @var string
     */
    private $prefix;

    /**
     * @var string
     */
    private $marker;

    /**
     * @var integer
     */
    private $maxKeys;

    /**
     * @var string
     */
    private $delimiter;

    /**
     * @internal
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
     * @param array $commonPrefixes
     */
    public function setCommonPrefixes($commonPrefixes) {
        $this->commonPrefixes = $commonPrefixes;
    }

    /**
     * 获取CommonPrefixes
     *
     * @return array
     */
    public function getCommonPrefixes() {
        return $this->commonPrefixes;
    }

    /**
     * @internal
     *
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
     *
     * @param bool $isTruncated
     */
    public function setIsTruncated($isTruncated) {
        $this->isTruncated = $isTruncated;
    }

    /**
     * 获取IsTruncated，表示返回结果是否被截断
     *
     * @return bool
     */
    public function getIsTruncated() {
        return $this->isTruncated;
    }

    /**
     * @internal
     * @param string $marker
     */
    public function setMarker($marker) {
        $this->marker = $marker;
    }

    /**
     * 获取Marker
     *
     * @return string
     */
    public function getMarker() {
        return $this->marker;
    }

    /**
     * @internal
     * @param int $maxKeys
     */
    public function setMaxKeys($maxKeys) {
        $this->maxKeys = $maxKeys;
    }

    /**
     * 获取MexKeys
     *
     * @return int
     */
    public function getMaxKeys() {
        return $this->maxKeys;
    }

    /**
     * @internal
     *
     * @param string $nextMarker
     */
    public function setNextMarker($nextMarker) {
        $this->nextMarker = $nextMarker;
    }

    /**
     * 获取NextMarker
     *
     * @return string
     */
    public function getNextMarker() {
        return $this->nextMarker;
    }

    /**
     * @internal
     * @param array $objectSummarys
     */
    public function setObjectSummarys($objectSummarys) {
        $this->objectSummarys = $objectSummarys;
    }

    /**
     * 获取Object的列表
     *
     * @return array
     */
    public function getObjectSummarys() {
        return $this->objectSummarys;
    }

    /**
     * @internal
     * @param string $prefix
     */
    public function setPrefix($prefix) {
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
