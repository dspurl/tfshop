<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Utilities;

use Aliyun\Common\Utilities\DateUtils;

use Aliyun\OSS\Utilities\OSSHeaders;

use Aliyun\Common\Utilities\AssertUtils;

use Aliyun\Common\Communication\HttpRequest;

class OSSRequestBuilder {
    private $endpoint;
    private $method;
    private $bucket;
    private $key;
    private $parameters = array();
    private $headers = array();
    private $content = null;
    private $responseBody = null;

    public function getEndpoint() {
        return $this->endpoint;
    }
    
    public function setEndpoint($endpoint) {
        $this->endpoint = $endpoint;
        return $this;
    }
    
    public function getMethod() {
        return $this->method;
    }
    
    public function setMethod($method) {
        $this->method = $method;
        return $this;
    }
    
    public function getBucket() {
        return $this->bucket;
    }
    
    public function setBucket($bucket) {
        $this->bucket = $bucket;
        return $this;
    }
    
    public function getKey() {
        return $this->key;
    }
    
    public function setKey($key) {
        $this->key = $key;
        return $this;
    }
    
    public function addHeader($name, $value) {
        $this->headers[$name] = $value;
        return $this;
    }
    
    public function addParameter($name, $value) {
        $this->parameters[$name] = $value;
        return $this;
    }

    public function addOverrides($options) {
        OSSUtils::populateOverrides($this->parameters, $options);
        return $this;
    }

    public function addObjectMetadataHeaders($options) {
        OSSUtils::populateObjectMetadata($this->headers, $options);
        return $this;
    }

    public function getContent() {
        return $this->content;
    }

    public function setContent($content) {
        $this->content = $content;
        return $this;
    }

    public function setContentLength($contentLength) {
        $this->headers[OSSHeaders::CONTENT_LENGTH] = (string) $contentLength;
        return $this;
    }

    public function getContentLength() {
        if (!isset($this->headers[OSSHeaders::CONTENT_LENGTH])) {
            return null;
        }
        return (int) $this->headers[OSSHeaders::CONTENT_LENGTH];
    }

    public function setResponseBody($responseBody) {
        $this->responseBody = $responseBody;
    }

    public function getResponseBody() {
        return $this->responseBody;
    }

    public function build() {
        AssertUtils::assertString($this->endpoint, 'endpoint');
        // sent request
        $request = new HttpRequest();
        
        $request->setEndpoint(OSSUtils::buildEndpoint($this->endpoint, $this->bucket));
        
        if (isset($this->method)) {
            $request->setMethod($this->method);
        }
               
        $headers = $this->headers;
        
        // Date
        if (!isset($headers[OSSHeaders::DATE])) {
            $headers[OSSHeaders::DATE] = DateUtils::formatDate(new \DateTime());
        }
        
        // Content-Type
        if (!isset($headers[OSSHeaders::CONTENT_TYPE])) {
            $headers[OSSHeaders::CONTENT_TYPE] = '';
        }

        if (!isset($headers[OSSHeaders::CONTENT_LENGTH]) && is_string($this->content)) {
            $headers[OSSHeaders::CONTENT_LENGTH] = (string) strlen($this->content);
        }

        foreach ($headers as $key => $value) {
            $request->addHeader($key, $value);
        }
        
        $parameters = $this->parameters;
        foreach ($parameters as $key => $value) {
            $request->addParameter($key, $value);
        }

        $request->setResourcePath(OSSUtils::buildResourcePath($this->key));
        $request->setContent($this->content);
        $request->setResponseBody($this->responseBody);

        return $request;
    }
    
    public static function factory() {
        return new static();
    }
}
