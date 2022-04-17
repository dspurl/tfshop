<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    GNU General Public License version 2 or later;
 */

namespace Windwalker\Renderer\Edge;

use Windwalker\Edge\Extension\EdgeExtensionInterface;

/**
 * The GlobalContainer class.
 *
 * @since  3.0
 */
abstract class GlobalContainer
{
    /**
     * Property extensions.
     *
     * @var  EdgeExtensionInterface[]
     */
    protected static $extensions = [];

    /**
     * Property compilers.
     *
     * @var  array
     */
    protected static $globals = [];

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
     * addExtension
     *
     * @param EdgeExtensionInterface $extension
     * @param string                 $name
     *
     * @return  void
     */
    public static function addExtension(EdgeExtensionInterface $extension, $name = null)
    {
        static::$extensions[$name ?: $extension->getName()] = $extension;
    }

    /**
     * getExtension
     *
     * @param   string $name
     *
     * @return  \Twig_ExtensionInterface
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
     * @return  EdgeExtensionInterface[]
     */
    public static function getExtensions()
    {
        return static::$extensions;
    }

    /**
     * Method to set property extensions
     *
     * @param   EdgeExtensionInterface[] $extensions
     *
     * @return  void
     */
    public static function setExtensions(array $extensions)
    {
        static::$extensions = $extensions;
    }

    /**
     * setGlobal
     *
     * @param string $name
     * @param mixed  $value
     *
     * @return  void
     */
    public static function addGlobal($name, $value)
    {
        static::$globals[$name] = $value;
    }

    /**
     * getGlobal
     *
     * @param string $name
     *
     * @return  mixed
     */
    public static function getGlobal($name)
    {
        if (array_key_exists($name, static::$globals)) {
            return static::$globals[$name];
        }

        return null;
    }

    /**
     * removeGlobal
     *
     * @param   string $name
     *
     * @return  void
     */
    public static function removeGlobal($name)
    {
        if (isset(static::$globals[$name])) {
            unset(static::$globals[$name]);
        }
    }

    /**
     * Method to get property Globals
     *
     * @return  array
     */
    public static function getGlobals()
    {
        return static::$globals;
    }

    /**
     * Method to set property globals
     *
     * @param   array $globals
     *
     * @return  void
     */
    public static function setGlobals(array $globals)
    {
        static::$globals = $globals;
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
