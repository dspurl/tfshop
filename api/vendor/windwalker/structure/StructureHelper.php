<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Structure;

/**
 * Class StructureHelper
 *
 * @since 2.0
 */
class StructureHelper
{
    /**
     * Property objectStorage.
     *
     * @var  \SplObjectStorage
     */
    private static $objectStorage;

    /**
     * Load the contents of a file into the structure
     *
     * @param   string $file    Path to file to load
     * @param   string $format  Format of the file [optional: defaults to JSON]
     * @param   array  $options Options used by the formatter
     *
     * @return  array  Return parsed array.
     *
     * @since   2.1
     */
    public static function loadFile($file, $format = Format::JSON, $options = [])
    {
        if (!is_file($file)) {
            throw new \InvalidArgumentException('No such file: ' . $file);
        }

        if (strtolower($format) == Format::PHP) {
            $data = include $file;
        } else {
            $data = file_get_contents($file);
        }

        return static::loadString($data, $format, $options);
    }

    /**
     * Load a string into the structure
     *
     * @param   string $data    String to load into the structure
     * @param   string $format  Format of the string
     * @param   array  $options Options used by the formatter
     *
     * @return  array  Return parsed array.
     *
     * @since   2.1
     */
    public static function loadString($data, $format = Format::JSON, $options = [])
    {
        // Load a string into the given namespace [or default namespace if not given]
        $class = static::getFormatClass($format);

        return $class::stringToStruct($data, $options);
    }

    /**
     * Get a namespace in a given string format
     *
     * @param   array|object $data    The structure data to convert to markup string.
     * @param   string       $format  Format to return the string in
     * @param   mixed        $options Parameters used by the formatter, see formatters for more info
     *
     * @return  string  Namespace in string format
     *
     * @since   2.1
     */
    public static function toString($data, $format = Format::JSON, $options = [])
    {
        $class = static::getFormatClass($format);

        return $class::structToString($data, $options);
    }

    /**
     * getFormatClass
     *
     * @param string $format
     *
     * @return  string|\Windwalker\Structure\Format\FormatInterface
     *
     * @throws  \DomainException
     *
     * @since   2.1
     */
    public static function getFormatClass($format)
    {
        // Return a namespace in a given format
        $class = sprintf('%s\Format\%sFormat', __NAMESPACE__, ucfirst(strtolower($format)));

        if (!class_exists($class)) {
            throw new \DomainException(
                sprintf(
                    'Structure format: %s not supported. Class: %s not found.',
                    $format,
                    $class
                )
            );
        }

        return $class;
    }

