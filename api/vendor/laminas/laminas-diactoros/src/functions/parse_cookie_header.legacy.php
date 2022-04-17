<?php

declare(strict_types=1);

namespace Zend\Diactoros;

use function Laminas\Diactoros\parseCookieHeader as laminas_parseCookieHeader;

/**
 * @deprecated Use Laminas\Diactoros\parseCookieHeader instead
 */
function parseCookieHeader($cookieHeader) : array
{
    return laminas_parseCookieHeader(...func_get_args());
}
