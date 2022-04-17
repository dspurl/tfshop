<?php declare(strict_types=1);
/**
 * Part of Windwalker project Test files.  @codingStandardsIgnoreStart
 *
 * @copyright  Copyright (C) 2019 LYRASOFT Taiwan, Inc.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Structure\Test\Format;

use Windwalker\Structure\Format\PhpFormat;

/**
 * Test class of PhpFormat
 *
 * @since 2.0
 */
class PhpFormatTest extends \PHPUnit\Framework\TestCase
{
    /**
     * Test instance.
     *
     * @var PhpFormat
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
        $this->instance = new PhpFormat();
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
     * @covers \Windwalker\Structure\Format\PhpFormat::structToString
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
     * @covers \Windwalker\Structure\Format\PhpFormat::stringToStruct
     * @TODO   Implement testStringToObject().
     */
    public function testStringToObject()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }
}
