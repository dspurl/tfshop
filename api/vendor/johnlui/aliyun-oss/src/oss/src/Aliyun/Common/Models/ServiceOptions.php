<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\Common\Models;

/**
 * 构造Client所包含的键
 * @package Aliyun\Common\Models
 */
class ServiceOptions {
	const ACCESS_KEY_ID = 'AccessKeyId';
	const ACCESS_KEY_SECRET = 'AccessKeySecret';
	const ENDPOINT = 'Endpoint';
	const CHARSET = 'Charset';
    const MAX_ERROR_RETRY = 'MaxErrorRetry';
    const USER_AGENT = 'UserAgent';
    const CURL_OPTIONS = 'CurlOptions';
}
