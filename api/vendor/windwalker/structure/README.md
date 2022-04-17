# Windwalker Structure

Windwalker Structure is a storage of nested array or object, help us manage multi-level structures data.

## Installation via Composer

Add this to the require block in your `composer.json`.

``` json
{
    "require": {
        "windwalker/structure": "~3.0"
    }
}
```

## Supported Formats

- JSON
- PHP file (return array or class)
- JSON
- [HJSON](https://hjson.org/)
- YAML
- [TOML](https://github.com/toml-lang/toml)
- XML
- INI

## Getting Started

``` php
use Windwalker\Structure\Structure;

$structure = new Structure;

// Set a value in the structure.
$structure->set('foo', 'bar');

// Get a value from the structure;
$value = $structure->get('foo');

```

## Load config by Structure

``` php
use Windwalker\Structure\Structure;

$structure = new Structure;

// Load by string
$structure->loadString('{"foo" : "bar"}');

$structure->loadString('<root></root>', 'xml');

// Load by object or array
$structure->load($object);

// Load by file
$structure->loadFile($root . '/config/config.json', 'json');
```

## Accessing a Structure by getter & setter

### Get value

``` php
$structure->get('foo');

// Get a non-exists value and return default
$structure->get('foo', 'default');

// OR

$structure->get('foo') ?: 'default';
```

### Set value

``` php
// Set value
$structure->set('bar', $value);

// Sets a default value if not already assigned.
$structure->def('bar', $default);
```

### Accessing children value by path

``` php
$json = '{
	"parent" : {
		"child" : "Foo"
	}
}';

$structure = new Structure($json);

$structure->get('parent.child'); // return 'Foo'

$structure->set('parent.child', $value);
```

### Append & Prepend

Support `push / pop / shift / unshift` methods.

``` php
$structure->set('foo.bar', array('fisrt', 'second'));

$structure->push('foo.bar', 'third');

$structure->get('foo.bar');
// Result: Array(first, second, third)
```

### Use other separator

``` php
$structure->setSeparator('/');

$data = $structure->get('foo/bar');
```

## Accessing a Structure as an Array

The `Structure` class implements `ArrayAccess` so the properties of the structure can be accessed as an array. Consider the following examples:

``` php
// Set a value in the structure.
$structure['foo'] = 'bar';

// Get a value from the structure;
$value = $structure['foo'];

// Check if a key in the structure is set.
if (isset($structure['foo']))
{
	echo 'Say bar.';
}
```

## Merge Structure

#### Using load* methods to merge two config files.

``` php
$json1 = '{
    "field" : {
        "keyA" : "valueA",
        "keyB" : "valueB"
    }
}';

$json2 = '{
    "field" : {
        "keyB" : "a new valueB"
    }
}';

$structure->loadString($json1);
$structure->loadString($json2);
```

Output

```
Array(
    field => Array(
        keyA => valueA
        keyB => a new valueB
    )
)
```

#### Merge Another Structure

``` php
$object1 = '{
	"foo" : "foo value",
	"bar" : {
		"bar1" : "bar value 1",
		"bar2" : "bar value 2"
	}
}';

$object2 = '{
	"foo" : "foo value",
	"bar" : {
		"bar2" : "new bar value 2"
	}
}';

$structure1 = new Structure(json_decode($object1));
$structure2 = new Structure(json_decode($object2));

$structure1->merge($structure2);
```

If you just want to merge first level, do not hope recursive:

``` php
$structure1->merge($structure2, false); // Set param 2 to false that Structure will only merge first level
```

Merge to a child node:

``` php
$structure->mergeTo('foo.bar', $anotherStructure);
```

## Dump to file.

``` php
$structure->toString();

$structure->toString('xml');

$structure->toString('ini');
```

## Dump to one dimension

``` php
$array = array(
    'flower' => array(
        'sunflower' => 'light',
        'sakura' => 'samurai'
    )
);

$structure = new Structure($array);

// Make data to one dimension

$flatted = $structure->flatten();

print_r($flatted);
```

The result:

```
Array
(
    [flower.sunflower] => light
    [flower.sakura] => samurai
)
```

## Using YAML

Add Symfony YAML component in `composer.json`

``` json
{
	"require-dev": {
		"symfony/yaml": "^4.0||^5.0"
	}
}
```

Using `yaml` format

``` php
$structure->loadFile($yamlFile, 'yaml');

$structure->loadString('foo: bar', 'yaml');

// Convert to string
$structure->toString('yaml');
```

## StructureHelper

``` php
use Windwalker\Structure\StructureHelper;

StructureHelper::loadFaile($file, $format); // File to array
StructureHelper::loadString($string, $format); // String to array
StructureHelper::toString($array, $format); // Array to string

// Use format class
$json = StructureHelper::getFormatClass('json'); // Get JsonFormat
$string = $json::structToString($array);
```
