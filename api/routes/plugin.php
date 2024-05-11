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
//如果有版本控制的话，请复制以下代码，修改版本号;访问地址把v1换成设置的版本号即可
Route::prefix('v'.config('tfshop.versions'))->namespace('v'.config('tfshop.versions'))->group(function () {
    // 插件
    Route::namespace('Plugin')->group(function () {
        // 插件后台
        Route::prefix('admin')->namespace('Admin')->middleware(['auth:api'])->group(function () {
            // 前台插件列表
        });
        // 插件前台
        Route::prefix('app')->namespace('Client')->middleware(['appverify', 'auth:web'])->group(function () {
            // APP验证插件列表
        });
        Route::prefix('app')->namespace('Client')->middleware(['appverify'])->group(function () {
            // APP无需验证插件列表
        });
    });
});
