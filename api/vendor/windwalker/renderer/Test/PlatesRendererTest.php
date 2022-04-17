<?php declare(strict_types=1);
/**
 * Part of Windwalker project Test files.  @codingStandardsIgnoreStart
 *
 * @copyright  Copyright (C) 2019 LYRASOFT Taiwan, Inc.
 * @license    LGPL-2.0-or-later see LICENSE
 */

namespace Windwalker\Renderer\Test;

use League\Plates\Engine;
use Windwalker\Dom\Test\AbstractDomTestCase;
use Windwalker\Renderer\PlatesRenderer;

/**
 * Test class of PlatesRenderer
 *
 * @since 2.0.9
 */
class PlatesRendererTest extends AbstractDomTestCase
{
    /**
     * Test instance.
     *
     * @var PlatesRenderer
     */
    protected $instance;

    /**
     * Property path.
     *
     * @var string
     */
    protected static $path;

    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
     *
     * @return void
     */
    protected function setUp(): void
    {
        static::$path = realpath(__DIR__ . '/Tmpl/plates');

        if (!static::$path) {
            throw new \RuntimeException('Path not exists');
        }

        $this->instance = new PlatesRenderer(static::$path);
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
     * Method to test getEngine().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\PlatesRenderer::getEngine
     */
    public function testGetEngine()
    {
        $this->instance->config->set('path.found', static::$path);

        $this->assertTrue($this->instance->getEngine() instanceof Engine);
    }

    /**
     * Method to test setEngine().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\PlatesRenderer::setEngine
     * @TODO   Implement testSetEngine().
     */
    public function testSetEngine()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test render().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\PlatesRenderer::render
     */
    public function testRender()
    {
        $html = $this->instance->render('profile', ['name' => 'Tony Stark']);

        $expect = <<<HTML
<html>
<head>
    <title>User Profile</title>
</head>
<body>

<img src="logo.png">

<div id="page">
    <h1>Welcome!</h1>
<p>Hello Tony Stark</p>
</div>

<div id="sidebar">
        <ul>
    <li><a href="/link">Example Link</a></li>
    <li><a href="/link">Example Link</a></li>
    <li><a href="/link">Example Link</a></li>
    <li><a href="/link">Example Link</a></li>
    <li><a href="/link">Example Link</a></li>
</ul>
    </div>

</body>
</html>
HTML;

        $this->assertDomStringEqualsDomString($expect, $html);
    }
}
