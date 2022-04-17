<?php declare(strict_types=1);
/**
 * Part of Windwalker project Test files.  @codingStandardsIgnoreStart
 *
 * @copyright  Copyright (C) 2019 LYRASOFT Taiwan, Inc.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Renderer\Test;

use Windwalker\Dom\Test\AbstractDomTestCase;
use Windwalker\Renderer\PhpRenderer;

/**
 * Test class of PhpRenderer
 *
 * @since 2.0
 */
class PhpRendererTest extends AbstractDomTestCase
{
    /**
     * Test instance.
     *
     * @var PhpRenderer
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
        static::$path = realpath(__DIR__ . '/Tmpl/php');

        if (!static::$path) {
            throw new \RuntimeException('Path not exists');
        }

        $this->instance = new PhpRenderer(static::$path);
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
     * @covers \Windwalker\Renderer\PhpRenderer::render
     */
    public function testRender()
    {
        $html = $this->instance->render('default');

        $expect = <<<HTML
<div id="default">
    Default
</div>
HTML;

        $this->assertDomStringEqualsDomString($expect, $html);
    }

    /**
     * Method to test findFile().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\PhpRenderer::findFile
     */
    public function testFindFile()
    {
        $file = $this->instance->findFile('flower');

        $this->assertEquals(realpath(static::$path . '/flower.php'), $file);

        $file = $this->instance->findFile('foo/bar');

        $this->assertEquals(realpath(static::$path . '/foo/bar.php'), $file);
    }

    /**
     * Method to test extend().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\PhpRenderer::extend
     */
    public function testRenderTopLevelBlock()
    {
        $html = $this->instance->render('extend1');

        $expect = <<<HTML
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eleifend, ante vitae vestibulum tempus
</p>
HTML;

        $this->assertDomStringEqualsDomString($expect, $html);
    }

    /**
     * Method to test extend().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\PhpRenderer::extend
     */
    public function testExtend()
    {
        $html = $this->instance->render('foo/extend2');

        $expect = <<<HTML
<p>
Lorem ipsum dolor sit amet,
<span>Vivamus tincidunt consectetur finibus.</span>
Curabitur eleifend, ante vitae vestibulum tempus
</p>
HTML;

        $this->assertDomStringEqualsDomString($expect, $html);

        $this->instance->reset();

        // Render twice
        $html = $this->instance->render('foo/extend3');

        $expect = <<<HTML
<p>
Lorem ipsum dolor sit amet,
<span>Sed tempor urna quis varius luctus.</span>
Curabitur eleifend, ante vitae vestibulum tempus
</p>
HTML;

        $this->assertDomStringEqualsDomString($expect, $html);
    }

    /**
     * testExtendMultiLevels
     *
     * @return  void
     */
    public function testExtendMultiLevels()
    {
        $html = $this->instance->render('foo/extend3');

        $expect = <<<HTML
<p>
Lorem ipsum dolor sit amet,
<span>Sed tempor urna quis varius luctus.</span>
Curabitur eleifend, ante vitae vestibulum tempus
</p>
HTML;

        $this->assertDomStringEqualsDomString($expect, $html);
    }

    /**
     * testExtendWithParent
     *
     * @return  void
     */
    public function testExtendWithParent()
    {
        $html = $this->instance->render('foo/extend-with-parent');

        $expect = <<<HTML
<p>
Lorem ipsum dolor sit amet,
<span>Vivamus tincidunt consectetur finibus.</span>
<span>Sed tempor urna quis varius luctus.</span>
Curabitur eleifend, ante vitae vestibulum tempus
</p>
HTML;

        $this->assertDomStringEqualsDomString($expect, $html);
    }

    /**
     * testLoad
     *
     * @return  void
     */
    public function testLoad()
    {
        $html = $this->instance->render('include1');

        $expect = <<<HTML
<div id="flower">
    <h1>BAR</h1>
    <p>Quisque egestas posuere enim non dapibus.</p>
</div>
HTML;

        $this->assertDomStringEqualsDomString($expect, $html);
    }

    /**
     * testLoadWithData
     *
     * @return  void
     */
    public function testLoadWithData()
    {
        $data = [
            'class' => 'flower',
            'title' => 'Sakura',
            'content' => 'Nulla sollicitudin vel augue quis aliquet.',
        ];

        $html = $this->instance->render('data1', $data);

        $expect = <<<HTML
<div id="data" class="flower">
    <h1>Sakura</h1>
    <p>Morbi suscipit ante massa</p>
</div>
HTML;

        $this->assertDomStringEqualsDomString($expect, $html);
    }

    /**
     * Method to test escape().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\AbstractRenderer::escape
     */
    public function testEscape()
    {
        $html = '<div id="data" class="flower" onclick="jQuery(\'#data .gota\').distroy();"></div>';

        $this->assertEquals(
            '&lt;div id=&quot;data&quot; class=&quot;flower&quot; onclick=&quot;jQuery(\'#data .gota\').distroy();&quot;&gt;&lt;/div&gt;',
            $this->instance->escape($html)
        );
    }

    /**
     * Method to test getPaths().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\AbstractRenderer::getPaths
     * @TODO   Implement testGetPaths().
     */
    public function testGetPaths()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test setPaths().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\AbstractRenderer::setPaths
     * @TODO   Implement testSetPaths().
     */
    public function testSetPaths()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test addPath().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\AbstractRenderer::addPath
     * @TODO   Implement testAddPath().
     */
    public function testAddPath()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test getBlock().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\PhpRenderer::getBlock
     * @TODO   Implement testGetBlock().
     */
    public function testGetBlock()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test setBlock().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\PhpRenderer::setBlock
     * @TODO   Implement testSetBlock().
     */
    public function testSetBlock()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test getBlockQueue().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\PhpRenderer::getBlockQueue
     * @TODO   Implement testGetBlockQueue().
     */
    public function testGetBlockQueue()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }
}
