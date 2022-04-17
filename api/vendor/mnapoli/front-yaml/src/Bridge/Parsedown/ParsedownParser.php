<?php
/**
 * FrontYAML
 *
 * @copyright Matthieu Napoli http://mnapoli.fr
 * @license   http://www.opensource.org/licenses/mit-license.php MIT (see the LICENSE file)
 */

namespace Mni\FrontYAML\Bridge\Parsedown;

use Mni\FrontYAML\Markdown\MarkdownParser;
use Parsedown;

/**
 * Bridge to the Parsedown Markdown parser
 *
 * @author Matthieu Napoli <matthieu@mnapoli.fr>
 */
class ParsedownParser implements MarkdownParser
{
    public function __construct(Parsedown $parsedown = null)
    {
        $this->parser = $parsedown ?: new Parsedown();
    }

    /**
     * {@inheritdoc}
     */
    public function parse($markdown)
    {
        return $this->parser->parse($markdown);
    }
}
