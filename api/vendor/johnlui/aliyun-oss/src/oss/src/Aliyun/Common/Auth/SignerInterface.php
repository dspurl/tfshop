<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */

namespace Aliyun\Common\Auth;

use Aliyun\Common\Communication\HttpRequest;

interface SignerInterface {
    public function sign(HttpRequest $request, array $credentials);
}
