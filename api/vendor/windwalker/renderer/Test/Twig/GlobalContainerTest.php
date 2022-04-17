<?php declare(strict_types=1);
/**
 * Part of Windwalker project Test files.  @codingStandardsIgnoreStart
 *
 * @copyright  Copyright (C) 2019 LYRASOFT Taiwan, Inc.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Renderer\Test\Twig;

use Windwalker\Dom\Test\AbstractDomTestCase;
use Windwalker\Renderer\Test\Stub\StubTwigExtension;
use Windwalker\Renderer\Twig\GlobalContainer;
use Windwalker\Renderer\TwigRenderer;

/**
 * Test class of GlobalContainer
 *
 * @since 2.0
 */
class GlobalContainerTest extends AbstractDomTestCase
{
    /**
     * Method to test addExtension().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\Twig\GlobalContainer::addExtension
     */
    public function testAddExtension()
    {
        GlobalContainer::addExtension('stub', new StubTwigExtension());

        $renderer = new TwigRenderer(__DIR__ . '/../Tmpl/twig');

        $html = $renderer->render('ext-test.twig');

        $expect = <<<HTML
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<p>Suspendisse finibus fermentum massa ut tempus. Sed in pulvinar dolor.</p>
<ul>
    <li>peace</li>
    <li>sakura</li>
    <li>Iron Man</li>
</ul>
HTML;

        $this->assertHtmlFormatEquals($expect, $html);

        GlobalContainer::removeExtension('stub');
    }

    /**
     * Method to test getExtension().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\Twig\GlobalContainer::getExtension
     * @TODO   Implement testGetExtension().
     */
    public function testGetExtension()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test removeExtension().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\Twig\GlobalContainer::removeExtension
     * @TODO   Implement testRemoveExtension().
     */
    public function testRemoveExtension()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test getExtensions().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\Twig\GlobalContainer::getExtensions
     * @TODO   Implement testGetExtensions().
     */
    public function testGetExtensions()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test setExtensions().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\Twig\GlobalContainer::setExtensions
     * @TODO   Implement testSetExtensions().
     */
    public function testSetExtensions()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test addGlobal().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\Twig\GlobalContainer::addGlobal
     * @TODO   Implement testAddGlobal().
     */
    public function testAddGlobal()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test getGlobal().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\Twig\GlobalContainer::getGlobal
     * @TODO   Implement testGetGlobal().
     */
    public function testGetGlobal()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test removeGlobal().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\Twig\GlobalContainer::removeGlobal
     * @TODO   Implement testRemoveGlobal().
     */
    public function testRemoveGlobal()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test getGlobals().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\Twig\GlobalContainer::getGlobals
     * @TODO   Implement testGetGlobals().
     */
    public function testGetGlobals()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test setGlobals().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\Twig\GlobalContainer::setGlobals
     * @TODO   Implement testSetGlobals().
     */
    public function testSetGlobals()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }
}
