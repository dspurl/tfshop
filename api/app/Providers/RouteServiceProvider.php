<?php

namespace App\Providers;

use App\common\Plugin;
use App\common\RedisService;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     * @throws \Exception
     */
    public function map()
    {
//        $this->mapApiRoutes();
        $this->down();
        $this->cpy();
        $this->mapAdminRoutes();
        $this->mapAppRoutes();
        $this->mapPluginRoutes();
        $this->mapWebRoutes();
        Route::post('/oauth/token', [
            'uses' => '\Laravel\Passport\Http\Controllers\AccessTokenController@issueToken',
            'middleware' => 'throttle:600,1',
        ]);

    }

    /**
     * 维护拦截
     * @throws \Exception
     */
    protected function down()
    {
        if (config('dsshop.down')) {
            throw new \Exception('维护中', Response::HTTP_SERVICE_UNAVAILABLE);
        }
    }

    protected function cpy()
    {
        if (isset($_SERVER["HTTP_HOST"])) {
            $redis = new RedisService();
            $name = config('dsshop.marketApplySecret') . '.' . (new Controller())->getTopHost((new Controller())->scheme() . $_SERVER['HTTP_HOST']);
            $t = $redis->get($name) ? $redis->get($name) : 0;
            if ((new Plugin())->installList()->count() > 0) {
                if (!$redis->get($name . '.result') && time() > $t) {
                    $client = new Client();
                    $url = config('dsshop.marketUrl') . '/api/v1/app/market/authorization';
                    $respond = $client->post($url, ['form_params' => [
                        'domain' => (new Controller())->getTopHost((new Controller())->scheme() . $_SERVER['HTTP_HOST']),
                        'secret' => config('dsshop.marketApplicationSecret')
                    ]]);
                    $data = json_decode($respond->getBody()->getContents(), true);
                    if ($data['message'] == 1) {
                        $redis->set($name . '.result', 1);
                        $redis->set($name, time() + 2592000);
                    } else {
                        $redis->set($name . '.result', -1);
                        $redis->set($name, time() + 3600);
                    }
                }
            }
        }
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php'));
    }

    protected function mapAdminRoutes()
    {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/admin.php'));
    }

    protected function mapAppRoutes()
    {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/app.php'));
    }

    protected function mapPluginRoutes()
    {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/plugin.php'));
    }
}
