<?php declare(strict_types=1);
/**
 * Part of Windwalker project Test files.  @codingStandardsIgnoreStart
 *
 * @copyright  Copyright (C) 2019 SMS Taiwan, Inc.
 * @license    GNU General Public License version 2 or later; see LICENSE
 */

namespace Windwalker\Structure\Test;

use Windwalker\Structure\Structure;
use Windwalker\Structure\StructureHelper;
use Windwalker\Structure\Test\Stubs\StubDumpable;

/**
 * Test class of StructureHelper
 *
 * @since 2.1
 */
class StructureHelperTest extends \PHPUnit\Framework\TestCase
{
    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
     *
     * @return void
     */
    protected function setUp(): void
    {
    }

    /**
     * Tears down the fixture, for example, closes a network connection.
     * This method is called after a test is executed.
     *
     * @return void
     */
    protected function tearDown(): void
    {
    }

    /**
     * Method to test isAssociativeArray().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\StructureHelper::isAssociativeArray
     */
    public function testIsAssociativeArray()
    {
        $this->assertFalse(StructureHelper::isAssociativeArray(['a', 'b']));

        $this->assertTrue(StructureHelper::isAssociativeArray([1, 2, 'a' => 'b', 'c', 'd']));
    }

    /**
     * Method to test toObject().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\StructureHelper::toObject
     */
    public function testToObject()
    {
        $data = StructureHelper::toObject(['foo' => 'bar']);

        $this->assertIsObject($data);

        $this->assertEquals('bar', $data->foo);

        $data = StructureHelper::toObject(['foo' => 'bar'], 'ArrayObject');

        $this->assertInstanceOf('ArrayObject', $data);

        $data = StructureHelper::toObject(['foo' => ['bar' => 'baz']]);

        $this->assertEquals('baz', $data->foo->bar);
    }

    /**
     * Method to test getByPath().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\StructureHelper::getByPath
     */
    public function testGetByPath()
    {
        $data = [
            'flower' => 'sakura',
            'olive' => 'peace',
            'pos1' => [
                'sunflower' => 'love',
            ],
            'pos2' => [
                'cornflower' => 'elegant',
            ],
            'array' => [
                'A',
                'B',
                'C',
            ],
        ];

        $this->assertEquals('sakura', StructureHelper::getByPath($data, 'flower'));
        $this->assertEquals('love', StructureHelper::getByPath($data, 'pos1.sunflower'));
        $this->assertEquals('love', StructureHelper::getByPath($data, 'pos1/sunflower', '/'));
        $this->assertEquals($data['array'], StructureHelper::getByPath($data, 'array'));
        $this->assertNull(StructureHelper::getByPath($data, 'not.exists'));
    }

    /**
     * Method to test getByPath().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\StructureHelper::getByPath
     */
    public function testGetByPathWithObject()
    {
        $data = [
            'flower' => 'sakura',
            'olive' => 'peace',
            'pos1' => (object) [
                'sunflower' => 'love',
            ],
            'pos2' => new Structure(
                [
                    'cornflower' => 'elegant',
                ]
            ),
            'array' => [
                'A',
                'B',
                'C',
            ],
        ];

        $this->assertEquals('sakura', StructureHelper::getByPath($data, 'flower'));
        $this->assertEquals('love', StructureHelper::getByPath($data, 'pos1.sunflower'));
        $this->assertEquals('elegant', StructureHelper::getByPath($data, 'pos2.cornflower'));
        $this->assertEquals(null, StructureHelper::getByPath($data, 'pos2.data'));
    }

    /**
     * Method to test setByPath().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\StructureHelper::setByPath
     */
    public function testSetByPath()
    {
        $data = [];

        // One level
        $return = StructureHelper::setByPath($data, 'flower', 'sakura');

        $this->assertEquals('sakura', $data['flower']);
        $this->assertTrue($return);

        // Multi-level
        StructureHelper::setByPath($data, 'foo.bar', 'test');

        $this->assertEquals('test', $data['foo']['bar']);

        // Separator
        StructureHelper::setByPath($data, 'foo/bar', 'play', '/');

        $this->assertEquals('play', $data['foo']['bar']);

        // False
        $return = StructureHelper::setByPath($data, '', 'goo');

        $this->assertFalse($return);

        // Fix path
        StructureHelper::setByPath($data, 'double..separators', 'value');

        $this->assertEquals('value', $data['double']['separators']);
    }

