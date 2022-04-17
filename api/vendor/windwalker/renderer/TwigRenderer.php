<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Renderer;

use Windwalker\Renderer\Twig\GlobalContainer;
use Windwalker\Renderer\Twig\TwigFilesystemLoader;
use Windwalker\Structure\Structure;

/**
 * Class PhpRenderer
 *
 * @since 2.0
 */
class TwigRenderer extends AbstractEngineRenderer
{
    /**
     * Property twig.
     *
     * @var  \Twig_Environment
     */
    protected $engine = null;

    /**
     * Property loader.
     *
     * @var  \Twig_LoaderInterface
     */
    protected $loader = null;

    /**
     * Property extensions.
     *
     * @var  \Twig_ExtensionInterface[]
     */
    protected $extensions = [];

    /**
     * Property config.
     *
     * @var  Structure|array
     */
    protected $config = [];

    /**
     * Property debugExtension.
     *
     * @var  \Twig_Extension_Debug
     */
    protected $debugExtension = null;

    /**
     * render
     *
     * @param string       $file
     * @param array|object $data
     *
     * @throws  \UnexpectedValueException
     * @return  string
     */
    public function render($file, $data = [])
    {
        $file = pathinfo($file, PATHINFO_EXTENSION) === 'twig' ? $file : $file . '.twig';

        $this->extensions = array_merge($this->extensions, (array) $this->config->get('extensions', []));

        return $this->getEngine()->render($file, $data);
    }

    /**
     * getLoader
     *
     * @return  \Twig_LoaderInterface
     */
    public function getLoader()
    {
        if (!$this->loader) {
            if ($this->config->get('path_separator')) {
                $this->loader = new TwigFilesystemLoader(
                    iterator_to_array(clone $this->getPaths()),
                    $this->config->get('path_separator')
                );
            } else {
                $this->loader = new \Twig_Loader_Filesystem(iterator_to_array(clone $this->getPaths()));
            }
        }

        return $this->loader;
    }

    /**
     * setLoader
     *
     * @param   \Twig_LoaderInterface $loader
     *
     * @return  TwigRenderer  Return self to support chaining.
     */
    public function setLoader(\Twig_LoaderInterface $loader)
    {
        $this->loader = $loader;

        return $this;
    }

    /**
     * addExtension
     *
     * @param \Twig_ExtensionInterface $extension
     *
     * @return  static
     */
    public function addExtension(\Twig_ExtensionInterface $extension)
    {
        $this->extensions[] = $extension;

        return $this;
    }

    /**
     * getTwig
     *
     * @param bool $new
     *
     * @return  \Twig_Environment
     */
    public function getEngine($new = false)
    {
        if (!($this->engine instanceof \Twig_Environment) || $new) {
            $this->engine = new \Twig_Environment($this->getLoader(), $this->config->toArray());

            foreach (GlobalContainer::getExtensions() as $extension) {
                $this->engine->addExtension(clone $extension);
            }

            foreach ($this->extensions as $extension) {
                $this->engine->addExtension($extension);
            }

            foreach (GlobalContainer::getGlobals() as $name => $value) {
                $this->engine->addGlobal($name, $value);
            }

            if ($this->config->get('debug')) {
                $this->engine->addExtension($this->getDebugExtension());
            }
        }

        return $this->engine;
    }

    /**
     * setTwig
     *
     * @param   \Twig_Environment $twig
     *
     * @return  TwigRenderer  Return self to support chaining.
     */
    public function setEngine($twig)
    {
        if (!($twig instanceof \Twig_Environment)) {
            throw new \InvalidArgumentException('Engine object should be Twig_environment');
        }

        $this->engine = $twig;

        return $this;
    }

    /**
     * Method to get property DebugExtension
     *
     * @return  \Twig_Extension_Debug
     */
    public function getDebugExtension()
    {
        if (!$this->debugExtension) {
            $this->debugExtension = new \Twig_Extension_Debug();
        }

        return $this->debugExtension;
    }

    /**
     * Method to set property debugExtension
     *
     * @param   \Twig_ExtensionInterface $debugExtension
     *
     * @return  static  Return self to support chaining.
     */
    public function setDebugExtension(\Twig_ExtensionInterface $debugExtension)
    {
        $this->debugExtension = $debugExtension;

        return $this;
    }

    /**
     * Method to get property Extensions
     *
     * @return  \Twig_ExtensionInterface[]
     */
    public function getExtensions()
    {
        return $this->extensions;
    }

    /**
     * Method to set property extensions
     *
     * @param   \Twig_ExtensionInterface[] $extensions Twig extenions
     *
     * @return  static  Return self to support chaining.
     */
    public function setExtensions($extensions)
    {
        $this->extensions = $extensions;

        return $this;
    }
}
