<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Exceptions;

use Aliyun\Common\Exceptions\ServiceException;

/**
 * 该异常在对开放存储数据服务（Open Storage Service）访问失败时抛出。
 *
 * @package Aliyun\OSS\Exceptions
 */
class OSSException extends ServiceException {
    public function __construct($code, $message, $requestId, $hostId) {
        parent::__construct($code, $message, $requestId, $hostId);
    }
}