    /**
     * testRemoveByPath
     *
     * @return  void
     */
    public function testRemoveByPath()
    {
        $data = [
            'foo' => [
                'bar' => '123',
            ],
        ];

        StructureHelper::removeByPath($data, 'foo.bar');

        $this->assertFalse(array_key_exists('bar', $data['foo']));

        $data = [
            'foo' => [
                'bar' => '123',
            ],
        ];

        StructureHelper::removeByPath($data, 'foo');

        $this->assertFalse(array_key_exists('foo', $data));

        $data = [
            'foo' => [
                'bar' => '123',
            ],
        ];

        StructureHelper::removeByPath($data, 'foo.yoo');

        $this->assertEquals('123', $data['foo']['bar']);
    }

    /**
     * Method to test getPathNodes().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\StructureHelper::getPathNodes
     */
    public function testGetPathNodes()
    {
        $this->assertEquals(['a', 'b', 'c'], StructureHelper::getPathNodes('a..b.c'));
        $this->assertEquals(['a', 'b', 'c'], StructureHelper::getPathNodes('a//b/c', '/'));
    }

    /**
     * testFlatten
     *
     * @return  void
     *
     * @covers  \Windwalker\Structure\StructureHelper::flatten
     * @since   2.0
     */
    public function testFlatten()
    {
        $array = [
            'flower' => 'sakura',
            'olive' => 'peace',
            'pos1' => [
                'sunflower' => 'love',
            ],
            'pos2' => [
                'cornflower' => 'elegant',
            ],
        ];

        $flatted = StructureHelper::flatten($array);

        $this->assertEquals($flatted['pos1.sunflower'], 'love');

        $flatted = StructureHelper::flatten($array, '/');

        $this->assertEquals($flatted['pos1/sunflower'], 'love');
    }

    /**
     * Data provider for object inputs
     *
     * @return  array
     *
     * @since   2.0
     */
    public function seedTestToArray()
    {
        return [
            'string' => [
                'foo',
                false,
                ['foo'],
            ],
            'array' => [
                ['foo'],
                false,
                ['foo'],
            ],
            'array_recursive' => [
                [
                    'foo' => [
                        (object) ['bar' => 'bar'],
                        (object) ['baz' => 'baz'],
                    ],
                ],
                true,
                [
                    'foo' => [
                        ['bar' => 'bar'],
                        ['baz' => 'baz'],
                    ],
                ],
            ],
            'iterator' => [
                ['foo' => new \ArrayIterator(['bar' => 'baz'])],
                true,
                ['foo' => ['bar' => 'baz']],
            ],
        ];
    }

    /**
     * testToArray
     *
     * @param $input
     * @param $recursive
     * @param $expect
     *
     * @return  void
     *
     * @dataProvider  seedTestToArray
     * @covers        \Windwalker\Utilities\ArrayHelper::toArray
     */
    public function testToArray($input, $recursive, $expect)
    {
        $this->assertEquals($expect, StructureHelper::toArray($input, $recursive));
    }

    public function testDumpObjectValue()
    {
        $data = new StubDumpable(new StubDumpable());

        $dumped = StructureHelper::dumpObjectValues($data);

        $this->assertEquals('foo', $dumped['foo']);
        $this->assertEquals('bar', $dumped['bar']);
        $this->assertNull($dumped['data']['self']);
        $this->assertEquals(StructureHelper::dumpObjectValues(new StubDumpable()), $dumped['data']['new']);
        $this->assertEquals(['sakura', 'rose'], $dumped['data']['flower']);
        $this->assertEquals(['wind' => 'walker'], $dumped['iterator']);
    }
}
