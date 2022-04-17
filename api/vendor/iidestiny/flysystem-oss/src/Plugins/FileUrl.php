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

class FileUrl extends AbstractPlugin
{
    /**
     * get file url.
     *
     * @return string
     */
    public function getMethod()
    {
        return 'getUrl';
    }

    /**
     * handle.
     *
     * @param $path
     *
     * @return mixed
     */
    public function handle($path)
    {
        return $this->filesystem->getAdapter()->getUrl($path);
    }
}
