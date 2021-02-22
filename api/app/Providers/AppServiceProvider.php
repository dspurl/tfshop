<?php
namespace App\Providers;
use App\Models\v1\GoodIndent;
use App\Models\v1\User;
use App\Observers\GoodIndent\CreateIndentCommodityObserver;
use App\Observers\GoodIndent\CreateIndentLocationObserver;
use App\Observers\GoodIndent\EscrowRefundObserver;
use App\Observers\GoodIndent\FinishPaymentMoneyLogObserver;
use App\Observers\GoodIndent\FinishPaymentNotificationObserver;
use App\Observers\GoodIndent\IndentCancelStockProcessingObserver;
use App\Observers\GoodIndent\ReceiptNotificationObserver;
use App\Observers\GoodIndent\RefundNotificationObserver;
use App\Observers\GoodIndent\ShipmentNotificationObserver;
use App\Observers\User\UserLogObserver;
use App\Observers\User\UserRegisterNotificationObserver;
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
        GoodIndent::observe(FinishPaymentNotificationObserver::class);
        GoodIndent::observe(FinishPaymentMoneyLogObserver::class);
        GoodIndent::observe(IndentCancelStockProcessingObserver::class);
        GoodIndent::observe(CreateIndentCommodityObserver::class);
        GoodIndent::observe(CreateIndentLocationObserver::class);
        GoodIndent::observe(ShipmentNotificationObserver::class);
        GoodIndent::observe(RefundNotificationObserver::class);
        GoodIndent::observe(EscrowRefundObserver::class);
        // 插件
    }
}
