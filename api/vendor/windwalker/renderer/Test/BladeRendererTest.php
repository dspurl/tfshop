<?php declare(strict_types=1);
/**
 * Part of Windwalker project Test files.  @codingStandardsIgnoreStart
 *
 * @copyright  Copyright (C) 2019 LYRASOFT Taiwan, Inc.
 * @license    LGPL-2.0-or-later
 */

namespace Windwalker\Renderer\Test;

use Illuminate\Contracts\View\Factory;
use Windwalker\Dom\Test\AbstractDomTestCase;
use Windwalker\Filesystem\Filesystem;
use Windwalker\Filesystem\Folder;
use Windwalker\Renderer\BladeRenderer;

/**
 * Test class of BladeRenderer
 *
 * @since 2.0
 */
class BladeRendererTest extends AbstractDomTestCase
{
    /**
     * Test instance.
     *
     * @var BladeRenderer
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
        static::$path = realpath(__DIR__ . '/Tmpl/blade');

        if (!static::$path) {
            throw new \RuntimeException('Path not exists');
        }

        Folder::create(__DIR__ . '/cache');

        $this->instance = new BladeRenderer(static::$path, ['cache_path' => __DIR__ . '/cache']);
    }

    /**
     * Tears down the fixture, for example, closes a network connection.
     * This method is called after a test is executed.
     *
     * @return void
     */
    protected function tearDown(): void
    {
        Filesystem::delete(__DIR__ . '/cache');
    }

    /**
     * Destructor
     */
    public function __destruct()
    {
        Filesystem::delete(__DIR__ . '/cache');
    }

    /**
     * Method to test render().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\BladeRenderer::render
     */
    public function testRender()
    {
        $html = $this->instance->render('hello');

        $expect = <<<HTML
<html>
<body>
    This is the master sidebar.

    <p>This is appended to the master sidebar.</p>
    <div class="container">
        <p>This is my body content.</p>
    </div>
</body>
</html>
HTML;

        $this->assertHtmlFormatEquals($expect, $html);
    }

    /**
     * testAddCompilers
     *
     * @return  void
     */
    public function testAddCompilers()
    {
        $this->instance->addCustomCompiler(
            'upper',
            function ($expression) {
                return "<?php echo strtoupper({$expression}); ?>";
            }
        );

        $expect = <<<HTML
<html>
<body>
    This is the master sidebar.

    <p>This is appended to the master sidebar.</p>
    <div class="container">
        <p>THIS IS MY BODY CONTENT.</p>
    </div>
</body>
</html>
HTML;

        $html = $this->instance->render('compiler');

        $this->assertHtmlFormatEquals($expect, $html);
    }

    /**
     * Method to test getBlade().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\BladeRenderer::getEngine
     */
    public function testGetBlade()
    {
        $this->assertInstanceOf(Factory::class, $this->instance->getEngine());
    }

    /**
     * Method to test setBlade().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\BladeRenderer::setEngine
     * @TODO   Implement testSetBlade().
     */
    public function testSetBlade()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test getFilesystem().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\BladeRenderer::getFilesystem
     */
    public function testGetFilesystem()
    {
        $this->assertInstanceOf(\Illuminate\Filesystem\Filesystem::class, $this->instance->getFilesystem());
    }

    /**
     * Method to test setFilesystem().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\BladeRenderer::setFilesystem
     * @TODO   Implement testSetFilesystem().
     */
    public function testSetFilesystem()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test getFinder().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\BladeRenderer::getFinder
     */
    public function testGetFinder()
    {
        $this->assertInstanceOf('Illuminate\View\FileViewFinder', $this->instance->getFinder());
    }

    /**
     * Method to test setFinder().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\BladeRenderer::setFinder
     * @TODO   Implement testSetFinder().
     */
    public function testSetFinder()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test getResolver().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\BladeRenderer::getResolver
     */
    public function testGetResolver()
    {
        $this->assertInstanceOf('Illuminate\View\Engines\EngineResolver', $this->instance->getResolver());
    }

    /**
     * Method to test setResolver().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\BladeRenderer::setResolver
     */
    public function testSetResolver()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test getDispatcher().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\BladeRenderer::getDispatcher
     */
    public function testGetDispatcher()
    {
        $this->assertInstanceOf('Illuminate\Events\Dispatcher', $this->instance->getDispatcher());
    }

    /**
     * Method to test setDispatcher().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\BladeRenderer::setDispatcher
     * @TODO   Implement testSetDispatcher().
     */
    public function testSetDispatcher()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Method to test getCompiler().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\BladeRenderer::getCompiler
     */
    public function testGetCompiler()
    {
        $this->assertInstanceOf('Illuminate\View\Engines\CompilerEngine', $this->instance->getCompiler());
    }

    /**
     * Method to test setCompiler().
     *
     * @return void
     *
     * @covers \Windwalker\Renderer\BladeRenderer::setCompiler
     * @TODO   Implement testSetCompiler().
     */
    public function testSetCompiler()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }
}
