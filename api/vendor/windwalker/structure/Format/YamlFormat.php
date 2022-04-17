<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Structure\Format;

use Symfony\Component\Yaml\Dumper as SymfonyYamlDumper;
use Symfony\Component\Yaml\Parser as SymfonyYamlParser;
use Windwalker\Structure\StructureHelper;

/**
 * YAML format handler for Structure.
 *
 * @since  2.0
 */
class YamlFormat implements FormatInterface
{
    /**
     * The YAML parser class.
     *
     * @var  \Symfony\Component\Yaml\Parser;
     */
    protected static $parser;

    /**
     * The YAML dumper class.
     *
     * @var  \Symfony\Component\Yaml\Dumper;
     */
    protected static $dumper;

    /**
     * Converts an object into a YAML formatted string.
     * We use json_* to convert the passed object to an array.
     *
     * @param   object $struct  Data source object.
     * @param   array  $options Options used by the formatter.
     *
     * @return  string  YAML formatted string.
     *
     * @since   2.0
     */
    public static function structToString($struct, array $options = [])
    {
        $inline = StructureHelper::getValue($options, 'inline', 2);
        $indent = StructureHelper::getValue($options, 'indent', 0);

        return static::getDumper()->dump($struct, $inline, $indent);
    }

    /**
     * Parse a YAML formatted string and convert it into an object.
     * We use the json_* methods to convert the parsed YAML array to an object.
     *
     * @param   string $data    YAML formatted string to convert.
     * @param   array  $options Options used by the formatter.
     *
     * @return  object  Data object.
     *
     * @since   2.0
     */
    public static function stringToStruct($data, array $options = [])
    {
        return static::getParser()->parse(trim($data));
    }

    /**
     * getParser
     *
     * @return  \Symfony\Component\Yaml\Parser
     */
    public static function getParser()
    {
        if (!static::$parser) {
            static::$parser = new SymfonyYamlParser();
        }

        return static::$parser;
    }

    /**
     * setParser
     *
     * @param   \Symfony\Component\Yaml\Parser $parser
     *
     * @return  YamlFormat  Return self to support chaining.
     */
    public static function setParser($parser)
    {
        static::$parser = $parser;
    }

    /**
     * getDumper
     *
     * @return  \Symfony\Component\Yaml\Dumper
     */
    public static function getDumper()
    {
        if (!static::$dumper) {
            static::$dumper = new SymfonyYamlDumper();
        }

        return static::$dumper;
    }

    /**
     * setDumper
     *
     * @param   \Symfony\Component\Yaml\Dumper $dumper
     *
     * @return  YamlFormat  Return self to support chaining.
     */
    public static function setDumper($dumper)
    {
        static::$dumper = $dumper;
    }
}
