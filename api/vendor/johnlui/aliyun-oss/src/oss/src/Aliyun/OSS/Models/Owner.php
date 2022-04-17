<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Models;

/**
 * 表示拥有者
 * @package Aliyun\OSS\Models
 */
class Owner {

    /**
     * @var string
     */
    private $displayName;

    /**
     * @var string
     */
    private $id;

    /**
     * @internal
     * @param $displayName
     */
    public function setDisplayName($displayName) {
        $this->displayName = $displayName;
    }

    /**
     * 获取显示名称
     *
     * @return string
     */
    public function getDisplayName() {
        return $this->displayName;
    }

    /**
     * @internal
     * @param $id
     */
    public function setId($id) {
        $this->id = $id;
    }

    /**
     * 获取用户的Id
     *
     * @return string
     */
    public function getId() {
        return $this->id;
    }
}