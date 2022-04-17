<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */

namespace Aliyun\Common\Auth;

class HmacSHA1Signature extends ServiceSignature {
    public function getSignatureMethod() {
        return 'HmacSHA1';
    }
    
    public function getSignatureVersion() {
        return '1';
    }
    
    protected function computeSignatureCore($key, $data) {
        return base64_encode(hash_hmac('sha1', $data, $key, true));
    }
}
