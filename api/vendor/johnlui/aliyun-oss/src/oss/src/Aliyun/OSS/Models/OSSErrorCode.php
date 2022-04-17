<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

/**
 * OSS的错误码
 * @package Aliyun\OSS\Models
 */
class OSSErrorCode {
    /**
     * 拒绝访问。
     */
    const ACCESS_DENIED = 'AccessDenied';

    /**
     * Bucket 已经存在 。
     */
    const BUCKES_ALREADY_EXISTS = 'BucketAlreadyExists';

    /**
     * Bucket 不为空。
     */
    const BUCKETS_NOT_EMPTY = 'BucketNotEmpty';

    /**
     * 文件组过大。
     */
    const FILE_GROUP_TOO_LARGE = 'FileGroupTooLarge';

    /**
     * 文件Part过时。
     */
    const FILE_PART_STALE = 'FilePartStale';

    /**
     * 参数格式错误。
     */
    const INVALID_ARGUMENT = 'InvalidArgument';

    /**
     * Access ID不存在。
     */
    const INVALID_ACCESS_KEY_ID = 'InvalidAccessKeyId';

    /**
     * 无效的 Bucket 名字。
     */
    const INVALID_BUCKET_NAME = 'InvalidBucketName';

    /**
     * 无效的 Object 名字 。
     */
    const INVALID_OBJECT_NAME = 'InvalidObjectName';

    /**
     * 无效的 Part。
     */
    const INVALID_PART = 'InvalidPart';

    /**
     * 无效的 Part顺序。
     */
    const INVALID_PART_ORDER = 'InvalidPartOrder';

    /**
     * OSS 内部发生错误。
     */
    const INTERNAL_ERROR = 'InternalError';

    /**
     * 缺少内容长度。
     */
    const MISSING_CONTENT_LENGTH = 'MissingContentLength';

    /**
     * Bucket 不存在。
     */
    const NO_SUCH_BUCKET = 'NoSuchBucket';

    /**
     * 文件不存在。
     */
    const NO_SUCH_KEY = 'NoSuchKey';

    /**
     * 无法处理的方法。
     */
    const NOT_IMPLEMENTED = 'NotImplemented';

    /**
     * 预处理错误。
     */
    const PRECONDITION_FAILED = 'PreconditionFailed';

    /**
     * 发起请求的时间和服务器时间超出15分钟。
     */
    const REQUEST_TIME_TOO_SKEWED = 'RequestTimeTooSkewed';

    /**
     * 请求超时。
     */
    const REQUEST_TIMEOUT = 'RequestTimeout';

    /**
     * 签名错误。
     */
    const SIGNATURE_DOES_NOT_MATCH = 'SignatureDoesNotMatch';

    /**
     * 用户的 Bucket 数目超过限制 。
     */
    const TOO_MANY_BUCKETS = 'TooManyBuckets';
}