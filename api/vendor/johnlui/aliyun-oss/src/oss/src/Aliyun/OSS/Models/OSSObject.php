<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

use Aliyun\Common\Utilities\DateUtils;

use Aliyun\OSS\Utilities\OSSHeaders;

/**
 * 表示OSS中的Object。
 * <p>
 * 在 OSS 中，用户的每个文件都是一个 Object，每个文件需小于 5G。
 * Object包含key、data和user meta。其中，key是Object 的名字；
 * data是Object 的数据；user meta是用户对该object的描述。
 * </p>
 * <p>
 * Object 命名规范
 * <ul>
 *  <li>使用UTF-8编码</li>
 *  <li>长度必须在 1-1023字节之间</li>
 *  <li>不能以斜线（/）或反斜线（\）开关</li>
 * </ul>
 * </p>
 *
 * @package Aliyun\OSS\Models
 */
class OSSObject {
    /**
     * @var string Object的key
     */
    private $key;

    /**
     * @var string Object所在Bucket的名字
     */
    private $bucketName;

    /**
     * @var resource Object的内容
     */
    private $objectContent = null;

    /**
     * @var array metadata
     */
    private $metadata = array();

    /**
     * @var array 用户设置的元数据
     */
    private $userMetadata = array();

    /**
     * @internal
     * @param string $bucketName
     */
    public function setBucketName($bucketName) {
        $this->bucketName = $bucketName;
    }

    /**
     * 获取Object所在Bucket的名称
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
     * 获取Object的Key
     *
     * @return string
     */
    public function getKey() {
        return $this->key;
    }

    /**
     * 获取Object的元数据
     *
     * @return array
     */
    public function getMetadata() {
        return $this->metadata;
    }

    /**
     * @internal
     * @param $key string
     * @param $value string
     */
    public function addMetadata($key, $value) {
        $this->metadata[$key] = $value;
    }

    /**
     * @internal
     * @param resource $objectContent
     */
    public function setObjectContent($objectContent) {
        $this->objectContent = $objectContent;
    }

    /**
     * 获取Object的内容
     *
     * @return resource
     */
    public function getObjectContent() {
        return $this->objectContent;
    }

    /**
     * 获取用户自定义元数据
     *
     * @return array
     */
    public function getUserMetadata() {
        return $this->userMetadata;
    }

    /**
     * @internal
     * @param $key string
     * @param $value string
     */
    public function addUserMetadata($key, $value) {
        $this->userMetadata[$key] = $value;
    }

    /**
     * 获取最后修改的日期
     * @return \DateTime
     */
    public function getLastModified() {
        if (!isset($this->metadata[OSSHeaders::LAST_MODIFIED])) {
            return null;
        }
        return $this->metadata[OSSHeaders::LAST_MODIFIED];
    }

    /**
     * 获取返回内容的长度
     * @return int
     */
    public function getContentLength() {
        $contentLengthKey = OSSHeaders::CONTENT_LENGTH;
        if (isset($this->metadata[$contentLengthKey])) {
            return (int) $this->metadata[$contentLengthKey];
        }

        // mitmproxy's bug, return 'content-length' when head a request.
        $contentLengthKey = strtolower($contentLengthKey);
        if (isset($this->metadata[$contentLengthKey])) {
            return (int) $this->metadata[$contentLengthKey];
        }

        return (int) 0;
    }

    /**
     * 获取返回的Content-Type
     * @return string
     */
    public function getContentType() {
        if (!isset($this->metadata[OSSHeaders::CONTENT_TYPE])) {
            return null;
        }
        return $this->metadata[OSSHeaders::CONTENT_TYPE];
    }

    /**
     * 获取返回的Content-Encoding
     * @return string
     */
    public function getContentEncoding() {
        if (!isset($this->metadata[OSSHeaders::CONTENT_ENCODING])) {
            return null;
        }
        return $this->metadata[OSSHeaders::CONTENT_ENCODING];
    }

    /**
     * 获取返回的Content-Language
     * @return string
     */
    public function  getContentLanguage() {
        if (!isset($this->metadata[OSSHeaders::CONTENT_LANGUAGE])) {
            return null;
        }
        return $this->metadata[OSSHeaders::CONTENT_LANGUAGE];
    }

    /**
     * 获取Expires
     * @return \DateTime|null
     */
    public function getExpires() {
        if (!isset($this->metadata[OSSHeaders::EXPIRES])) {
            return null;
        }
        return DateUtils::parseDate($this->metadata[OSSHeaders::EXPIRES]);
    }

    /**
     * 获取返回的Cache-Control
     * @return string
     */
    public function getCacheControl() {
        if (!isset($this->metadata[OSSHeaders::CACHE_CONTROL])) {
            return null;
        }
        return $this->metadata[OSSHeaders::CACHE_CONTROL];
    }

    /**
     * 获取返回的Content-Disposition
     * @return string
     */
    public function getContentDisposition() {
        if (!isset($this->metadata[OSSHeaders::CONTENT_DISPOSITION])) {
            return null;
        }
        return $this->metadata[OSSHeaders::CONTENT_DISPOSITION];
    }

    /**
     * 获取ETag
     * @return string
     */
    public function getETag() {
        if (!isset($this->metadata[OSSHeaders::ETAG])) {
            return null;
        }
        return $this->metadata[OSSHeaders::ETAG];
    }

    /**
     * 以string输出Object的内容
     * @return string
     */
    public function __toString() {
        return stream_get_contents($this->objectContent, -1, 0);
    }

    /**
     * 对象析构时会自动关闭流
     */
    public function __destruct() {
        if (is_resource($this->objectContent)) {
            fclose($this->objectContent);
        }
    }

}
