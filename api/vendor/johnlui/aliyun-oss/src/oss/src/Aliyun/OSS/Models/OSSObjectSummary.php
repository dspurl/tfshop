<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

/**
 * Object的概要信息
 * @package Aliyun\OSS\Models
 */
class OSSObjectSummary {

    /**
     * @var string Bucket的名字
     */
    private $bucketName;

    /**
     * @var string Object的Key
     */
    private $key;

    /**
     * @var string Object的ETag
     */
    private $eTag;

    /**
     * @var integer Object的大小
     */
    private $size;

    /**
     * @var \DateTime Object最后修改的时间
     */
    private $lastModified;

    /**
     * @var string Object存储类型
     */
    private $storageClass;

    /**
     * @var Object的所有者
     */
    private $owner;

    /**
     * @internal
     * @param string $bucketName
     */
    public function setBucketName($bucketName) {
        $this->bucketName = $bucketName;
    }

    /**
     * 获取Object所在Bucket的名称
     *
     * @return string
     */
    public function getBucketName() {
        return $this->bucketName;
    }

    /**
     * @internal
     * @param string $eTag
     */
    public function setETag($eTag) {
        $this->eTag = $eTag;
    }

    /**
     * 获取Object的ETag信息
     *
     * @return string
     */
    public function getETag() {
        return $this->eTag;
    }

    /**
     * @internal
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
     * @param \DateTime $lastModified
     */
    public function setLastModified($lastModified) {
        $this->lastModified = $lastModified;
    }

    /**
     * 获取Object的最后修改时间
     *
     * @return \DateTime
     */
    public function getLastModified() {
        return $this->lastModified;
    }

    /**
     * @internal
     * @param Owner $owner
     */
    public function setOwner(Owner $owner) {
        $this->owner = $owner;
    }

    /**
     * 获取Object的拥有者
     *
     * @return Owner
     */
    public function getOwner()
    {
        return $this->owner;
    }

    /**
     * @internal
     *
     * @param integer $size
     */
    public function setSize($size) {
        $this->size = $size;
    }

    /**
     * 获取Object的大小
     *
     * @return integer
     */
    public function getSize() {
        return $this->size;
    }

    /**
     * @internal
     * @param string $storageClass
     */
    public function setStorageClass($storageClass) {
        $this->storageClass = $storageClass;
    }

    /**
     * 获取Object的存储类型
     *
     * @return string
     */
    public function getStorageClass() {
        return $this->storageClass;
    }

}