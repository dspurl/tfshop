<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\Common\Utilities;

class AssertUtils {
    /**
     * 判断一个数组中是否包含某些键，判断原则为
     *  不存在  ：false
     *  null   ：true
     *  空字符串：true
     *  其他   ：true
     * @param array|string $key 需要包含的键或者键的集合
     * @param array $array 需要判断的数组
     * @throws \InvalidArgumentException 如果有键未被包含
     */
    public static function assertContains($needle, array $array) {
        if (is_array($needle)) {
            foreach ($needle as $key) {
                if (!array_key_exists($key, $array)) {
                    throw new \InvalidArgumentException("[{$key}] was not be contained.");
                }
            }
            return;
        }
        
        if (is_string($needle)) {
            if (!array_key_exists($needle, $array)) {
                throw new \InvalidArgumentException("[{$needle}] was not be contained.");
            }  
            return;          
        }
        
        self::makeError('assertConatins can only used for string or array');
    }
    
    /**
     * 判断一个数组某些键是否被设置，判断原则为：
     *  不存在  ：false
     *  null   ：false
     *  空字符串：true
     *  其他    ：true
     * @param mixed $needle 需要包含的键的集合
     * @param array $array 需要判断的数组
     * @throws \InvalidArgumentException 如果有键未被设置
     */
    public static function assertSet($needle, array $array) {
        if (is_array($needle)) {
            foreach ($needle as $key) {
                if (!isset($array[$key])) {
                    throw new \InvalidArgumentException("Key [{$key}] was not set.");
                }
            }  
            return;          
        }
        
        if (is_string($needle)) {
            if (!isset($array[$needle])) {
                throw new \InvalidArgumentException("Key [{$needle}] was not set.");
            }
        }

    }
    
    /**
     * 判断一个变量是否不为null，判断原则为
     *  null   ：false
     *  空字符串：true
     *  其他    ：true
     * @param $name 变量的名字
     * @param $value 变量的值
     * @throws \InvalidArgumentException 如果$value为null时抛出
     */
    public static function assertNotNull($value, $name) {
        if (!isset($value)) {
            throw new \InvalidArgumentException("'{$name}' cannot be null.");
        }
    }
    
    /**
     * 判断一个变量是否不为空，判断原则为：
     *  null   ：false
     *  空字符串：false
     *  其他    ：true
     * @param $name 变量的名字
     * @param $value 变量的值
     * @throws \InvalidArgumentException 如果$value为空值时抛出
     */
    public static function assertNotEmpty($value, $name) {
        if (empty($value)) {
            throw new \InvalidArgumentException("[{$name}] cannot be empty.");
        }
    }
    
    /**
     * 判断一个变量是否为字符串
     * @param $name 变量的名字
     * @param $value 变量的值
     * @throws \InvalidArgumentException 如果$value不为string时抛出
     */
    public static function assertString($value, $name) {
        if (!is_string($value)) {
            throw new \InvalidArgumentException("[{$name}] must be string.");
        }
    }

    /**
     * 判断是否为数字
     * @param $value 变量的值
     * @param $name 变量的名字
     * @throws \InvalidArgumentException
     */
    public static function assertNumber($value, $name) {
        if (!is_numeric($value)) {
            throw new \InvalidArgumentException("[{$name}] must be a number.");
        }
    }

    public static function assertArray($value, $name) {
        if (!is_array($value)) {
            throw new \InvalidArgumentException("[{$name}] must be array.");
        }
    }
    
    public static function makeError($msg) {
        echo 'Error: '.$msg;
        die();
    }
    
}
