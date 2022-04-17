<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Utilities;

use Aliyun\OSS\Parsers\SXParser\SXOSSErrorParser;

final class OSSSXParserFactory extends OSSResponseParserFactory {

    const PREFIX = 'SX';
    const PARSER_PATH = 'Aliyun\\OSS\\Parsers\\SXParser\\';
    const EMPTY_PARSER_NAME = 'EmptyParser';

    public function createParser($commandName) {
        $className = self::PREFIX.ucfirst($commandName).'Parser';
        $class = self::PARSER_PATH.$className;
        if (!class_exists($class)) {
            $class = self::PARSER_PATH.self::PREFIX.self::EMPTY_PARSER_NAME;
        }
        return new $class();
    }
    
    public function createErrorParser() {
        return new SXOSSErrorParser();
    }
}
