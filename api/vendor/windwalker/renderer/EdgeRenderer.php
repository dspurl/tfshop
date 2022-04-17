<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    GNU General Public License version 2 or later.
 */

namespace Windwalker\Renderer;

use Windwalker\Edge\Cache\EdgeArrayCache;
use Windwalker\Edge\Cache\EdgeCacheInterface;
use Windwalker\Edge\Cache\EdgeFileCache;
use Windwalker\Edge\Compiler\EdgeCompiler;
use Windwalker\Edge\Compiler\EdgeCompilerInterface;
use Windwalker\Edge\Edge;
use Windwalker\Edge\Exception\LayoutNotFoundException;
use Windwalker\Edge\Extension\EdgeExtensionInterface;
use Windwalker\Edge\Loader\EdgeFileLoader;
use Windwalker\Edge\Loader\EdgeLoaderInterface;
use Windwalker\Renderer\Edge\GlobalContainer;

/**
 * The EdgeRenderer class.
 *
 * @since  3.0
 */
class EdgeRenderer extends AbstractEngineRenderer
{
    /**
     * Property compiler.
     *
     * @var  EdgeCompilerInterface
     */
    protected $compiler;

    /**
     * Property loader.
     *
     * @var  EdgeLoaderInterface
     */
    protected $loader;

    /**
     * Property cache.
     *
     * @var  EdgeCacheInterface
     */
    protected $cache;

    /**
     * Property extensions.
     *
     * @var  callable[]
     */
    protected $extensions = [];

    /**
     * Method to get property Engine
     *
     * @param   boolean $new
     *
     * @return  Edge
     */
    public function getEngine($new = false)
    {
        if (!$this->engine || $new) {
            $this->loader = null;
            $this->compiler = null;
            $this->cache = null;

            $edge = new Edge($this->getLoader(), $this->getCompiler(), $this->getCache());

            foreach (GlobalContainer::getExtensions() as $name => $extension) {
                $edge->addExtension($extension, $name);
            }

            foreach ($this->getExtensions() as $name => $extension) {
                $edge->addExtension($extension, $name);
            }

            foreach (GlobalContainer::getGlobals() as $key => $value) {
                $edge->addGlobal($key, $value);
            }

            $this->engine = $edge;
        }

        return $this->engine;
    }

    /**
     * Method to set property engine
     *
     * @param   Edge $engine
     *
     * @return  static  Return self to support chaining.
     */
    public function setEngine($engine)
    {
        if ($this->engine && !$this->engine instanceof Edge) {
            throw new \InvalidArgumentException('Engine should be instance of Edge');
        }

        $this->engine = $engine;

        return $this;
    }

    /**
     * render
     *
     * @param string $file
     * @param array  $data
     *
     * @return  string
     * @throws \Windwalker\Edge\Exception\EdgeException
     */
    public function render($file, $data = [])
    {
        if ($data instanceof \Traversable) {
            $data = iterator_to_array($data);
        }

        if (is_object($data)) {
            $data = get_object_vars($data);
        }

        return $this->getEngine(true)->render($file, (array) $data);
    }

    /**
     * finFile
     *
     * @param string $file
     * @param string $ext
     *
     * @return  string
     */
    public function findFile($file, $ext = '')
    {
        try {
            return $this->getEngine()->getLoader()->find($file);
        } catch (LayoutNotFoundException $e) {
            return null;
        }
    }

    /**
     * Method to get property Compiler
     *
     * @return  EdgeCompilerInterface
     */
    public function getCompiler()
    {
        if (!$this->compiler) {
            $this->compiler = new EdgeCompiler();
        }

        return $this->compiler;
    }

    /**
     * Method to set property compiler
     *
     * @param   EdgeCompilerInterface $compiler
     *
     * @return  static  Return self to support chaining.
     */
    public function setCompiler($compiler)
    {
        $this->compiler = $compiler;

        return $this;
    }

    /**
     * Method to get property Loader
     *
     * @return  EdgeLoaderInterface
     */
    public function getLoader()
    {
        if (!$this->loader) {
            $this->loader = new EdgeFileLoader($this->dumpPaths());
        }

        return $this->loader;
    }

    /**
     * Method to set property loader
     *
     * @param   EdgeLoaderInterface $loader
     *
     * @return  static  Return self to support chaining.
     */
    public function setLoader($loader)
    {
        $this->loader = $loader;

        return $this;
    }

    /**
     * Method to get property Cache
     *
     * @return  EdgeCacheInterface
     */
    public function getCache()
    {
        if (!$this->cache) {
            if ($this->config->exists('cache_path')) {
                $this->cache = new EdgeFileCache($this->config->get('cache_path'));
            } else {
                $this->cache = new EdgeArrayCache();
            }
        }

        return $this->cache;
    }

    /**
     * Method to set property cache
     *
     * @param   EdgeCacheInterface $cache
     *
     * @return  static  Return self to support chaining.
     */
    public function setCache($cache)
    {
        $this->cache = $cache;

        return $this;
    }

    /**
     * Method to get property Extensions
     *
     * @return  EdgeExtensionInterface[]
     */
    public function getExtensions()
    {
        return $this->extensions;
    }

    /**
     * Method to set property extensions
     *
     * @param   EdgeExtensionInterface[] $extensions
     *
     * @return  static  Return self to support chaining.
     */
    public function setExtensions($extensions)
    {
        $this->extensions = $extensions;

        return $this;
    }

    /**
     * addExtension
     *
     * @param   EdgeExtensionInterface $extension
     * @param   string                 $name
     *
     * @return static
     */
    public function addExtension(EdgeExtensionInterface $extension, $name = null)
    {
        $this->extensions[$name ?: $extension->getName()] = $extension;

        return $this;
    }
}
