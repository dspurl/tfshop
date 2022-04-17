<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    GNU General Public License version 2 or later;
 */

namespace Windwalker\Renderer\Blade;

/**
 * The GlobalContainer class.
 *
 * @since  2.1.1
 */
abstract class GlobalContainer
{
    /**
     * Property compilers.
     *
     * @var  callable[]
     */
    protected static $compilers = [];

    /**
     * Property extensions.
     *
     * @var  array
     */
    protected static $extensions = [];

    /**
     * Property cachePath.
     *
     * @var  string
     */
    protected static $cachePath;

    /**
     * Array of opening and closing tags for raw echos.
     *
     * @var array
     */
    protected static $rawTags = [];

    /**
     * Array of opening and closing tags for regular echos.
     *
     * @var array
     */
    protected static $contentTags = [];

    /**
     * Array of opening and closing tags for escaped echos.
     *
     * @var array
     */
    protected static $escapedTags = [];

    /**
     * addCompiler
     *
     * @param string   $name
     * @param callable $compiler
     *
     * @return  void
     */
    public static function addCompiler($name, $compiler)
    {
        if (!is_callable($compiler)) {
            throw new \InvalidArgumentException('Compiler should be callable.');
        }

        static::$compilers[$name] = $compiler;
    }

    /**
     * getCompiler
     *
     * @param   string $name
     *
     * @return  callable
     */
    public static function getCompiler($name)
    {
        if (!empty(static::$compilers[$name])) {
            return static::$compilers[$name];
        }

        return null;
    }

    /**
     * removeCompiler
     *
     * @param string $name
     *
     * @return  void
     */
    public static function removeCompiler($name)
    {
        if (isset(static::$compilers[$name])) {
            unset(static::$compilers[$name]);
        }
    }

    /**
     * Method to get property Compilers
     *
     * @return  callable[]
     */
    public static function getCompilers()
    {
        return static::$compilers;
    }

    /**
     * Method to set property extensions
     *
     * @param   callable[] $compilers
     *
     * @return  void
     */
    public static function setCompilers(array $compilers)
    {
        static::$compilers = $compilers;
    }

    /**
     * addExtension
     *
     * @param string   $name
     * @param callable $extension
     *
     * @return  void
     */
    public static function addExtension($name, $extension)
    {
        if (!is_callable($extension)) {
            throw new \InvalidArgumentException('Extension should be callable.');
        }

        static::$extensions[$name] = $extension;
    }

    /**
     * getExtension
     *
     * @param   string $name
     *
     * @return  callable
     */
    public static function getExtension($name)
    {
        if (!empty(static::$extensions[$name])) {
            return static::$extensions[$name];
        }

        return null;
    }

    /**
     * removeExtension
     *
     * @param string $name
     *
     * @return  void
     */
    public static function removeExtension($name)
    {
        if (isset(static::$extensions[$name])) {
            unset(static::$extensions[$name]);
        }
    }

    /**
     * Method to get property Extensions
     *
     * @return  array
     */
    public static function getExtensions()
    {
        return static::$extensions;
    }

    /**
     * Method to set property extensions
     *
     * @param   array $extensions
     *
     * @return  void
     */
    public static function setExtensions($extensions)
    {
        static::$extensions = $extensions;
    }

    /**
     * Method to get property CachePath
     *
     * @return  string
     */
    public static function getCachePath()
    {
        return static::$cachePath;
    }

    /**
     * Method to set property cachePath
     *
     * @param   string $cachePath
     *
     * @return  void
     */
    public static function setCachePath($cachePath)
    {
        static::$cachePath = $cachePath;
    }

    /**
     * Method to get property RawTags
     *
     * @return  array
     */
    public static function getRawTags()
    {
        return static::$rawTags;
    }

    /**
     * Method to set property rawTags
     *
     * @param string $start
     * @param string $end
     */
    public static function setRawTags($start, $end)
    {
        static::$rawTags = [$start, $end];
    }

    /**
     * Method to get property ContentTags
     *
     * @return  array
     */
    public static function getContentTags()
    {
        return static::$contentTags;
    }

    /**
     * Method to set property contentTags
     *
     * @param string $start
     * @param string $end
     */
    public static function setContentTags($start, $end)
    {
        static::$contentTags = [$start, $end];
    }

    /**
     * Method to get property EscapedTags
     *
     * @return  array
     */
    public static function getEscapedTags()
    {
        return static::$escapedTags;
    }

    /**
     * Method to set property escapedTags
     *
     * @param string $start
     * @param string $end
     */
    public static function setEscapedTags($start, $end)
    {
        static::$escapedTags = [$start, $end];
    }
}
