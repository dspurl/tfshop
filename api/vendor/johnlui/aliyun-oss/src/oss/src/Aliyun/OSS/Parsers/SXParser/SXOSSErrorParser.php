<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Parsers\SXParser;

use Aliyun\Common\Communication\HttpResponse;

use Aliyun\OSS\Models\OSSError;

class SXOSSErrorParser extends SXParser {
    public function parse(HttpResponse $response, $options) {
        $xml = $this->getXmlObject($response->getContent());
        $code = ($xml->Code)? (string)$xml->Code : null;
        $message = ($xml->Message)? (string)$xml->Message : null;
        $requestId = ($xml->RequestId)? (string)$xml->RequestId : null;
        $hostId = ($xml->HostId)? (string)$xml->HostId : null;

        $error = new OSSError();
        $error->setCode($code);
        $error->setRequestId($requestId);
        $error->setMessage($message);
        $error->setHostId($hostId);

        return $error;
    }
}
