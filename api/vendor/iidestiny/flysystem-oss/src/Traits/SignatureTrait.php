<?php

/*
 * This file is part of the iidestiny/flysystem-oss.
 *
 * (c) iidestiny <iidestiny@vip.qq.com>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Iidestiny\Flysystem\Oss\Traits;

use DateTime;

trait SignatureTrait
{
    /**
     * gmt.
     *
     * @param $time
     *
     * @return string
     *
     * @throws \Exception
     */
    public function gmt_iso8601($time)
    {
        $dtStr = date('c', $time);
        $myDatetime = new DateTime($dtStr);
        $expiration = $myDatetime->format(DateTime::ISO8601);
        $pos = strpos($expiration, '+');
        $expiration = substr($expiration, 0, $pos);

        return $expiration.'Z';
    }
}
