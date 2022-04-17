<?php declare(strict_types=1);
/**
 * Part of Windwalker project Test files.  @codingStandardsIgnoreStart
 *
 * @copyright  Copyright (C) 2019 LYRASOFT Taiwan, Inc.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Structure\Test;

use Windwalker\Structure\Structure;
use Windwalker\Structure\StructureHelper;
use Windwalker\Test\TestCase\AbstractBaseTestCase;

/**
 * Test class of Structure
 *
 * @since 2.0
 */
class StructureTest extends AbstractBaseTestCase
{
    /**
     * Test instance.
     *
     * @var Structure
     */
    protected $instance;

    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
     *
     * @return void
     */
    protected function setUp(): void
    {
        $this->instance = new Structure($this->getTestData());
    }

    /**
     * getTestData
     *
     * @return  array
     */
    protected function getTestData()
    {
        return [
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
     * Method to test __clone().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::__clone
     */
    public function test__clone()
    {
        $structure1 = new Structure($this->getTestData());

        $structure2 = clone $structure1;

        $this->assertEquals($structure1, $structure2);
    }

    /**
     * Method to test __toString().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::__toString
     */
    public function test__toString()
    {
        $this->assertJsonStringEqualsJsonString(json_encode($this->getTestData()), (string) $this->instance);
    }

    /**
     * Method to test jsonSerialize().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::jsonSerialize
     */
    public function testJsonSerialize()
    {
        $this->assertJsonStringEqualsJsonString(json_encode($this->getTestData()), (string) $this->instance);
    }

    /**
     * Method to test def().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::def
     */
    public function testDef()
    {
        $this->assertNull($this->instance->get('lily'));

        $this->instance->def('lily', 'love');

        $this->assertEquals('love', $this->instance->get('lily'));
    }

    /**
     * Method to test exists().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::exists
     */
    public function testExists()
    {
        $this->assertFalse($this->instance->exists('rose'));
        $this->assertTrue($this->instance->exists('flower'));
    }

    /**
     * Method to test get().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::get
     */
    public function testGet()
    {
        $this->assertEquals($this->instance->get('flower', 'canna'), 'sakura');

        $this->assertEquals($this->instance->get('not.exists', 'canna'), 'canna');

        $this->assertNull($this->instance->get('not.exists'));

        $this->assertEquals($this->instance->get('pos1.sunflower'), 'love');
    }

    /**
     * Method to test loadArray().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::load
     */
    public function testLoadArray()
    {
        $structure = new Structure();

        $structure->load($this->getTestData());

        $this->assertEquals($structure->get('olive'), 'peace');

        $this->assertEquals($structure->get('pos1.sunflower'), 'love');
    }

    /**
     * Method to test loadObject().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::load
     */
    public function testLoadObject()
    {
        $structure = new Structure();

        $structure->load((object) $this->getTestData());

        $this->assertEquals($structure->get('olive'), 'peace');

        $this->assertEquals($structure->get('pos1.sunflower'), 'love');
    }

    /**
     * Method to test loadFile().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::loadFile
     */
    public function testLoadFile()
    {
        $structure = new Structure();

        $this->assertEquals(
            $structure->reset()->loadFile(__DIR__ . '/Stubs/flower.json', 'json')->get('flower'),
            'sakura'
        );
        $this->assertEquals(
            $structure->reset()->loadFile(__DIR__ . '/Stubs/flower.yml', 'yaml')->get('flower'),
            'sakura'
        );
        $this->assertEquals(
            $structure->reset()->loadFile(__DIR__ . '/Stubs/flower.ini', 'ini')->get('flower'),
            'sakura'
        );
        $this->assertEquals(
            $structure->reset()->loadFile(__DIR__ . '/Stubs/flower.xml', 'xml')->get('flower'),
            'sakura'
        );
        $this->assertEquals(
            $structure->reset()->loadFile(__DIR__ . '/Stubs/flower.php', 'php')->get('flower'),
            'sakura'
        );
    }

    /**
     * Method to test loadString().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::loadString
     * @throws \Exception
     */
    public function testLoadString()
    {
        $structure = new Structure();

        $this->assertEquals(
            $structure->reset()->loadString(
                file_get_contents(__DIR__ . '/Stubs/flower.json'),
                'json'
            )->get('flower'),
            'sakura'
        );
        $this->assertEquals(
            $structure->reset()->loadString(
                file_get_contents(__DIR__ . '/Stubs/flower.yml'),
                'yaml'
            )->get('flower'),
            'sakura'
        );
        $this->assertEquals(
            $structure->reset()->loadString(
                file_get_contents(__DIR__ . '/Stubs/flower.ini'),
                'ini'
            )->get('flower'),
            'sakura'
        );
        $this->assertEquals(
            $structure->reset()->loadString(
                file_get_contents(__DIR__ . '/Stubs/flower.xml'),
                'xml'
            )->get('flower'),
            'sakura'
        );
        $this->assertEquals(
            $structure->reset()->loadString(
                file_get_contents(__DIR__ . '/Stubs/flower.hjson'),
                'hjson'
            )->get('flower'),
            'sakura'
        );
        $this->assertEquals(
            $structure->reset()->loadString(
                file_get_contents(__DIR__ . '/Stubs/flower.toml'),
                'toml',
                ['load_raw' => true]
            )->get('flower'),
            'sakura'
        );
    }

    /**
     * Method to test merge().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::merge
     * @throws \Exception
     */
    public function testMerge()
    {
        // Test recursive merge
        $object1 = '{
            "foo" : "foo value",
            "bar" : {
                "bar1" : "bar value 1",
                "bar2" : "bar value 2",
                "bar3" : "bar value 3"
            }
        }';
        $object2 = '{
            "foo" : "foo value",
            "bar" : {
                "bar2" : "new bar value 2",
                "bar3" : null
            }
        }';

        $structure1 = new Structure(json_decode($object1));
        $structure2 = new Structure(json_decode($object2));

        $structure1->merge($structure2);

        $this->assertEquals(
            'new bar value 2',
            $structure1->get('bar.bar2'),
            'Line: ' . __LINE__ . '. bar.bar2 should be override.'
        );
        $this->assertEquals(
            'bar value 1',
            $structure1->get('bar.bar1'),
            'Line: ' . __LINE__ . '. bar.bar1 should not be override.'
        );
        $this->assertSame(
            'bar value 3',
            $structure1->get('bar.bar3'),
            'Line: ' . __LINE__ . '. bar.bar3 should not be override.'
        );

        $structure = new Structure(['flower' => 'rose', 'honor' => 'Osmanthus month']);

        $structure->merge($this->instance);

        $this->assertEquals($structure->get('flower'), 'sakura');
        $this->assertEquals($structure->get('honor'), 'Osmanthus month');
    }

