<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Utilities;

use Aliyun\Common\Resources\ResourceManager;

use Aliyun\Common\Utilities\DateUtils;

use Aliyun\Common\Utilities\ServiceConstants;

use Aliyun\OSS\Models\OSSOptions;

class OSSUtils {
    const DEFAULT_CONTENT_TYPE = "application/octet-stream";

    const SUBRESOURCE_UPLOADS = "uploads";

    private static $_metaOptions = array(
        OSSOptions::CACHE_CONTROL,
        OSSOptions::CONTENT_DISPOSITION,
        OSSOptions::CACHE_CONTROL,
        OSSOptions::CONTENT_ENCODING,
        OSSOptions::CONTENT_TYPE,
        OSSOptions::EXPIRES,
        OSSOptions::USER_METADATA,
    );

    public static function getAllMetaOptions() {
        return self::$_metaOptions;
    }

    public static function containsMetaOptions($options) {
        foreach (self::$_metaOptions as $metaOption) {
            if (isset($options[$metaOption])) {
                return true;
            }
        }
        return false;
    }

    public static function populateOverrides(&$parameters, $options) {
        // Overrides
        if (isset($options[OSSOptions::RESPONSE_CACHE_CONTROL])) {
            $parameters[ResponseHeaderOverrides::RESPONSE_HEADER_CACHE_CONTROL]
                = $options[OSSOptions::RESPONSE_CACHE_CONTROL];
        }

        if (isset($options[OSSOptions::RESPONSE_CONTENT_DISPOSITION])) {
            $parameters[ResponseHeaderOverrides::RESPONSE_HEADER_CONTENT_DISPOSITION]
                = $options[OSSOptions::RESPONSE_CONTENT_DISPOSITION];
        }

        if (isset($options[OSSOptions::RESPONSE_CONTENT_ENDCODING])) {
            $parameters[ResponseHeaderOverrides::RESPONSE_HEADER_CONTENT_ENCODING]
                = $options[OSSOptions::RESPONSE_CONTENT_ENDCODING];
        }

        if (isset($options[OSSOptions::RESPONSE_CONTENT_LANGUAGE])) {
            $parameters[ResponseHeaderOverrides::RESPONSE_HEADER_CONTENT_LANGUAGE]
                = $options[OSSOptions::RESPONSE_CONTENT_LANGUAGE];
        }

        if (isset($options[OSSOptions::RESPONSE_CONTENT_TYPE])) {
            $parameters[ResponseHeaderOverrides::RESPONSE_HEADER_CONTENT_TYPE]
                = $options[OSSOptions::RESPONSE_CONTENT_TYPE];
        }

        if (isset($options[OSSOptions::RESPONSE_EXPIRES])) {
            $parameters[ResponseHeaderOverrides::RESPONSE_HEADER_EXPIRES]
                = $options[OSSOptions::RESPONSE_EXPIRES];
        }
    }

    public static function  populateObjectMetadata(&$headers, $options) {

        if (isset($options[OSSOptions::CONTENT_DISPOSITION])) {
            $headers[OSSHeaders::CONTENT_DISPOSITION] = $options[OSSOptions::CONTENT_DISPOSITION];
        }

        if (isset($options[OSSOptions::CACHE_CONTROL])) {
            $headers[OSSHeaders::CACHE_CONTROL] = $options[OSSOptions::CACHE_CONTROL];
        }

        if (isset($options[OSSOptions::CONTENT_ENCODING])) {
            $headers[OSSHeaders::CONTENT_ENCODING] = $options[OSSOptions::CONTENT_ENCODING];
        }

        if (isset($options[OSSOptions::CONTENT_TYPE])) {
            $headers[OSSHeaders::CONTENT_TYPE] = $options[OSSOptions::CONTENT_TYPE];
        }

        if (isset($options[OSSOptions::EXPIRES])) {
            $headers[OSSHeaders::EXPIRES] = DateUtils::formatDate($options[OSSOptions::EXPIRES]);
        }

        if (isset($options[OSSOptions::USER_METADATA])) {
            foreach ($options[OSSOptions::USER_METADATA] as $key => $value) {
                $headers[OSSHeaders::OSS_USER_META_PREFIX . strtolower($key)] = $value;
            }
        }
    }

    public static function buildEndpoint($endpoint, $bucket) {
        $urlParameters = parse_url($endpoint);
        $bucketEndpoint = $urlParameters['host'];

        if (!empty($bucket)) {
            $bucketEndpoint = $bucket.'.'.$bucketEndpoint;
        }

        if (isset($urlParameters['scheme'])) {
            $bucketEndpoint = $urlParameters['scheme'].'://'.$bucketEndpoint;
        }

        if (isset($urlParameters['port'])) {
            $bucketEndpoint = $bucketEndpoint.':'.$urlParameters['port'];
        }

        return $bucketEndpoint;
    }

    public static function buildResourcePath($key) {
        return empty($key) ? '/' : '/'.rawurlencode($key);
    }

    public static function trimQuotes($string) {
        return trim($string, "\"");
    }

    public static function validBucketName($bucketName) {
        $pattern = '/^[a-z0-9][a-z0-9_\-]{2,254}$/';
        if (preg_match($pattern, $bucketName)) {
            return true;
        }
        return false;
    }

    public static function validObjectKey($key) {
        if (!mb_check_encoding($key, ServiceConstants::CHARSET)) {
            return false;
        }

        for ($i = 0; $i < mb_strlen($key, ServiceConstants::CHARSET); $i++) {
            $charString = mb_substr($key, $i, 1, ServiceConstants::CHARSET);
            if (strlen($charString) == 1) {
                $char = ord($charString);
                if ($char !== 0x9 && $char < 0x20) {
                    return false;
                }
            }
        }

        $byteLength = strlen($key);
        return $byteLength > 0 && $byteLength < 1024;
    }


    public static function assertBucketName($bucketName) {
        if (!self::validBucketName($bucketName)) {
            throw new \InvalidArgumentException(ResourceManager::getInstance()->getString('BucketNameInvalid'));
        }
    }

    public static function assertObjectKey($key) {
        if (!self::validObjectKey($key)) {
            throw new \InvalidArgumentException(ResourceManager::getInstance()->getString('ObjectKeyInvalid'));
        }
    }

}
