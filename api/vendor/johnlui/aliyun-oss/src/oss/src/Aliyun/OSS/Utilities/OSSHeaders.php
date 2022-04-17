<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Utilities;

use Aliyun\Common\Utilities\HttpHeaders;

/**
 * OSS用到的请求头
 *
 * @package Aliyun\OSS\Models
 */
class OSSHeaders extends HttpHeaders {
    const OSS_PREFIX = 'x-oss-';
    const OSS_USER_META_PREFIX = 'x-oss-meta-';
    
    const OSS_CANNED_ACL = 'x-oss-acl';
    const OSS_STORAGE_CLASS = 'x-oss-storage-class';
    const OSS_VERSION_ID = 'x-oss-version-id';

    const GET_OBJECT_IF_MODIFIED_SINCE = 'If-Modified-Since';
    const GET_OBJECT_IF_UNMODIFIED_SINCE = 'If-Unmodified-Since';
    const GET_OBJECT_IF_MATCH = 'If-Match';
    const GET_OBJECT_IF_NONE_MATCH = 'If-None-Match';
    
    const COPY_OBJECT_SOURCE = "x-oss-copy-source";
    const COPY_OBJECT_SOURCE_IF_MATCH = "x-oss-copy-source-if-match";
    const COPY_OBJECT_SOURCE_IF_NONE_MATCH = "x-oss-copy-source-if-none-match";
    const COPY_OBJECT_SOURCE_IF_UNMODIFIED_SINCE = "x-oss-copy-source-if-unmodified-since";
    const COPY_OBJECT_SOURCE_IF_MODIFIED_SINCE = "x-oss-copy-source-if-modified-since";
    const COPY_OBJECT_METADATA_DIRECTIVE = "x-oss-metadata-directive";
    
    const OSS_HEADER_REQUEST_ID = "x-oss-request-id";
}
