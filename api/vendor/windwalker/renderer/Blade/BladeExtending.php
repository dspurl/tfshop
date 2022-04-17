<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    GNU General Public License version 2 or later.
 */

namespace Windwalker\Renderer\Blade;

use Illuminate\View\Compilers\BladeCompiler;

/**
 * The Extending class to support both Blade 4.* and 5.*.
 *
 * @since  2.1.1
 */
class BladeExtending
{
    /**
     * extend
     *
     * @param   BladeCompiler $blade
     * @param   string        $name
     * @param   callable      $closure
     *
     * @return  void
     */
    public static function extend(BladeCompiler $blade, $name, $closure)
    {
        // For 5.0 after
        if (is_callable([$blade, 'directive'])) {
            $blade->directive($name, $closure);

            return;
        }

        // For 4.x before
        $blade->extend(
            function ($view, BladeCompiler $compiler) use ($name, $closure) {
                $pattern = $compiler->createMatcher($name);

                return preg_replace_callback(
                    $pattern,
                    function ($matches) use ($closure) {
                        if (empty($matches[2])) {
                            return $matches[0];
                        }

                        return $matches[1] . $closure($matches[2]);
                    },
                    $view
                );
            }
        );

        return;
    }
}
