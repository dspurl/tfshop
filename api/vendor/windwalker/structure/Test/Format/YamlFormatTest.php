<?php declare(strict_types=1);
/**
 * Part of Windwalker project Test files.  @codingStandardsIgnoreStart
 *
 * @copyright  Copyright (C) 2019 LYRASOFT Taiwan, Inc.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Structure\Test\Format;

use Windwalker\Structure\Format\YamlFormat;

/**
 * Test class of YamlFormat
 *
 * @since 2.0
 */
class YamlFormatTest extends \PHPUnit\Framework\TestCase
{
    /**
     * Test instance.
     *
     * @var YamlFormat
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
        $this->instance = new YamlFormat();
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
     * Method to test objectToString().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Format\YamlFormat::structToString
     * @TODO   Implement testObjectToString().
     */
    public function testObjectToString()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test stringToObject().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Format\YamlFormat::stringToStruct
     * @TODO   Implement testStringToObject().
     */
    public function testStringToObject()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test getParser().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Format\YamlFormat::getParser
     * @TODO   Implement testGetParser().
     */
    public function testGetParser()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test setParser().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Format\YamlFormat::setParser
     * @TODO   Implement testSetParser().
     */
    public function testSetParser()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test getDumper().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Format\YamlFormat::getDumper
     * @TODO   Implement testGetDumper().
     */
    public function testGetDumper()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test setDumper().
     *
     * @return void
     *
     * @covers \Windwalker\Structure\Format\YamlFormat::setDumper
     * @TODO   Implement testSetDumper().
     */
    public function testSetDumper()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }
}
