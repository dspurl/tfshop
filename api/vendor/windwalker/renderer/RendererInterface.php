<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Renderer;

/**
 * Interface RendererInterface
 */
interface RendererInterface
{
    /**
     * render
     *
     * @param string $file
     * @param array  $data
     *
     * @return  string
     */
    public function render($file, $data = []);

    /**
     * Method to escape output.
     *
     * @param   string $output The output to escape.
     *
     * @return  string  The escaped output.
     */
    public function escape($output);
}
