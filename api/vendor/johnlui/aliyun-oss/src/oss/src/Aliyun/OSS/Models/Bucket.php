<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */

namespace Aliyun\OSS\Models;

use Aliyun\Common\Utilities\AssertUtils;

/**
 * Bucket是OSS上的命名空间。
 * <p>
 * Bucket名在整个 OSS 中具有全局唯一性，且不能修改；存储在OSS上的每个Object必须都包含在某个Bucket中。
 * 一个应用，例如图片分享网站，可以对应一个或多个 Bucket。一个用户最多可创建 10 个Bucket，
 * 但每个Bucket 中存放的Object的数量和大小总和没有限制，用户不需要考虑数据的可扩展性。
 * </p>
 * <p>
 * Bucket 命名规范
 * <ul>
 *  <li>只能包括小写字母，数字和短横线（-）</li>
 *  <li>必须以小写字母或者数字开头</li>
 *  <li>长度必须在 3-63 字节之间</li>
 * </ul>
 * </p>
 *
 * @package Aliyun\OSS\Models
 */
class Bucket {
    /**
     * Buket的名字
     * @var string
     */
    private $name;
    
    /**
     * Bucket的所有者
     * @var string
     */
    private $owner;
    
    /**
     * Bucket的创建日期
     * @var \DateTime
     */
    private $creationDate;

    /**
     * @internal
     * @param $name
     */
    public function __construct($name) {
        $this->setName($name);
    }

    /**
     * 获取Bucket的名字
     *
     * @return string
     */
    public function getName() {
        return $this->name;
    }
    
    /**
     * 设置Bucket的名字
     *
     * @internal
     *
     * @param string $name Bucket的名字
     */
    public function setName($name) {
        AssertUtils::assertString($name, 'name');
        $this->name = $name;
    }
    
    /**
     * 获取Bucket的所有者
     *
     * @return Owner Bucket的所有者
     */
    public function getOwner() {
        return $this->owner;
    }
    
    /**
     * 设置Bucket的所有者
     *
     * @internal
     *
     * @param string $owner Bucket的所有者
     */
    public function setOwner($owner) {
        $this->owner = $owner;
    }
    
    /**
     * 返回Bucket的创建时间
     *
     * @return \DateTime Bucket的创建时间
     */
    public function getCreationDate() {
        return $this->creationDate;
    }
    
    /**
     * 设置Bucket创建的时间
     *
     * @internal
     *
     * @param \DateTime $creationDate Bucket创建的时间
     */
    public function setCreationDate(\DateTime $creationDate) {
        $this->creationDate = $creationDate;
    }
}
