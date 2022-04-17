<?php
/**
 * FrontYAML
 *
 * @copyright Matthieu Napoli http://mnapoli.fr
 * @license   http://www.opensource.org/licenses/mit-license.php MIT (see the LICENSE file)
 */

namespace Mni\FrontYAML\YAML;

/**
 * Interface of a YAML parser
 *
 * @author Matthieu Napoli <matthieu@mnapoli.fr>
 */
interface YAMLParser
{
    /**
     * Parses a YAML string.
     *
     * @param string $yaml
     *
     * @return mixed
     */
    public function parse($yaml);
}
