<?php
/**
 * FrontYAML
 *
 * @copyright Matthieu Napoli http://mnapoli.fr
 * @license   http://www.opensource.org/licenses/mit-license.php MIT (see the LICENSE file)
 */

namespace Mni\FrontYAML\Markdown;

/**
 * Interface of a Markdown parser
 *
 * @author Matthieu Napoli <matthieu@mnapoli.fr>
 */
interface MarkdownParser
{
    /**
     * Parses a Markdown string to HTML.
     *
     * @param string $markdown Markdown document.
     *
     * @return string HTML document.
     */
    public function parse($markdown);
}
