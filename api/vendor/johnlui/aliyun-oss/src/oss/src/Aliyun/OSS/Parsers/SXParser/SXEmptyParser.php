<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Parsers\SXParser;


use Aliyun\Common\Communication\ResponseParserInterface;

use Aliyun\Common\Communication\HttpResponse;

/**
 * Class EmptyParser
 * do nothing for the service that need not be parsed.
 * @package Aliyun\OSS\Parsers\SXParser
 */
class SXEmptyParser implements  ResponseParserInterface {
    public function parse(HttpResponse $response, $options) {
        // Do nothing...
    }
}