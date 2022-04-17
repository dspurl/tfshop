# Windwalker Renderer

Windwalker Renderer is a simple template engine loader to load file for engines to render.

## Installation via Composer

Add this to the require block in your `composer.json`.

``` json
{
    "require": {
        "windwalker/renderer": "~3.0"
    }
}
```

## Support Engines

- [PHP](#getting-started)
- [Twig](#twig-renderer)
- [Blade](#blade-renderer)
- [Edge](#edge-renderer) (A Blade compitable engine without dependencies)
- [Mustache](#mustache-renderer)
- [Plates](#plates-renderer)

## Getting Started

``` php
use Windwalker\Renderer\PhpRenderer;

$config = array();

$renderer = new PhpRenderer(__DIR__ . '/file/path', $config);

$data = array('title' => 'foo');

echo $renderer->render('template', $data);
```

### In `template.php`

This is a simple php engine to help us render template.

``` php
<h1><?php echo $this->escape($title); ?></h1>
```

### Include Sub Template

Use `load()` to load other template file as a block. The first argument is file path, the second argument is new data
to merge with original data.

``` php
echo $this->load('sub.template', array('bar' => 'baz'));
```

Example to load `foo/article.php`:

``` php
<h1><?php echo $this->escape($title); ?></h1>

<?php foreach ($data->articles as $article): ?>
    <?php echo $this->load('foo.article', array('bar' => 'baz')); ?>
<?php endforeach; ?>
```

### Extends Parent Template

In Windwalker Renderer, there is a powerful function like Twig or Blade, we provide `extend()` method to extends
parent template. (`extends` in php is a reserved string, so we can only use `extend`)

For example, this is the parent `_global/html.php` template:

``` php
<Doctype html>
<html>
<head>
    <title><?php $this->block('title');?>Home<?php $this->endblock(); ?></title>
</head>
<body>
    <div class="container">
    <?php $this->block('body');?>
        <h2>Home page</h2>
    <?php $this->endblock(); ?>
    </div>
</body>
</html>
```

And we can extends it in our View:

``` php
<?php
$this->extend('_global.html');
?>

<?php $this->block('title');?>Article<?php $this->endblock(); ?>

<?php $this->block('body');?>
    <article>
        <h2>Article</h2>
        <p>FOO</p>
    </article>
<?php $this->endblock(); ?>
```

The result will be:

``` html
<Doctype html>
<html>
<head>
    <title>Article</title>
</head>
<body>
    <div class="container">
        <article>
            <h2>Article</h2>
            <p>FOO</p>
        </article>
    </div>
</body>
</html>
```

### Show Parent

We can echo parent data in a block:

``` php
<?php $this->block('body');?>
    <?php echo $this->parent(); ?>
    <article>
        <h2>Article</h2>
        <p>FOO</p>
    </article>
<?php $this->endblock(); ?>
```

Result:

``` html
<h2>Home page</h2>
<article>
    <h2>Article</h2>
    <p>FOO</p>
</article>
```

## Add More Paths to Search

We create 3 paths by `SplPriorityQueue`, that make theme path is priority to others, so we can override view templates
 by theme, and view can also override system template.


``` php
$paths = new \SplPriorityQueue;

$paths->insert('path/to/system', 100);
$paths->insert('path/to/view', 200);
$paths->insert('path/to/theme', 300);

$renderer = new PhpRenderer($paths);

$renderer->render('foo', $data);
```

## Twig Renderer

[Twig](http://twig.sensiolabs.org/) Renderer help us render files by twig engine.

``` php
use Windwalker\Renderer\TwigRenderer;

$renderer = new TwigRenderer($paths);

$renderer->render('foo', $data);
```

### Set custom Twig instance or Loader.

``` php
$renderer->setEngine(new \Twig_Environment);
$renderer->setLoader(new MyTwigLoader);
```

### Add Twig Extensions

``` php
$renderer->addExtension(new MyTwigExtension);
```

### Debug Mode

Set debug config when construct:

``` php
$renderer = new TwigRenderer($paths, array('debug' => true));
```

## Blade Renderer

Blade is a powerful php template engine which created by Laravel. We integrate it in our Renderer that eveyone can use it without Laravel.

Add this line to your composer require block and run `composer update`:

``` json
"illuminate/view" : "4.*"
```

Create Blade Renderer:

``` php
use Windwalker\Renderer\BladeRenderer;

$renderer = new BladeRenderer($paths, array('cache_path' => __DIR__ . '/cache'));

$renderer->render('foo', $data);
```

The file name must suffix with `.blade.php`.

### Add Custom Compilers

``` php
$renderer = new BladeRenderer($paths, array('cache_path' => __DIR__ . '/cache'));

$renderer->addCustomCompiler('datetime', function($expression)
{
    return "<?php echo with{$expression}->format('m/d/Y H:i'); ?>";
});
```

More about Blade engine please see [Laravel Document](http://laravel.com/docs/4.2/templates#blade-templating).

## Edge Renderer

Edge is a Blade compatible template engine which created to support Windwalker itself.

``` php
$renderer = new EdgeRenderer;

// Ad custom extensions
$renderer->addExtension(new MyEdgeExtension);

echo $renderer->render('layout.main', $data);
```

Cache files:

``` php
$renderer = new EdgeRenderer($paths, array('cache_path' => __DIR__ . '/cache'));
echo $renderer->render('layout.main', $data);
```

See [Windwalker Edge](https://github.com/ventoviro/windwalker-edge)

## Mustache Renderer

We also provide [Mustache](http://mustache.github.io/) Renderer.

Add this line to your composer require block and run `composer update`:

``` json
"mustache/mustache" : "2.*"
```

Create Mustache Renderer:

``` php
use Windwalker\Renderer\MustacheRenderer;

class Chris
{
	public $name  = "Chris";
	public $value = 10000;

	public function taxed_value()
	{
		return $this->value - ($this->value * 0.4);
	}

	public $in_ca = true;
}

$renderer = new MustacheRenderer($paths);

$renderer->render('foo', new Chris)
```

The file is `foo.mustache`:

``` mustache
Hello {{name}}
You have just won ${{value}}!
{{#in_ca}}
Well, ${{taxed_value}}, after taxes.
{{/in_ca}}
```

Abd the output:

``` html
Hello Chris
You have just won $10000!
Well, $6000, after taxes.
```

### Loader

``` php
$renderer->setLoader(new \Mustache_Loader_FilesystemLoader($path, $options));
```

### Config

We can change the file extension name and many other configs, please see [Mustache PHP Document](https://github.com/bobthecow/mustache.php/wiki).

## Plates Renderer

``` php
use Windwalker\Renderer\PlatesRenderer;

$renderer = new PlatesRenderer;

echo $renderer->render('flower.sakura', array('foo' => 'bar'));
```

See: [Plates](http://platesphp.com/)

## Use Cases

Renderer has many use cases, one of often usage is that integrating it with view object as engine and loader.

``` php
class View
{
    public function __construct($data = array(), RendererInterface $renderer = null)
    {
        $this->data = $data;
        $this->renderer = $renderer ? : new PhpRenderer;
    }

    public function render($layout)
    {
        // Do some stuff...

        return $this->renderer->render($layout, $this->data);
    }
}
```

Or be a layout widget:

``` php
class Widget extends PhpRenderer
{
    public function __construct($config = array())
    {
        $paths = array(
            'path/of/theme/widget',
            'path/of/system/widget'
        );

        parent::__construct($paths, $config);
    }
}

// Call this class everywhere
echo (new Widget)->render('foo', array('bar' => 'baz'));
```
