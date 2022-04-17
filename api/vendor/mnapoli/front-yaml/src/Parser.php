<?php
/**
 * FrontYAML
 *
 * @copyright Matthieu Napoli http://mnapoli.fr
 * @license   http://www.opensource.org/licenses/mit-license.php MIT (see the LICENSE file)
 */

namespace Mni\FrontYAML;

use Mni\FrontYAML\Bridge\Parsedown\ParsedownParser;
use Mni\FrontYAML\Bridge\Symfony\SymfonyYAMLParser;
use Mni\FrontYAML\Markdown\MarkdownParser;
use Mni\FrontYAML\YAML\YAMLParser;

/**
 * YAML Front matter parser
 *
 * @author Matthieu Napoli <matthieu@mnapoli.fr>
 */
class Parser
{
    /**
     * @var YAMLParser
     */
    private $yamlParser;

    /**
     * @var MarkdownParser
     */
    private $markdownParser;

    /**
     * @var array
     */
    private $startSep;

    /**
     * @var array
     */
    private $endSep;

    public function __construct(
        YAMLParser $yamlParser = null,
        MarkdownParser $markdownParser = null,
        $startSep = '---',
        $endSep = '---'
    ) {
        $this->yamlParser = $yamlParser ?: new SymfonyYAMLParser();
        $this->markdownParser = $markdownParser ?: new ParsedownParser();
        $this->startSep = array_filter((array) $startSep, 'is_string') ?: array('---');
        $this->endSep = array_filter((array) $endSep, 'is_string') ?: array('---');
    }

    /**
     * Parse a string containing the YAML front matter and the markdown.
     *
     * @param string $str
     * @param bool   $parseMarkdown Should the Markdown be turned into HTML?
     *
     * @return Document
     */
    public function parse($str, $parseMarkdown = true)
    {
        $yaml = null;

        $quote = function ($str) {
            return preg_quote($str, "~");
        };

        $regex = '~^('
            .implode('|', array_map($quote, $this->startSep)) # $matches[1] start separator
            ."){1}[\r\n|\n]*(.*?)[\r\n|\n]+("                       # $matches[2] between separators
            .implode('|', array_map($quote, $this->endSep))   # $matches[3] end separator
            ."){1}[\r\n|\n]*(.*)$~s";                               # $matches[4] document content

        if (preg_match($regex, $str, $matches) === 1) { // There is a Front matter
            $yaml = trim($matches[2]) !== '' ? $this->yamlParser->parse(trim($matches[2])) : null;
            $str = ltrim($matches[4]);
        }

        return new Document($yaml, $parseMarkdown ? $this->markdownParser->parse($str) : $str);
    }
}
