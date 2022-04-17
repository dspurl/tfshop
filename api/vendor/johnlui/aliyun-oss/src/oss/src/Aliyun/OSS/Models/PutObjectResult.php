<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

/**
 * Put Object的返回结果
 * @package Aliyun\OSS\Models
 */
class PutObjectResult {

    /**
     * Object 的ETag值
     * @var string
     */
    private $eTag;

    /**
     * 设置ETag的值
     *
     * @internal
     *
     * @param string $eTag
     */
    public function setETag($eTag) {
        $this->eTag = $eTag;
    }

    /**
     * 获取ETag的值
     * @return string
     */
    public function getETag() {
        return $this->eTag;
    }


}