<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Structure\Format;

/**
 * Class StructureFormatInterface
 *
 * @since 2.0
 */
interface FormatInterface
{
    /**
     * Converts an object into a formatted string.
     *
     * @param   object $struct  Data Source Object.
     * @param   array  $options An array of options for the formatter.
     *
     * @return  string  Formatted string.
     *
     * @since   2.0
     */
    public static function structToString($struct, array $options = []);

    /**
     * Converts a formatted string into an object.
     *
     * @param   string $data    Formatted string
     * @param   array  $options An array of options for the formatter.
     *
     * @return  object  Data Object
     *
     * @since   2.0
     */
    public static function stringToStruct($data, array $options = []);
}
