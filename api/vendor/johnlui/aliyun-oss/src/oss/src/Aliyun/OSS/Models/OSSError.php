<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

/**
 * OSS错误的返回结果
 *
 * @package Aliyun\OSS\Models
 */
class OSSError {

    /**
     * @var string
     */
    private $code;

    /**
     * @var string
     */
    private $requestId;

    /**
     * @var string
     */
    private $message;

    /**
     * @var string
     */
    private $hostId;

    /**
     * 获取OSS错误的Code
     *
     * @return string
     */
    public function getCode() {
        return $this->code;
    }

    /**
     * @internal
     * @param $code
     */
    public function setCode($code) {
        $this->code = $code;
    }

    /**
     * 获取RequestId
     *
     * @return string
     */
    public function getRequestId() {
        return $this->requestId;
    }

    /**
     * @internal
     * @param $requestId
     */
    public function setRequestId($requestId) {
        $this->requestId = $requestId;
    }

    /**
     * 获取HostId
     * @return string
     */
    public function getHostId() {
        return $this->hostId;
    }

    /**
     * @internal
     * @param $hostId
     */
    public function setHostId($hostId) {
        $this->hostId = $hostId;
    }

    /**
     * 获取错误信息
     *
     * @return string
     */
    public function getMessage() {
        return $this->message;
    }

    /**
     * @internal
     * @param $message
     */
    public function setMessage($message) {
        $this->message = $message;
    }
}
