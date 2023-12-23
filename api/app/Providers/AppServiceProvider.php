<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Providers;
use App\Models\v1\GoodIndent;
use App\Models\v1\PaymentLog;
use App\Models\v1\User;
use App\Observers\GoodIndent\ConfirmReceiptSalesProcessingObserver;
use App\Observers\GoodIndent\CreateIndentCommodityObserver;
use App\Observers\GoodIndent\CreateIndentLocationObserver;
use App\Observers\GoodIndent\EscrowRefundObserver;
use App\Observers\GoodIndent\FinishPaymentMoneyLogObserver;
use App\Observers\GoodIndent\FinishPaymentNotificationObserver;
use App\Observers\GoodIndent\IndentCancelStockProcessingObserver;
use App\Observers\GoodIndent\IndentFailureStockProcessingObserver;
use App\Observers\GoodIndent\OrderCompletionOfGoodsCardProcessingObserver;
use App\Observers\GoodIndent\ReceiptNotificationObserver;
use App\Observers\GoodIndent\RefundNotificationObserver;
use App\Observers\GoodIndent\ShipmentNotificationObserver;
use App\Observers\PaymentLog\GoodIndentPaymentCreateObserver;
use App\Observers\PaymentLog\GoodIndentPaymentSucceedObserver;
use App\Observers\PaymentLog\GoodIndentRefundObserver;
use App\Observers\User\UserLogObserver;
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
        GoodIndent::observe(ReceiptNotificationObserver::class);
        GoodIndent::observe(FinishPaymentNotificationObserver::class);
        GoodIndent::observe(FinishPaymentMoneyLogObserver::class);
        GoodIndent::observe(IndentCancelStockProcessingObserver::class);
        GoodIndent::observe(IndentFailureStockProcessingObserver::class);
        GoodIndent::observe(CreateIndentCommodityObserver::class);
        GoodIndent::observe(CreateIndentLocationObserver::class);
        GoodIndent::observe(ShipmentNotificationObserver::class);
        GoodIndent::observe(RefundNotificationObserver::class);
        GoodIndent::observe(EscrowRefundObserver::class);
        GoodIndent::observe(ConfirmReceiptSalesProcessingObserver::class);
        GoodIndent::observe(OrderCompletionOfGoodsCardProcessingObserver::class);
        PaymentLog::observe(GoodIndentPaymentCreateObserver::class);
        PaymentLog::observe(GoodIndentPaymentSucceedObserver::class);
        PaymentLog::observe(GoodIndentRefundObserver::class);
        // 插件
    }
}