    /**
     * Method to determine if an array is an associative array.
     *
     * @param   array $array An array to test.
     *
     * @return  boolean  True if the array is an associative array.
     */
    public static function isAssociativeArray($array)
    {
        if (is_array($array)) {
            foreach (array_keys($array) as $k => $v) {
                if ($k !== $v) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * getValue
     *
     * @param array  $array
     * @param string $name
     * @param mixed  $default
     *
     * @return  mixed
     */
    public static function getValue(array $array, $name, $default = null)
    {
        return isset($array[$name]) ? $array[$name] : $default;
    }

    /**
     * Utility function to map an array to a stdClass object.
     *
     * @param   array  $array The array to map.
     * @param   string $class Name of the class to create
     *
     * @return  object   The object mapped from the given array
     *
     * @since   2.0
     */
    public static function toObject($array, $class = 'stdClass')
    {
        $object = new $class();

        foreach ($array as $k => $v) {
            if (is_array($v)) {
                $object->$k = static::toObject($v, $class);
            } else {
                $object->$k = $v;
            }
        }

        return $object;
    }

    /**
     * Get data from array or object by path.
     *
     * Example: `StructureHelper::getByPath($array, 'foo.bar.yoo')` equals to $array['foo']['bar']['yoo'].
     *
     * @param mixed  $data      An array or object to get value.
     * @param mixed  $path      The key path.
     * @param string $separator Separator of paths.
     *
     * @return  mixed Found value, null if not exists.
     *
     * @since   2.1
     */
    public static function getByPath(array $data, $path, $separator = '.')
    {
        $nodes = static::getPathNodes($path, $separator);

        if (empty($nodes)) {
            return null;
        }

        $dataTmp = $data;

        foreach ($nodes as $arg) {
            if (is_object($dataTmp) && isset($dataTmp->$arg)) {
                $dataTmp = $dataTmp->$arg;
            } elseif ($dataTmp instanceof \ArrayAccess && isset($dataTmp[$arg])) {
                $dataTmp = $dataTmp[$arg];
            } elseif (is_array($dataTmp) && isset($dataTmp[$arg])) {
                $dataTmp = $dataTmp[$arg];
            } else {
                return null;
            }
        }

        return $dataTmp;
    }

    /**
     * setByPath
     *
     * @param mixed  &$data
     * @param string $path
     * @param mixed  $value
     * @param string $separator
     *
     * @return  boolean
     *
     * @since   2.1
     */
    public static function setByPath(array &$data, $path, $value, $separator = '.')
    {
        $nodes = static::getPathNodes($path, $separator);

        if (empty($nodes)) {
            return false;
        }

        $dataTmp = &$data;

        foreach ($nodes as $node) {
            if (is_array($dataTmp)) {
                if (!isset($dataTmp[$node])) {
                    $dataTmp[$node] = [];
                }

                $dataTmp = &$dataTmp[$node];
            } else {
                // If a node is value but path is not go to the end, we replace this value as a new store.
                // Then next node can insert new value to this store.
                $dataTmp = [];
            }
        }

        // Now, path go to the end, means we get latest node, set value to this node.
        $dataTmp = $value;

        return true;
    }

    /**
     * removeByPath
     *
     * @param array  $data
     * @param string $path
     * @param string $separator
     *
     * @return  bool
     */
    public static function removeByPath(array &$data, $path, $separator = '.')
    {
        $nodes = static::getPathNodes($path, $separator);

        if (empty($nodes)) {
            return false;
        }

        $previous = null;
        $dataTmp = &$data;

        foreach ($nodes as $node) {
            if (is_array($dataTmp)) {
                if (empty($dataTmp[$node])) {
                    return false;
                }

                $previous = &$dataTmp;
                $dataTmp = &$dataTmp[$node];
            } else {
                return false;
            }
        }

        // Now, path go to the end, means we get latest node, set value to this node.
        unset($previous[$node]);

        return true;
    }

    /**
     * Explode the structure path into an array and remove empty
     * nodes that occur as a result of a double dot. ex: windwalker..test
     * Finally, re-key the array so they are sequential.
     *
     * @param string $path
     * @param string $separator
     *
     * @return  array
     */
    public static function getPathNodes($path, $separator = '.')
    {
        return array_values(array_filter(explode($separator, $path), 'strlen'));
    }

    /**
     * Method to recursively convert data to one dimension array.
     *
     * @param   array|object $array     The array or object to convert.
     * @param   string       $separator The key separator.
     * @param   string       $prefix    Last level key prefix.
     *
     * @return  array
     */
    public static function flatten($array, $separator = '.', $prefix = '')
    {
        $return = [];

        if ($array instanceof \Traversable) {
            $array = iterator_to_array($array);
        } elseif (is_object($array)) {
            $array = get_object_vars($array);
        }

        foreach ($array as $k => $v) {
            $key = $prefix ? $prefix . $separator . $k : $k;

            if (is_object($v) || is_array($v)) {
                $return = array_merge($return, static::flatten($v, $separator, $key));
            } else {
                $return[$key] = $v;
            }
        }

        return $return;
    }

    /**
     * Utility function to convert all types to an array.
     *
     * @param   mixed $data      The data to convert.
     * @param   bool  $recursive Recursive if data is nested.
     *
     * @return  array  The converted array.
     */
    public static function toArray($data, $recursive = false)
    {
        if ($data instanceof ValueReference) {
            return $data;
        }

        // Ensure the input data is an array.
        if ($data instanceof \Traversable) {
            $data = iterator_to_array($data);
        } elseif (is_object($data)) {
            $data = get_object_vars($data);
        } else {
            $data = (array) $data;
        }

        if ($recursive) {
            foreach ($data as &$value) {
                if (is_array($value) || is_object($value)) {
                    $value = static::toArray($value, $recursive);
                }
            }
        }

        return $data;
    }

    /**
     * dumpObjectValues
     *
     * @param   mixed $object
     *
     * @return  array
     */
    public static function dumpObjectValues($object)
    {
        $data = [];

        static::$objectStorage = new \SplObjectStorage();

        static::doDump($data, $object);

        return $data;
    }

    /**
     * doDump
     *
     * @param   array $data
     * @param   mixed $object
     *
     * @return  void
     */
    private static function doDump(&$data, $object)
    {
        if (is_object($object) && static::$objectStorage->contains($object)) {
            $data = null;

            return;
        }

        if (is_object($object)) {
            static::$objectStorage->attach($object);
        }

        if (is_array($object) || $object instanceof \Traversable) {
            foreach ($object as $key => $value) {
                static::doDump($data[$key], $value);
            }
        } elseif (is_object($object)) {
            $ref = new \ReflectionObject($object);

            $properties = $ref->getProperties();

            foreach ($properties as $property) {
                $property->setAccessible(true);

                $value = $property->getValue($object);

                static::doDump($data[$property->getName()], $value);
            }
        } else {
            $data = $object;
        }
    }
}
