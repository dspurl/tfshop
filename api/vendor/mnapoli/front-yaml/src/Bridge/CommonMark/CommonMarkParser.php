<?php
/**
 * FrontYAML
 *
 * @copyright Matthieu Napoli http://mnapoli.fr
 * @license   http://www.opensource.org/licenses/mit-license.php MIT (see the LICENSE file)
 */

namespace Mni\FrontYAML\Bridge\CommonMark;

use League\CommonMark\CommonMarkConverter;
use Mni\FrontYAML\Markdown\MarkdownParser;

/**
 * Bridge to the League CommonMark parser
 *
 * @author Matthieu Napoli <matthieu@mnapoli.fr>
 */
class CommonMarkParser implements MarkdownParser
{
    public function __construct(CommonMarkConverter $commonMarkConverter = null)
    {
        $this->parser = $commonMarkConverter ?: new CommonMarkConverter();
    }

    /**
     * {@inheritdoc}
     */
    public function parse($markdown)
    {
        return $this->parser->convertToHtml($markdown);
    }
}
