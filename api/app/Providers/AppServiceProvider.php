<?php

namespace App\Providers;

use App\Models\v1\GoodIndent;
use App\Models\v1\User;
use App\Observers\ReceiptNotificationObserver;
use App\Observers\UserLogObserver;
use App\Observers\UserRegisterNotificationObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {

        Schema::defaultStringLength(191);
        User::observe(UserLogObserver::class);
        User::observe(UserRegisterNotificationObserver::class);
        GoodIndent::observe(ReceiptNotificationObserver::class);
    }
}
