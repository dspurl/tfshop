<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
use \Aliyun\Common\Models\ServiceOptions;

use \Aliyun\Common\Utilities\ServiceConstants;

return array(
    ServiceOptions::MAX_ERROR_RETRY => 3,
    ServiceOptions::USER_AGENT => 'aliyun-sdk-php' . '/' . ServiceConstants::SDK_VERSION,
    ServiceOptions::CURL_OPTIONS => array(),
);
