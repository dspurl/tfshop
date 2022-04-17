<?php declare(strict_types=1);
/**
 * Part of Windwalker project Test files.  @codingStandardsIgnoreStart
 *
 * @copyright  Copyright (C) 2019 LYRASOFT Taiwan, Inc.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Renderer\Test;

use Windwalker\Dom\Test\AbstractDomTestCase;
use Windwalker\Renderer\Test\Stub\StubTwigExtension;
use Windwalker\Renderer\TwigRenderer;

/**
 * Test class of TwigRenderer
 *
 * @since 2.0
 */
class TwigRendererTest extends AbstractDomTestCase
{
    /**
     * Property path.
     *
     * @var string
     */
    protected static $path;

    /**
     * Test instance.
     *
     * @var TwigRenderer
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
        static::$path = realpath(__DIR__ . '/Tmpl/twig');

        if (!static::$path) {
            throw new \RuntimeException('Path not exists');
        }

        $this->instance = new TwigRenderer(static::$path);
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
     * Method to test render().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\TwigRenderer::render
     */
    public function testRender()
    {
        $html = $this->instance->render('default');

        $expect = <<<HTML
<div id="global">
    <p> (_global/global) Lorem ipsum dolor sit amet</p>
    <p> (default) Nulla sed libero sem. Praesent ac dignissim risus.</p>
    <p> (foo/bar) Phasellus vitae bibendum neque, quis suscipit urna. Fusce eu odio ante.</p>
    <p> (_global/global) Suspendisse finibus fermentum massa ut tempus. </p>
</div>
HTML;

        $this->assertDomStringEqualsDomString($expect, $html);
    }

    /**
     * Method to test render().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\TwigRenderer::render
     */
    public function testRenderWithDotPath()
    {
        $this->instance->config->set('path_separator', '.');

        $html = $this->instance->render('default_dot');

        $expect = <<<HTML
<div id="global">
    <p> (_global/global) Lorem ipsum dolor sit amet</p>
    <p> (default) Nulla sed libero sem. Praesent ac dignissim risus.</p>
    <p> (foo/bar) Phasellus vitae bibendum neque, quis suscipit urna. Fusce eu odio ante.</p>
    <p> (_global/global) Suspendisse finibus fermentum massa ut tempus. </p>
</div>
HTML;

        $this->assertDomStringEqualsDomString($expect, $html);
    }

    /**
     * Method to test getLoader().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\TwigRenderer::getLoader
     */
    public function testGetLoader()
    {
        $this->assertInstanceOf('Twig_Loader_Filesystem', $this->instance->getLoader());
    }

    /**
     * Method to test setLoader().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\TwigRenderer::setLoader
     * @TODO   Implement testSetLoader().
     */
    public function testSetLoader()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test addExtension().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\TwigRenderer::addExtension
     */
    public function testAddExtension()
    {
        $this->instance->addExtension(new StubTwigExtension());

        $html = $this->instance->render('ext-test.twig');

        $expect = <<<HTML
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<p>Suspendisse finibus fermentum massa ut tempus. Sed in pulvinar dolor.</p>
<ul>
    <li>peace</li>
    <li>sakura</li>
    <li>Iron Man</li>
</ul>
HTML;

        $this->assertDomStringEqualsDomString($expect, $html);
    }

    /**
     * Method to test setTwig().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\TwigRenderer::setTwig
     * @TODO   Implement testSetTwig().
     */
    public function testSetTwig()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test getDebugExtension().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\TwigRenderer::getDebugExtension
     */
    public function testGetDebugExtension()
    {
        $this->assertInstanceOf('Twig_Extension_Debug', $this->instance->getDebugExtension());
    }

    /**
     * Method to test setDebugExtension().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\TwigRenderer::setDebugExtension
     * @TODO   Implement testSetDebugExtension().
     */
    public function testSetDebugExtension()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }
}
