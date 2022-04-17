<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

/**
 * InitiateMultipartUpload的返回结果
 *
 * @package Aliyun\OSS\Models
 */
class InitiateMultipartUploadResult {

    /**
     * @var string 上传Object的Bucket的名字
     */
    private $bucketName;

    /**
     * @var string 上传Object的名字
     */
    private $key;

    /**
     * @var string UploadId
     */
    private $uploadId;

    /**
     * @internal
     * @param string $bucket
     */
    public function setBucketName($bucketName) {
        $this->bucketName = $bucketName;
    }

    /**
     * 获取用来创建Multipart上传的Bucket的名称。
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
     * 获取用来创建的Multipart的Object（也就是Multipart上传完成后新生成的Object）的key。
     *
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
     * 获取初始化上传事件的UploadId
     *
     * @return string
     */
    public function getUploadId() {
        return $this->uploadId;
    }

}