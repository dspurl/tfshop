# Clara 🔊
[![image](http://img.shields.io/packagist/v/shalvah/clara.svg?style=flat)](https://packagist.org/packages/shalvah/clara) [![Total Downloads](https://poser.pugx.org/shalvah/clara/downloads)](https://packagist.org/packages/shalvah/clara) [![Build Status](https://travis-ci.com/shalvah/clara.svg?branch=master)](https://travis-ci.com/shalvah/clara)

Simple, pretty, testable console output for PHP CLI apps. (Used in [Scribe](http://scribe.knuckles.wtf/laravel).)

Features:
- Colours and emoji to distinguish between log types
- Two different output modes, depending on how much colour you want
- Automatically hide/show debug output
- Can capture console output for easy testing—no need for mocks
- Customizable colour palette

<p align="center">

<img alt="Icons mode" src="./screenshot-icons.png">
</p>

<p align="center">
<em>Icons mode</em>
</p>

<p align="center">
<img alt="Labels mode" src="./screenshot-labels.png" >
</p>

<p align="center">
<em>Labels mode</em>
</p>


## Installation
(PHP 7.4+)

```bash
composer require shalvah/clara
```

## Using Clara

```php
$output = clara('myappname');

$output->info("Installing package");
$output->debug("Attempt 3 of 5");
$output->warn("The file does not exist.");
$output->error("Something went wrong!");
$output->success("Done. Go and be awesome.");
```

### Picking a mode
By default, Clara uses "icons" mode—the output is coloured differently by output type and an emoji is added (as in the first screenshot above). If you prefer, you can switch to "labels" mode:

```php
$output = clara('myappname', \Shalvah\Clara\Clara::MODE_LABELS);
// The default
$output = clara('myappname', \Shalvah\Clara\Clara::MODE_ICONS);
```

In labels mode, (the second screenshot above), the emojis are still present, but the output types are written out, and the main output message is not coloured.

### Disabling colours and emojis
If you'd like to output a line of text without the extra formatting provided by the functions above, you can use the `->line()` method instead.

### Customising the colour palette
You can also customise the colours Clara uses for each type, by passing in an array as the third argument, containing your preferred colours:

```php
$output = clara('myappname', \Shalvah\Clara\Clara::MODE_ICONS, [
    'info' => 'blue',
]);
```

See [the Symfony docs](https://symfony.com/doc/current/console/coloring.html) for details about supported colours.


## Toggling debug output
It's common practice to include a verbose flag (`--verbose`) in your CLI app that lets you show additional (debug) output to the user. With Clara, you can easily enable or disable debug logging: 

```php
$isVerbose = $this->getFlag('verbose');

// If $isVerbose is true,
// Clara won't print or capture any debug logs
$app1 = clara('app1')->showDebugOutput($isVerbose); 
$app1->debug("App 1 - Output 1");

// You can also toggle debug output manually
$app1->hideDebugOutput();
$app1->debug("App 1 - Output 2");

$app1->showDebugOutput();
$app1->debug("App 1 - Output 3");
```

Note that by default, Clara will show all output.

## Muting output
Sometimes when running your app's tests, you don't want to clutter your console with the output messages. You can turn off Clara's output by using the `mute()` and `unmute` static methods. To mute or unmute a specific app, pass in the app name.

```php
$output1 = clara('myapp1');
$output2 = clara('myapp2');

// Mute only output from "myapp1"
Clara::mute('myapp1');
// Won't be printed.
$output1->info("Installing package");

// Will be printed
$output2->info("Installing package");

Clara::mute(); // Mute all apps
Clara::unmute("myapp1"); // Unmute myapp1
Clara::unmute(); // Unmute all apps
```

## Showing only your app's output. 
Imagine your app includes another app that uses Clara. By default, the output from all apps will be shown. You can turn off output for all apps but yours by calling `->only()`.

```php
// SHow only output from mymainapp
$output1 = clara('mymainapp')->only();

// This is equivalent to doing:
Clara::mute();
Clara::unmute('yourappname');
```

## Capturing the output
Sometimes you need to assert that your app printed what you expect. An easy way is to use output capturing.

```php
Clara::startCapturingOutput('myapp1'); // Clara will start capturing output from myapp1
$output1 = clara('myapp1');
$output1->warn("Going to fail");
$output1->error("Failed");

$capturedOutput = Clara::getCapturedOutput('myapp1');
// $capturedOutput = [
//   "⚠ <fg=yellow>Going to fail</>",
//   "✖ <fg=red>Failed</>",
// ]

Clara::stopCapturingOutput('myapp1');
Clara::clearCapturedOutput('myapp1'); // Will empty saved output
``` 

You can reset the entire state of Clara to default by calling `Clara::reset()`. This will clear captured output, stop capturing for all apps and unmute all apps.

## Setting an output channel
By default, Clara outputs to the console, but you can actually output to somewhere else. This is helpful if you're writing a Laravel Artisan command and want to use Clara for output while still capturing the output via Artisan's `->output()` method. All you need to do is call `useOutput` with an instance of `Symfony\Component\Console\Output\OutputInterface` (for Artisan classes, it's `$this->output`).

```php

$this->clara = clara('myapp'
  ->showDebugOutput($this->option('verbose'))
  ->useOutput($this->output)
  ->only();
```
