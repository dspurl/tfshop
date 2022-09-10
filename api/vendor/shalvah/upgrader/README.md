# Upgrader

[![Latest Stable Version](https://poser.pugx.org/shalvah/upgrader/v/stable)](https://packagist.org/packages/shalvah/upgrader) [![Total Downloads](https://poser.pugx.org/shalvah/upgrader/downloads)](https://packagist.org/packages/shalvah/upgrader)

Releasing a new version of your PHP library with changes to the config file? Use this tool to offer an automated upgrade process to your users. Used in [Scribe v3](https://scribe.knuckles.wtf/laravel/migrating-v3).

Give `Upgrader` a sample of your new config file, and the path to the user's old config file, and it'll figure out what's been added or removed in the new version. You can also tell it to move/rename certain fields or ignore others.

```php
// Create a CLI `upgrade` command, where you call Upgrader

// Relative path to the config file in the user's project
$userOldConfigFile = 'config/my_library.php'; 
// Absolute path to a sample of the new config in your project
$sampleNewConfigFile = __DIR__ . '/../../config/my_library.php';

$upgrader = Upgrader::ofConfigFile($userOldConfigFile, $sampleNewConfigFile)
  ->move('path', 'static.path')
  ->dontTouch('ip_addresses');
   
   // If this is a dry run, print the expected changes
   if ($this->option('dry-run')) {
     $changes = $upgrader->dryRun();
     if (empty($changes)) {
       $this->info("No changes needed! Looks like you're all set.");
       return;
     }
     
     $this->info('The following changes will be made to your config file:');
     
     foreach ($changes as $change) {
       $this->info($change["description"]);
     }
     
     return;
}

// Otherwise, run the upgrade 🚀
$upgrader->upgrade();
```

Upgrader:
- Comes with "dry run" functionality, so you can review expected changes.
- Will back up the user's old config file to `{$file}.bak` so you can revert if you need to.
- Supports keys as dot notation

Upgrader is still early days (0.x), with more robust features and docs planned. Read how I built it [here](https://blog.shalvah.me/posts/implementing-programmatic-file-transformations-in-php).

## Installation
PHP 7.4+ is required.

```bash
composer require shalvah/upgrader
```