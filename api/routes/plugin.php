<?php
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//如果有版本控制的话，请复制以下代码，修改版本号;访问地址把v1换成设置的版本号即可
Route::prefix('v'.config('dsshop.versions'))->namespace('v'.config('dsshop.versions'))->group(function () {
    // 插件
    Route::namespace('Plugin')->group(function () {
        // 插件后台
        Route::prefix('admin')->namespace('Admin')->middleware(['auth:api'])->group(function () {
        //前台插件列表
        });
        // 插件前台
        Route::prefix('app')->namespace('Client')->middleware(['appverify', 'auth:web'])->group(function () {
        //APP验证插件列表
        });
        Route::prefix('app')->namespace('Client')->middleware(['appverify'])->group(function () {
            //APP无需验证插件列表
        });
    });
});
