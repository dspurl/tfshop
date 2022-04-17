<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */

namespace Aliyun\OSS\Models;

/**
 *
 * 表示OSS的访问控制策略。
 *
 * @package Aliyun\OSS\Models
 */
class AccessControlPolicy {
    /**
     * @var Owner
     */
    private $owner;

    /**
     * @var array
     */
    private $grants;

    /**
     * @internal
     * @param array $grants
     */
    public function setGrants($grants) {
        $this->grants = $grants;
    }

    /**
     * 获取授权列表
     *
     * @return array
     */
    public function getGrants() {
        return $this->grants;
    }

    /**
     * @internal
     * @param \Aliyun\OSS\Models\Owner $owner
     */
    public function setOwner($owner) {
        $this->owner = $owner;
    }

    /**
     * 获取所有者
     *
     * @return \Aliyun\OSS\Models\Owner
     */
    public function getOwner() {
        return $this->owner;
    }
}
