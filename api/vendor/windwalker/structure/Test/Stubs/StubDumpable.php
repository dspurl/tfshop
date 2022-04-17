<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    GNU General Public License version 2 or later;
 */

namespace Windwalker\Structure\Test\Stubs;

/**
 * The StubDumpable class.
 *
 * @since  2.1.1
 */
class StubDumpable
{
    public $foo = 'foo';

    protected $bar = 'bar';

    private $yoo = 'yoo';

    protected $data = [];

    protected $iterator;

    /**
     * StubDumpable constructor.
     *
     * @param static $child
     */
    public function __construct($child = null)
    {
        $this->iterator = new \ArrayIterator(['wind' => 'walker']);

        $this->data = [
            'self' => $this,
            'new' => $child,
            'flower' => ['sakura', 'rose'],
        ];
    }
}
