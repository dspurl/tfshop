<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Utilities;

use Aliyun\OSS\Utilities\OSSHeaders;

use Aliyun\Common\Communication\HttpRequest;

class SignUtils {
    private static $NEW_LINE = "\n";
    private static $SIGNED_PARAMTERS = array (
        "acl", "uploadId", "partNumber", "uploads",
        ResponseHeaderOverrides::RESPONSE_HEADER_CACHE_CONTROL,
        ResponseHeaderOverrides::RESPONSE_HEADER_CONTENT_DISPOSITION,
        ResponseHeaderOverrides::RESPONSE_HEADER_CONTENT_ENCODING,
        ResponseHeaderOverrides::RESPONSE_HEADER_CONTENT_LANGUAGE,
        ResponseHeaderOverrides::RESPONSE_HEADER_CONTENT_TYPE,
        ResponseHeaderOverrides::RESPONSE_HEADER_EXPIRES,
    );
    
    
    public static function buildCanonicalString(HttpRequest $request, $bucket, $objectKey) {
        $buildString = $request->getMethod().self::$NEW_LINE;
        
        $headersToSign = array();
        foreach ($request->getHeaders() as $key => $value) {
            if (empty($key)) {
                continue;
            }
            
            $lowerKey = strtolower($key);
            
            if ($lowerKey == strtolower(OSSHeaders::CONTENT_TYPE)
                    || $lowerKey == strtolower(OSSHeaders::CONTENT_MD5)
                    || $lowerKey == strtolower(OSSHeaders::DATE)
                    || strpos($lowerKey, OSSHeaders::OSS_PREFIX) === 0) {
                $headersToSign[$lowerKey] = $value;
            }
        }
        
        if (!isset($headersToSign[strtolower(OSSHeaders::CONTENT_TYPE)])) {
            $headersToSign[strtolower(OSSHeaders::CONTENT_TYPE)] = '';
        }
        if (!isset($headersToSign[strtolower(OSSHeaders::CONTENT_MD5)])) {
            $headersToSign[strtolower(OSSHeaders::CONTENT_MD5)] = '';
        }
        
        // Add querys that have the prefix "x-oss-"
        foreach ($request->getParameters() as $key => $value){
            if (strpos($key, OSSHeaders::OSS_PREFIX) === 0){
                $headersToSign[$key] = $value;
            }
        }
        
        // Sort
        ksort($headersToSign);
        
        // Add all headers to sign to the builder
        foreach ($headersToSign as $key => $value) {        
            if (strpos($key, OSSHeaders::OSS_PREFIX) === 0){
                $buildString = $buildString.$key.':'.$value;
            } else {
                $buildString .= $value;
            }
            $buildString .= self::$NEW_LINE;
        }

        return $buildString.self::buildCanonicalizedResource(self::buildResourcePath($bucket, $objectKey), $request->getParameters());
    }
    
    private static function buildCanonicalizedResource($resourcePath, array $parameters) {

        $buildString = $resourcePath;


        //sort
        ksort($parameters);
        
        $seprator = '?';
        foreach ($parameters as $key => $value) {
            if (!in_array($key, self::$SIGNED_PARAMTERS, true)) {
                continue;
            }
            $buildString .= $seprator;
            $buildString .= $key;

            // Singer will not success if $value is '', for the webservice regard '' as null
            // TODO: 
            if ($value !== null) {
                $buildString .= '='.$value;
            }
            $seprator = '&';
        }
        return $buildString;
    }

    private static function buildResourcePath($bucket, $key) {
        if (empty($bucket)) {
            return '/';
        }
        return '/'.$bucket.'/'.$key;
    }
}
