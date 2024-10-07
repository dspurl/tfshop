<?php

namespace AlibabaCloud\Client\Support;

/**
 * Class Stringy
 *
 * @package AlibabaCloud\Client\Support
 */
class Stringy
{

    private static function _value($value, $default = '')
    {
        return null === $value ? $default : $value;
    }

    /**
     * @param string $str
     * @param string $substr
     *
     * @return bool
     */
    public static function contains($str, $substr)
    {
        return false !== strpos(self::_value($str), self::_value($substr));
    }

    /**
     * @param string $str
     * @param string $substr
     *
     * @return bool
     */
    public static function endsWith($str, $substr)
    {
        $str      = self::_value($str);
        $substr = self::_value($substr);
        $length = \strlen($substr);
        if (!$length) {
            return true;
        }

        return substr($str, -$length) === $substr;
    }

}
