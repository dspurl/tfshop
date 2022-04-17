<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    GNU General Public License version 2 or later;
 */

namespace Windwalker\Renderer\Twig;

/**
 * The TwigFilesystemLoader class.
 *
 * @since  2.1.1
 */
class TwigFilesystemLoader extends \Twig_Loader_Filesystem
{
    /**
     * Property separator.
     *
     * @var  string
     */
    protected $separator;

    /**
     * TwigFilesystemLoader constructor.
     *
     * @param array|string $paths
     * @param string       $separator
     */
    public function __construct($paths, $separator = '.')
    {
        $this->separator = $separator;

        parent::__construct($paths);
    }

    /**
     * Method to get property Separator
     *
     * @return  string
     */
    public function getSeparator()
    {
        return $this->separator;
    }

    /**
     * Method to set property separator
     *
     * @param   string $separator
     *
     * @return  static  Return self to support chaining.
     */
    public function setSeparator($separator)
    {
        $this->separator = $separator;

        return $this;
    }

    /**
     * normalizeName
     *
     * @param   string $name
     *
     * @return  string
     */
    protected function normalizeName($name)
    {
        $ext = pathinfo($name, PATHINFO_EXTENSION);

        if ($ext === 'twig') {
            $name = substr($name, 0, -5);
        }

        $path = preg_replace('#/{2,}#', '/', str_replace($this->separator, '/', $name));

        return $path . '.twig';
    }

    /**
     * Adds a path where templates are stored.
     *
     * @param string $path      A path where to look for templates
     * @param string $namespace A path name
     */
    public function addPath($path, $namespace = self::MAIN_NAMESPACE)
    {
        // invalidate the cache
        $this->cache = [];

        $this->paths[$namespace][] = rtrim($path, '/\\');
    }
}
