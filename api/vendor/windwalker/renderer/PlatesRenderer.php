<?php declare(strict_types=1);
/**
 * Part of windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Renderer;

use League\Plates\Engine as PlatesEngine;
use League\Plates\Extension\ExtensionInterface;

/**
 * The PlatesRenderer class.
 *
 * @since  2.0.9
 */
class PlatesRenderer extends AbstractEngineRenderer
{
    /**
     * Property extensions.
     *
     * @var  ExtensionInterface[]
     */
    protected $extensions = [];

    /**
     * Property folders.
     *
     * @var  array
     */
    protected $folders = [];

    /**
     * Method to get property Engine
     *
     * @param   boolean $new
     *
     * @return  PlatesEngine
     */
    public function getEngine($new = false)
    {
        if (!$this->engine || $new) {
            $this->engine = new PlatesEngine(
                dirname($this->config->get('path.found')),
                ltrim($this->config->get('extension', '.tpl'), '.')
            );

            foreach ($this->folders as $namespace => $folder) {
                $this->engine->addFolder($namespace, $folder['folder'], $folder['fallback']);
            }

            foreach ($this->extensions as $extension) {
                $this->engine->loadExtension($extension);
            }
        }

        return $this->engine;
    }

    /**
     * Method to set property engine
     *
     * @param   PlatesEngine $engine
     *
     * @return  static  Return self to support chaining.
     */
    public function setEngine($engine)
    {
        if (!($engine instanceof PlatesEngine)) {
            throw new \InvalidArgumentException('Engine object should be Mustache_Engine');
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
     */
    public function render($file, $data = [])
    {
        $path = $this->findFile($file);

        $this->config->set('path.found', $path);

        return $this->getEngine()->render($file, $data);
    }

    /**
     * findFile
     *
     * @param string $file
     * @param string $ext
     *
     * @return  string
     */
    public function findFile($file, $ext = '')
    {
        $ext = $ext ?: $this->config->get('extension', 'tpl');

        return parent::findFile($file, $ext);
    }

    /**
     * addExtension
     *
     * @param ExtensionInterface $extension
     *
     * @return  static
     */
    public function addExtension(ExtensionInterface $extension)
    {
        $this->extensions[] = $extension;

        return $this;
    }

    /**
     * addFolder
     *
     * @param   string  $namespace
     * @param   string  $folder
     * @param   boolean $fallback
     *
     * @return  static
     */
    public function addFolder($namespace, $folder, $fallback = false)
    {
        $this->folders[$namespace] = [
            'folder' => $folder,
            'fallback' => $fallback,
        ];

        return $this;
    }
}
