<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

use Aliyun\Common\Models\ServiceOptions;

/**
 * OSS 请求所包含的键
 * @package Aliyun\OSS\Models
 */
class OSSOptions extends ServiceOptions {
    const CONTENT = 'Content';
    const BUCKET = 'Bucket';
    const KEY = 'Key';

    const ACL = 'ACL';

    const CONTENT_LENGTH = 'ContentLength';
    const CACHE_CONTROL = 'CacheControl';
    const CONTENT_DISPOSITION = 'ContentDisposition';
    const CONTENT_ENCODING = 'ContentEncoding';
    const EXPIRES = 'Expires';
    const USER_METADATA = 'UserMetadata';
    const CONTENT_TYPE = 'ContentType';

    const DELIMITER = 'Delimiter';
    const MARKER = 'Marker';
    const MAX_KEYS = 'MaxKeys';
    const PREFIX = 'Prefix';

    const RANGE = 'Range';

    const MATCHING_ETAG_CONSTRAINTS = 'MatchingETagConstraints';
    const NO_MATCHING_ETAG_CONSTRAINTS = 'NoMatchingETagConstraints';
    const UNMODIFIED_SINCE_CONSTRAINT = 'UnmodifiedSinceConstraint';
    const MODIFIED_SINCE_CONSTRAINT = 'ModifiedSinceConstraint';

    const META_ONLY = 'MetaOnly';
    const SAVE_AS = 'SaveAs';

    const RESPONSE_CACHE_CONTROL  = 'ResponseCacheControl';
    const RESPONSE_CONTENT_DISPOSITION  = 'ResponseContentDisposition';
    const RESPONSE_CONTENT_ENDCODING  = 'ResponseContentEncoding';
    const RESPONSE_CONTENT_LANGUAGE  = 'ResponseContentLanguage';
    const RESPONSE_CONTENT_TYPE  = 'ResponseContentType';
    const RESPONSE_EXPIRES = 'ResponseExpires';

    const SOURCE_BUCKET = 'SourceBucket';
    const SOURCE_KEY = 'SourceKey';
    const DEST_BUCKET = 'DestBucket';
    const DEST_KEY = 'DestKey';

    const MAX_UPLOADS = 'MaxUploads';
    const KEY_MARKER = 'KeyMarker';
    const UPLOAD_ID_MARKER = 'UploadIdMarker';

    const UPLOAD_ID = 'UploadId';
    const PART_NUMBER = 'PartNumber';
    const PART_SIZE = 'PartSize';

    const ETAG = 'ETag';

    const MAX_PARTS = 'MaxParts';
    const PART_NUMBER_MARKER = 'PartNumberMarker';

    const PART_ETAGS = 'PartETags';

    const METHOD = 'Method';
}
