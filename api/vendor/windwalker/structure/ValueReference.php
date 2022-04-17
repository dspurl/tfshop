<?php declare(strict_types=1);
/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2019 $Asikart.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Structure;

/**
 * The ValueReference class.
 *
 * @since  3.5.1
 */
class ValueReference
{
    /**
     * Property path.
     *
     * @var  string
     */
    protected $path;

    /**
     * Property separator.
     *
     * @var  string
     */
    protected $separator;

    /**
     * ValueReference constructor.
     *
     * @param string $path
     * @param string $separator
     */
    public function __construct(string $path, ?string $separator = null)
    {
        $this->path = $path;
        $this->separator = $separator;
    }

    /**
     * Get from Structure.
     *
     * @param Structure|array|object $structure
     * @param mixed                  $default
     *
     * @return  mixed
     *
     * @since  3.5.1
     */
    public function get($structure, $default = null)
    {
        if ($structure instanceof Structure) {
            return $structure->get($this->path, $default, $this->separator);
        }

        return StructureHelper::getByPath($structure, $this->path, $this->separator ?: '.');
    }

    /**
     * Method to get property Path
     *
     * @return  string
     *
     * @since  3.5.1
     */
    public function getPath(): string
    {
        return $this->path;
    }

    /**
     * Method to set property path
     *
     * @param   string $path
     *
     * @return  static  Return self to support chaining.
     *
     * @since  3.5.1
     */
    public function setPath(string $path)
    {
        $this->path = $path;

        return $this;
    }

    /**
     * Method to get property Separator
     *
     * @return  string
     *
     * @since  3.5.1
     */
    public function getSeparator(): string
    {
        return $this->separator;
    }

    /**
     * Method to set property separator
     *
     * @param   string $separator
     *
     * @return  static  Return self to support chaining.
     *
     * @since  3.5.1
     */
    public function setSeparator(string $separator)
    {
        $this->separator = $separator;

        return $this;
    }
}
