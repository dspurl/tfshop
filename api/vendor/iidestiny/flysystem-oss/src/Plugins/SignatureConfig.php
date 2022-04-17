<?php

/*
 * This file is part of the iidestiny/flysystem-oss.
 *
 * (c) iidestiny <iidestiny@vip.qq.com>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Iidestiny\Flysystem\Oss\Plugins;

use League\Flysystem\Plugin\AbstractPlugin;

class SignatureConfig extends AbstractPlugin
{
    /**
     * sign url.
     *
     * @return string
     */
    public function getMethod()
    {
        return 'signatureConfig';
    }

    /**
     * handle.
     *
     * @param string $prefix
     * @param null   $callBackUrl
     * @param int    $expire
     * @param int    $contentLengthRangeValue
     *
     * @return mixed
     */
    public function handle($prefix = '', $callBackUrl = null, $expire = 30, $contentLengthRangeValue = 1048576000)
    {
        return $this->filesystem->getAdapter()->signatureConfig($prefix, $callBackUrl, $expire, $contentLengthRangeValue);
    }
}
