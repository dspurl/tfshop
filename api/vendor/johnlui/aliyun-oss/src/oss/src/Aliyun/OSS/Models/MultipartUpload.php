<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

/**
 * 用以表示每个分块上传事件的信息
 *
 * @package Aliyun\OSS\Models
 */
class MultipartUpload {
    /**
     * @var string
     */
    private $key;

    /**
     * @var string
     */
    private $uploadId;

    /**
     * @var \DateTime 上传事件初始化的时间
     */
    private $initiated;

    /**
     * @internal
     * @param \DateTime $initiated
     */
    public function setInitiated($initiated) {
        $this->initiated = $initiated;
    }

    /**
     * 获取上传事件初始化的时间
     *
     * @return \DateTime
     */
    public function getInitiated() {
        return $this->initiated;
    }

    /**
     * @internal
     * @param string $key
     */
    public function setKey($key) {
        $this->key = $key;
    }

    /**
     * 获取分块上传Object的Key
     * @return string
     */
    public function getKey() {
        return $this->key;
    }

    /**
     * @internal
     * @param string $uploadId
     */
    public function setUploadId($uploadId) {
        $this->uploadId = $uploadId;
    }

    /**
     * 获取上传事件的UploadId
     *
     * @return string
     */
    public function getUploadId() {
        return $this->uploadId;
    }

}