<?php
/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;
use Laravel\Passport\RouteRegistrar;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\ModelBasice' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        if (config('passport.hash_client_secrets')) {
            Passport::hashClientSecrets();
        }
        Passport::routes(function (RouteRegistrar $router) {
            //配置开放路由
            $router->forAccessTokens();
        }, ['prefix' => 'api']);
        // token失效时间
        Passport::tokensExpireIn(now()->addSeconds(config('passport.expires_in')));
        Passport::refreshTokensExpireIn(now()->addSeconds(config('passport.refresh_expires_in')));
    }
}
