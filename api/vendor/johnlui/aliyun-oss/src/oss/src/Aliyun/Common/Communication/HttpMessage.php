<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */

namespace Aliyun\Common\Communication;

use Aliyun\Common\Utilities\AssertUtils;

abstract class HttpMessage {
    
    /**
     * Headers in http head.
     * @var array
    */
    protected $headers = array();
    
    /**
     * The content for http body
     * @var string|resource
    */
    protected $content = null;

    /**
     * @var int|bool The original offset of content.
     */
    protected $offset;

    /**
     * @var array
     */
    protected $contentMeta;


    public function getHeaders() {
        return $this->headers;
    }

    public function getHeader($name) {
        AssertUtils::assertString($name, 'HttpHeaderName');
        if (!isset($this->headers[$name])) {
            return null;
        }
        return $this->headers[$name];
    }
    
    public function addHeader($header, $value) {
        AssertUtils::assertString($header, 'HttpHeaderName');
        AssertUtils::assertString($value, 'HttpHeaderValue');
        $this->headers[$header] = $value;
    }
    
    public function getContent() {
        return $this->content;
    }
    
    public function setContent($content) {

        if ($content == null) return;

        if (!is_resource($content) && !is_string($content)) {
            throw new \InvalidArgumentException('Http content must be a string or resource.');
        }

        $offset = 0;

        if (is_resource($content)) {
            $offset = ftell($content);
            $this->contentMeta = stream_get_meta_data($content);
        }

        $this->offset = $offset;
        $this->content = $content;
    }

    /**
     * @return bool|int The original offset of content.
     */
    public function getOffset() {
        return $this->offset;
    }

    /**
     * @return bool
     */
    public function seekable() {
        if (is_string($this->content) || $this->content === null) return true;
        return $this->contentMeta['seekable'];
    }

    /**
     * @return bool
     */
    public function rewind() {
        if (is_string($this->content) || $this->content === null) {
            return true;
        }

        if (!$this->seekable()) {
            return false;
        }

        return fseek($this->content, $this->offset) == 0;
    }

    /**
     * Close the content.
     * @return bool Returns true on success or false on failure.
     */
    public function close() {
        if (is_resource($this->content)) {
            return fclose($this->content);
        }
        return false;
    }
}

