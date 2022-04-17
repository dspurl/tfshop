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

class SetBucket extends AbstractPlugin
{
    /**
     * sign url.
     *
     * @return string
     */
    public function getMethod()
    {
        return 'bucket';
    }

    /**
     * handle.
     *
     * @param       $path
     * @param       $timeout
     * @param array $options
     *
     * @return mixed
     */
    public function handle($bucket)
    {
        return $this->filesystem->getAdapter()->bucket($bucket);
    }
}
