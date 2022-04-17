<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Renderer\Twig;

/**
 * The GlobalContainer class.
 *
 * @since  2.0
 */
abstract class GlobalContainer
{
    /**
     * Property extensions.
     *
     * @var  \Twig_ExtensionInterface[]
     */
    protected static $extensions = [];

    /**
     * Property data.
     *
     * @var  array
     */
    protected static $globals = [];

    /**
     * addExtension
     *
     * @param string                   $name
     * @param \Twig_ExtensionInterface $extension
     *
     * @return  void
     */
    public static function addExtension($name, \Twig_ExtensionInterface $extension)
    {
        static::$extensions[$name] = $extension;
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
     * @return  \Twig_ExtensionInterface[]
     */
    public static function getExtensions()
    {
        return static::$extensions;
    }

    /**
     * Method to set property extensions
     *
     * @param   \Twig_ExtensionInterface[] $extensions
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
}
