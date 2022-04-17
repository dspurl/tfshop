<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

/**
 * 表示分块上传Part的信息
 *
 * @package Aliyun\OSS\Models
 */
class PartSummary {

    /**
     * @var integer
     */
    private $partNumber;

    /**
     * @var \DateTime
     */
    private $lastModified;

    /**
     * @var string
     */
    private $eTag;

    /**
     * @var integer
     */
    private $size;

    /**
     * @internal
     * @param string $eTag
     */
    public function setETag($eTag) {
        $this->eTag = $eTag;
    }

    /**
     * 设置ETag
     *
     * @return string
     */
    public function getETag() {
        return $this->eTag;
    }

    /**
     * @internal
     * @param \DateTime $lastModified
     */
    public function setLastModified($lastModified) {
        $this->lastModified = $lastModified;
    }

    /**
     * 获取最后修改时间
     *
     * @return \DateTime
     */
    public function getLastModified() {
        return $this->lastModified;
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
     * @internal
     *
     * @param int $size
     */
    public function setSize($size) {
        $this->size = $size;
    }

    /**
     * 获取Part的大小
     *
     * @return int
     */
    public function getSize() {
        return $this->size;
    }
}