    /**
     * Method to test merge().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::merge
     */
    public function testMergeWithIgnoreValues()
    {
        // Test recursive merge
        $object1 = '{
            "foo" : "foo value",
            "bar" : {
                "bar1" : "bar value 1",
                "bar2" : "bar value 2",
                "bar3" : "bar value 3"
            }
        }';
        $object2 = '{
            "foo" : "foo value",
            "bar" : {
                "bar2" : "new bar value 2",
                "bar3" : ""
            }
        }';

        $structure1 = new Structure(json_decode($object1));
        $structure2 = new Structure(json_decode($object2));

        $structure1->setIgnoreValues([null, '']);
        $structure1->merge($structure2);

        $this->assertEquals(
            'new bar value 2',
            $structure1->get('bar.bar2'),
            'Line: ' . __LINE__ . '. bar.bar2 should be override.'
        );
        $this->assertEquals(
            'bar value 1',
            $structure1->get('bar.bar1'),
            'Line: ' . __LINE__ . '. bar.bar1 should not be override.'
        );
        $this->assertSame(
            'bar value 3',
            $structure1->get('bar.bar3'),
            'Line: ' . __LINE__ . '. bar.bar3 should not be override.'
        );

        $structure = new Structure(['flower' => 'rose', 'honor' => 'Osmanthus month']);

        $structure->merge($this->instance);

        $this->assertEquals($structure->get('flower'), 'sakura');
        $this->assertEquals($structure->get('honor'), 'Osmanthus month');
    }

    /**
     * testMergeTo
     *
     * @return  void
     *
     * @covers \Windwalker\Structure\Structure::mergeTo
     */
    public function testMergeTo()
    {
        $structure = new Structure(['sunflower' => 'shine', 'honor' => 'Osmanthus month']);

        $this->instance->mergeTo('pos1', $structure);

        $this->assertEquals($this->instance->get('pos1.sunflower'), 'shine');
        $this->assertEquals($this->instance->get('pos1.honor'), 'Osmanthus month');

        $this->instance->mergeTo('foo.bar', $structure);

        $this->assertEquals($this->instance->get('foo.bar.sunflower'), 'shine');
        $this->assertEquals($this->instance->get('foo.bar.honor'), 'Osmanthus month');
    }

    /**
     * Method to test offsetExists().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::offsetExists
     */
    public function testOffsetExists()
    {
        $this->assertTrue(isset($this->instance['flower']));
        $this->assertFalse(isset($this->instance['carbon']));
    }

    /**
     * Method to test offsetGet().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::offsetGet
     */
    public function testOffsetGet()
    {
        $this->assertEquals($this->instance['flower'], 'sakura');
    }

    /**
     * Method to test offsetSet().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::offsetSet
     */
    public function testOffsetSet()
    {
        $this->instance['bird'] = 'flying';

        $this->assertEquals($this->instance['bird'], 'flying');
    }

    /**
     * Method to test offsetUnset().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::offsetUnset
     */
    public function testOffsetUnset()
    {
        unset($this->instance['bird']);

        $this->assertEquals($this->instance['bird'], null);
    }

    /**
     * Method to test set().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::set
     */
    public function testSet()
    {
        $this->instance->set('tree.bird', 'sleeping');

        $this->assertEquals($this->instance->get('tree.bird'), 'sleeping');
    }

    /**
     * Method to test setRaw()
     *
     * @return  void
     *
     * @covers \Windwalker\Structure\Structure::setRaw
     */
    public function testSetRaw()
    {
        $object = (object) ['foo' => 'bar'];

        $this->instance->setRaw('tree.bird', $object);

        $this->assertEquals('bar', $this->instance->get('tree.bird.foo'));
        $this->assertSame($object, $this->instance->get('tree.bird'));
    }

    /**
     * Method to test toArray().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::toArray
     */
    public function testToArray()
    {
        $structure = new Structure($this->getTestData());

        $this->assertEquals($structure->toArray(), $this->getTestData());
    }

    /**
     * Method to test toObject().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::toObject
     */
    public function testToObject()
    {
        $structure = new Structure($this->getTestData());

        $this->assertEquals($structure->toObject(), StructureHelper::toObject($this->getTestData()));
    }

    /**
     * Method to test toString().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::toString
     */
    public function testToString()
    {
        $structure = new Structure($this->getTestData());

        $this->assertStringSafeEquals($this->loadFile(__DIR__ . '/Stubs/flower.ini'), $structure->toString('ini'));
        $this->assertStringSafeEquals($this->loadFile(__DIR__ . '/Stubs/flower.json'), $structure->toString('json'));
        $this->assertStringSafeEquals($this->loadFile(__DIR__ . '/Stubs/flower.yml'), $structure->toString('yml'));
        $this->assertStringSafeEquals($this->loadFile(__DIR__ . '/Stubs/flower.xml'), $structure->toString('xml'));
        $this->assertStringSafeEquals($this->loadFile(__DIR__ . '/Stubs/flower.php'), $structure->toString('php', ['strict' => true]));
    }

    /**
     * Method to test flatten().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Structure::flatten
     */
    public function testFlatten()
    {
        $flatted = $this->instance->flatten();

        $this->assertEquals($flatted['pos1.sunflower'], 'love');

        $flatted = $this->instance->flatten('/');

        $this->assertEquals($flatted['pos1/sunflower'], 'love');
    }

    /**
     * testAppend
     *
     * @return  void
     *
     * @covers \Windwalker\Structure\Structure::push
     */
    public function testPush()
    {
        $structure = new Structure();

        $structure->set('foo', ['var1', 'var2', 'var3']);

        $structure->push('foo', 'var4');

        $this->assertEquals('var4', $structure->get('foo.3'));

        $structure->push('foo', 'var5', 'var6');

        $this->assertEquals('var5', $structure->get('foo.4'));
        $this->assertEquals('var6', $structure->get('foo.5'));

        $structure->setRaw('foo2', (object) ['var1', 'var2', 'var3']);

        $b = $structure->get('foo2');

        $this->assertTrue(is_object($b));

        $structure->push('foo2', 'var4');

        $b = $structure->get('foo2');

        $this->assertTrue(is_array($b));
    }

    /**
     * testShift
     *
     * @return  void
     *
     * @covers \Windwalker\Structure\Structure::shift
     */
    public function testShift()
    {
        $structure = new Structure();

        $structure->set('foo.bar', ['var1', 'var2', 'var3']);

        $this->assertEquals('var1', $structure->shift('foo.bar'));

        $this->assertEquals('var2', $structure->get('foo.bar.0'));

        $structure->setRaw('foo.bar2', (object) ['v1' => 'var1', 'v2' => 'var2', 'v3' => 'var3']);

        $this->assertEquals('var1', $structure->shift('foo.bar2'));

        $this->assertEquals('var2', $structure->get('foo.bar2.v2'));

        $this->assertTrue(is_array($structure->get('foo.bar2')));
    }

    /**
     * testPop
     *
     * @return  void
     *
     * @covers \Windwalker\Structure\Structure::pop
     */
    public function testPop()
    {
        $structure = new Structure();

        $structure->set('foo.bar', ['var1', 'var2', 'var3']);

        $this->assertEquals('var3', $structure->pop('foo.bar'));

        $this->assertNull($structure->get('foo.bar.2'));

        $structure->setRaw('foo.bar2', (object) ['v1' => 'var1', 'v2' => 'var2', 'v3' => 'var3']);

        $this->assertEquals('var3', $structure->pop('foo.bar2'));

        $this->assertNull($structure->get('foo.bar2.v3'));

        $this->assertTrue(is_array($structure->get('foo.bar2')));
    }

    /**
     * testUnshift
     *
     * @return  void
     *
     * @covers \Windwalker\Structure\Structure::unshift
     */
    public function testUnshift()
    {
        $structure = new Structure();

        $structure->set('foo', ['var1', 'var2', 'var3']);

        $structure->unshift('foo', 'var4');

        $this->assertEquals('var4', $structure->get('foo.0'));

        $structure->unshift('foo', 'var5', 'var6');

        $this->assertEquals('var5', $structure->get('foo.0'));
        $this->assertEquals('var6', $structure->get('foo.1'));

        $structure->setRaw('foo2', (object) ['var1', 'var2', 'var3']);

        $b = $structure->get('foo2');

        $this->assertTrue(is_object($b));

        $structure->unshift('foo2', 'var4');

        $b = $structure->get('foo2');

        $this->assertTrue(is_array($b));
    }

    /**
     * testReset
     *
     * @return  void
     *
     * @covers  \Windwalker\Structure\Structure::reset
     */
    public function testReset()
    {
        $this->instance->reset();

        $this->assertEquals([], $this->instance->getRaw());
    }

    /**
     * testGetRaw
     *
     * @return  void
     *
     * @covers  \Windwalker\Structure\Structure::getRaw
     */
    public function testGetRaw()
    {
        $this->assertEquals($this->getTestData(), $this->instance->getRaw());
    }

    /**
     * testGetIterator
     *
     * @return  void
     *
     * @covers  \Windwalker\Structure\Structure::getIterator
     */
    public function testGetIterator()
    {
        $this->assertInstanceOf('RecursiveArrayIterator', $this->instance->getIterator());

        $this->assertEquals($this->getTestData(), iterator_to_array($this->instance));
        $this->assertEquals(
            iterator_to_array(new \RecursiveIteratorIterator(new \RecursiveArrayIterator($this->getTestData()))),
            iterator_to_array(new \RecursiveIteratorIterator($this->instance))
        );
    }

    /**
     * testCount
     *
     * @return  void
     *
     * @covers  \Windwalker\Structure\Structure::count
     */
    public function testCount()
    {
        $this->assertEquals(5, count($this->instance));
    }

    /**
     * loadFile
     *
     * @param string $file
     *
     * @return  string
     */
    protected function loadFile($file)
    {
        $text = file_get_contents($file);

        return $text;
    }
}
