<?php

namespace Qbhy\TtMicroApp;

use Illuminate\Support\ServiceProvider;
use Laravel\Lumen\Application;

/**
 * Class LaravelServiceProvider
 *
 * @author  qbhy <96qbhy@gmail.com>
 *
 * @package Qbhy\BaiduAIP
 */
class LaravelServiceProvider extends ServiceProvider
{
    /**
     * Setup the config.
     */
    protected function setupConfig()
    {
        $source = dirname(__DIR__).'/config/tt-app.php';
        if ($this->app->runningInConsole()) {
            $this->publishes([$source => base_path('config/tt-app.php')], 'tt-app');
        }

        if ($this->app instanceof Application) {
            $this->app->configure('tt-app');
        }

        $this->mergeConfigFrom($source, 'tt-app');
    }

    public function register()
    {
        $this->setupConfig();

        $this->app->singleton(TtMicroApp::class, function ($app) {
            return app(Factory::class)->make();
        });

        $this->app->singleton(Factory::class, function ($app) {
            return new Factory(config('tt-app'));
        });

        $this->app->alias(Factory::class, 'tt.factory');
        $this->app->alias(TtMicroApp::class, 'tt.app');
    }
}