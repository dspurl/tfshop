<?php
/**
 * FrontYAML
 *
 * @copyright Matthieu Napoli http://mnapoli.fr
 * @license   http://www.opensource.org/licenses/mit-license.php MIT (see the LICENSE file)
 */

namespace Mni\FrontYAML\Bridge\Symfony;

use Mni\FrontYAML\YAML\YAMLParser;
use Symfony\Component\Yaml\Parser;

/**
 * Bridge to the Symfony YAML parser
 *
 * @author Matthieu Napoli <matthieu@mnapoli.fr>
 */
class SymfonyYAMLParser implements YAMLParser
{
    /**
     * @var Parser
     */
    private $parser;

    public function __construct()
    {
        $this->parser = new Parser();
    }

    /**
     * {@inheritdoc}
     */
    public function parse($yaml)
    {
        return $this->parser->parse($yaml);
    }
}
