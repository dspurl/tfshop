<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Structure\Format;

use Windwalker\Structure\StructureHelper;

/**
 * INI format handler for Structure.
 *
 * @since  2.0
 */
class IniFormat implements FormatInterface
{
    /**
     * A cache used by stringToobject.
     *
     * @var  array
     */
    protected static $cache = [];

    /**
     * Converts an object into an INI formatted string
     * - Unfortunately, there is no way to have ini values nested further than two
     * levels deep.  Therefore we will only go through the first two levels of
     * the object.
     *
     * @param   object $struct  Data source object.
     * @param   array  $options Options used by the formatter.
     *
     * @return  string  INI formatted string.
     */
    public static function structToString($struct, array $options = [])
    {
        $local = [];
        $global = [];

        // Iterate over the object to set the properties.
        foreach ($struct as $key => $value) {
            // If the value is an object then we need to put it in a local section.
            if (is_array($value)) {
                if (!StructureHelper::isAssociativeArray($value)) {
                    continue;
                }

                // Add the section line.
                $local[] = '';
                $local[] = '[' . $key . ']';

                // Add the properties for this section.
                foreach ($value as $k => $v) {
                    if (is_numeric($k)) {
                        continue;
                    }

                    $local[] = $k . '=' . static::getValueAsINI($v);
                }
            } else {
                // Not in a section so add the property to the global array.
                $global[] = $key . '=' . static::getValueAsINI($value);
            }
        }

        return implode("\n", array_merge($global, $local));
    }

    /**
     * Parse an INI formatted string and convert it into an object.
     *
     * @param   string $data    INI formatted string to convert.
     * @param   array  $options An array of options used by the formatter, or a boolean setting to process sections.
     *
     * @return  object   Data object.
     */
    public static function stringToStruct($data, array $options = [])
    {
        $sections = (isset($options['processSections'])) ? $options['processSections'] : false;

        // Check the memory cache for already processed strings.
        $hash = md5($data . ':' . (int) $sections);

        if (isset(self::$cache[$hash])) {
            return self::$cache[$hash];
        }

        // If no lines present just return the object.
        if (empty($data)) {
            return new \stdClass();
        }

        $obj = new \stdClass();
        $section = false;
        $lines = explode("\n", $data);

        // Process the lines.
        foreach ($lines as $line) {
            // Trim any unnecessary whitespace.
            $line = trim($line);

            // Ignore empty lines and comments.
            if (empty($line) || (strpos($line, ';') === 0)) {
                continue;
            }

            if ($sections) {
                $length = strlen($line);

                // If we are processing sections and the line is a section add the object and continue.
                if ((strpos($line, '[') === 0) && ($line[$length - 1] === ']')) {
                    $section = substr($line, 1, $length - 2);
                    $obj->$section = new \stdClass();
                    continue;
                }
            } elseif (strpos($line, '[') === 0) {
                continue;
            }

            // Check that an equal sign exists and is not the first character of the line.
            if (!strpos($line, '=')) {
                // Maybe throw exception?
                continue;
            }

            // Get the key and value for the line.
            list ($key, $value) = explode('=', $line, 2);

            // If the value is quoted then we assume it is a string.
            $length = strlen($value);

            if ($length && ($value[0] === '"') && ($value[$length - 1] === '"')) {
                // Strip the quotes and Convert the new line characters.
                $value = stripcslashes(substr($value, 1, ($length - 2)));
                $value = str_replace('\n', "\n", $value);
            } else {
                // If the value is not quoted, we assume it is not a string.

                // If the value is 'false' assume boolean false.
                if ($value === 'false') {
                    $value = false;
                } elseif ($value === 'true') {
                    // If the value is 'true' assume boolean true.
                    $value = true;
                } elseif (is_numeric($value)) {
                    // If the value is numeric than it is either a float or int.
                    // If there is a period then we assume a float.
                    if (strpos($value, '.') !== false) {
                        $value = (float) $value;
                    } else {
                        $value = (int) $value;
                    }
                }
            }

            // If a section is set add the key/value to the section, otherwise top level.
            if ($section) {
                $obj->$section->$key = $value;
            } else {
                $obj->$key = $value;
            }
        }

        // Cache the string to save cpu cycles -- thus the world :)
        self::$cache[$hash] = clone ($obj);

        return $obj;
    }

    /**
     * Method to get a value in an INI format.
     *
     * @param   mixed $value The value to convert to INI format.
     *
     * @return  string  The value in INI format.
     */
    protected static function getValueAsINI($value)
    {
        $string = '';

        switch (gettype($value)) {
            case 'integer':
            case 'double':
                $string = $value;
                break;

            case 'boolean':
                $string = $value ? 'true' : 'false';
                break;

            case 'string':
                // Sanitize any CRLF characters..
                $string = '"' . str_replace(["\r\n", "\n"], '\\n', $value) . '"';
                break;
        }

        return $string;
    }
}
