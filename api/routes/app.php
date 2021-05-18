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
    // 无需任何验证
    Route::prefix('app')->namespace('Client')->group(function () {
        Route::any('serve', 'AppController@serve');    //处理应用的请求消息
        Route::any('paymentNotify', 'AppController@paymentNotify');    //支付回调
        Route::any('refundNotify', 'AppController@refundNotify');    //退款回调
    });
    // 需要secret验证
    Route::prefix('app')->namespace('Client')->middleware(['appverify'])->group(function () {
        Route::post('uploadPictures', 'AppController@uploadPictures');  //上传
        Route::post('cellphoneCode', 'AppController@cellphoneCode');    //获取手机验证码
        Route::post('emailCode', 'AppController@emailCode');    //获取邮箱验证码
        Route::post('login', 'LoginController@login');    //登录
        Route::post('register', 'LoginController@register');    //注册
        Route::post('findPassword', 'LoginController@findPassword');    //找回密码
        Route::post('miniLogin', 'LoginController@miniLogin');    //小程序换取openid
        Route::post('authorization', 'LoginController@authorization');    //授权登录
        Route::post('verifyEmail', 'AppController@verifyEmail');    //绑定邮箱
        Route::post('user/notification', 'UserController@notification');    //更新通知状态
        Route::get('good', 'GoodController@list');    //商品列表
        Route::get('good/{id}', 'GoodController@detail');    //商品详情
        Route::get('goodCategory', 'GoodController@category');    //商品分类展示
        Route::get('banner', 'BannerController@list');    //轮播列表
    });
    // 需要用户登录验证
    Route::prefix('app')->namespace('Client')->middleware(['appverify', 'auth:web'])->group(function () {
        Route::post('logout', 'LoginController@logout');    //登出
        Route::get('user', 'UserController@detail');    //用户信息
        Route::post('user', 'UserController@edit');    //保存用户信息
        Route::post('cancel', 'UserController@cancel');    //注销账号
        Route::get('moneyLog', 'MoneyLogController@list');    //收支列表
        Route::get('moneyLog/{id}', 'MoneyLogController@detail');    //收支详情
        Route::post('unifiedPayment', 'AppController@unifiedPayment');    //在线支付
        Route::post('balancePay', 'AppController@balancePay');    //余额支付
        Route::get('goodIndent', 'GoodIndentController@list');    //订单列表
        Route::post('goodIndent', 'GoodIndentController@create');    //创建订单
        Route::post('goodIndent/addShoppingCart', 'GoodIndentController@addShoppingCart');    //添加到购物车
        Route::post('goodIndent/clearShoppingCart', 'GoodIndentController@clearShoppingCart');    //清空购物车

        Route::get('goodIndent/detail/{id}', 'GoodIndentController@detail');    //订单详情
        Route::post('goodIndent/synchronizationInventory', 'GoodIndentController@synchronizationInventory');    //同步线上商品库存
        Route::get('goodIndent/pay/{id}', 'GoodIndentController@pay');    //支付订单详情
        Route::post('goodIndent/receipt/{id}', 'GoodIndentController@receipt');    //确认收货
        Route::post('goodIndent/cancel/{id}', 'GoodIndentController@cancel');    //取消订单
        Route::post('goodIndent/destroy/{id}', 'GoodIndentController@destroy');    //删除订单
        Route::get('goodIndent/quantity', 'GoodIndentController@quantity');    //订单数量统计
        Route::get('shipping', 'ShippingController@list');    //收货地址列表
        Route::post('shipping', 'ShippingController@create');    //创建收货地址
        Route::post('shipping/{id}', 'ShippingController@edit');    //保存收货地址
        Route::post('shipping/freight/{id}', 'ShippingController@freight');    //获取运费
        Route::post('shipping/destroy/{id}', 'ShippingController@destroy');    //删除收货地址
        Route::post('shipping/default/set', 'ShippingController@defaultSet');    //设为默认
        Route::get('browse', 'BrowseController@list');    //浏览记录列表
        Route::post('browse', 'BrowseController@create');    //创建浏览记录
        Route::get('collect', 'CollectController@list');   //收藏列表
        Route::get('collect/{id}', 'CollectController@detail');   //收藏详情
        Route::post('collect', 'CollectController@create');  //创建收藏
        Route::post('collect/destroy/{id}', 'CollectController@destroy'); //删除收藏
        Route::get('notification', 'NotificationController@list');    //列表
        Route::get('notification/unread', 'NotificationController@unread');    //未读数量
        Route::post('notification/destroy/{id}', 'NotificationController@destroy');    //删除通知
        Route::post('notification/read/{id}', 'NotificationController@read');    //标记为已读
        Route::get('notification/detail/{id}', 'NotificationController@detail');    //通知详情
        Route::post('changeCellphone', 'AppController@changeCellphone');    //更换手机号
        Route::post('amendPassword', 'LoginController@amendPassword');    //修改密码
    });
});
