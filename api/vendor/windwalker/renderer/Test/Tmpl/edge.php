<?php declare(strict_types=1);
/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    GNU General Public License version 2 or later.
 */

use Windwalker\Edge\Cache\EdgeArrayCache;
use Windwalker\Edge\Compiler\EdgeCompiler;

include_once __DIR__ . '/../../../../vendor/autoload.php';

ini_set('memory_limit', '128M');

$finder = new \Windwalker\Edge\Loader\EdgeFileLoader();

$finder->addPath(__DIR__ . '/edge');

$edge = new \Windwalker\Edge\Edge($finder, new EdgeCompiler(), new EdgeArrayCache());

//$edge->addExtension(new \Windwalker\Edge\Extension\BasicExtension);

echo $edge->render('hello');
