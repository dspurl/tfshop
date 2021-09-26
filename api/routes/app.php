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
        Route::any('serve', 'AppController@serve')->name('client.serve');    //处理应用的请求消息
        Route::any('paymentNotify', 'AppController@paymentNotify')->name('client.paymentNotify');    //支付回调
        Route::any('refundNotify', 'AppController@refundNotify')->name('client.refundNotify');    //退款回调
        Route::post('refreshToken', 'LoginController@refresh')->name('client.refreshToken');  //刷新token
    });
    // 需要secret验证
    Route::prefix('app')->namespace('Client')->middleware(['appverify'])->group(function () {
        Route::post('uploadPictures', 'AppController@uploadPictures')->name('client.uploadPictures');  //上传
        Route::post('cellphoneCode', 'AppController@cellphoneCode')->name('client.cellphoneCode');    //获取手机验证码
        Route::post('emailCode', 'AppController@emailCode')->name('client.emailCode');    //获取邮箱验证码
        Route::post('login', 'LoginController@login')->name('client.login');    //登录

        Route::post('register', 'LoginController@register')->name('client.register');    //注册
        Route::post('findPassword', 'LoginController@findPassword')->name('client.findPassword');    //找回密码
        Route::post('miniLogin', 'LoginController@miniLogin')->name('client.miniLogin');    //小程序换取openid
        Route::post('authorization', 'LoginController@authorization')->name('client.authorization');    //授权登录
        Route::post('verifyEmail', 'AppController@verifyEmail')->name('client.verifyEmail');    //绑定邮箱
        Route::post('user/notification', 'UserController@notification')->name('client.notification');    //更新通知状态
        Route::get('good', 'GoodController@list')->name('client.goodList');    //商品列表
        Route::get('good/{id}', 'GoodController@detail')->name('client.goodDetail');    //商品详情
        Route::get('goodCategory', 'GoodController@category')->name('client.goodCategory');    //商品分类展示
        Route::get('banner', 'BannerController@list')->name('client.bannerList');    //轮播列表
    });
    // 需要用户登录验证
    Route::prefix('app')->namespace('Client')->middleware(['appverify', 'auth:web'])->group(function () {
        Route::post('logout', 'LoginController@logout')->name('client.logout');    //登出
        Route::get('user', 'UserController@detail')->name('client.userinfo');    //用户信息
        Route::post('user', 'UserController@edit')->name('client.userinfoEdit');    //保存用户信息
        Route::post('cancel', 'UserController@cancel')->name('client.userCancel');    //注销账号
        Route::get('moneyLog', 'MoneyLogController@list')->name('client.paymentList');    //收支列表
        Route::get('moneyLog/{id}', 'MoneyLogController@detail')->name('client.paymentDetail');    //收支详情
        Route::post('unifiedPayment', 'AppController@unifiedPayment')->name('client.unifiedPayment');    //在线支付
        Route::post('balancePay', 'AppController@balancePay')->name('client.balancePay');    //余额支付
        Route::get('goodIndent', 'GoodIndentController@list')->name('client.orderList');    //订单列表
        Route::post('goodIndent', 'GoodIndentController@create')->name('client.orderCreate');    //创建订单
        Route::post('goodIndent/addShoppingCart', 'GoodIndentController@addShoppingCart')->name('client.addShoppingCart');    //添加到购物车
        Route::post('goodIndent/clearShoppingCart', 'GoodIndentController@clearShoppingCart')->name('client.clearShoppingCart');    //清空购物车

        Route::get('goodIndent/detail/{id}', 'GoodIndentController@detail')->name('client.orderDetail');    //订单详情
        Route::post('goodIndent/synchronizationInventory', 'GoodIndentController@synchronizationInventory')->name('client.synchronizationInventory');    //同步线上商品库存
        Route::get('goodIndent/pay/{id}', 'GoodIndentController@pay')->name('client.payOrderList');    //支付订单详情
        Route::post('goodIndent/receipt/{id}', 'GoodIndentController@receipt')->name('client.confirmReceipt');    //确认收货
        Route::post('goodIndent/cancel/{id}', 'GoodIndentController@cancel')->name('client.orderCancel');    //取消订单
        Route::post('goodIndent/destroy/{id}', 'GoodIndentController@destroy')->name('client.orderDestroy');    //删除订单
        Route::get('goodIndent/quantity', 'GoodIndentController@quantity')->name('client.orderQuantity');    //订单数量统计
        Route::get('shipping', 'ShippingController@list')->name('client.shippingList');    //收货地址列表
        Route::post('shipping', 'ShippingController@create')->name('client.shippingCreate');    //创建收货地址
        Route::post('shipping/{id}', 'ShippingController@edit')->name('client.shippingEdit');    //保存收货地址
        Route::post('shipping/freight/{id}', 'ShippingController@freight')->name('client.shippingFreight');    //获取运费
        Route::post('shipping/destroy/{id}', 'ShippingController@destroy')->name('client.shippingDestroy');    //删除收货地址
        Route::post('shipping/default/set', 'ShippingController@defaultSet')->name('client.shippingDefaultSet');    //设为默认
        Route::get('browse', 'BrowseController@list')->name('client.browseList');    //浏览记录列表
        Route::post('browse', 'BrowseController@create')->name('client.browseCreate');    //创建浏览记录
        Route::get('collect', 'CollectController@list')->name('client.collectList');   //收藏列表
        Route::get('collect/{id}', 'CollectController@detail')->name('client.collectDetail');   //收藏详情
        Route::post('collect', 'CollectController@create')->name('client.collectCreate');  //创建收藏
        Route::post('collect/destroy/{id}', 'CollectController@destroy')->name('client.collectDestroy'); //删除收藏
        Route::get('notification', 'NotificationController@list')->name('client.notificationList');    //通知列表
        Route::get('notification/unread', 'NotificationController@unread')->name('client.notificationUnread');    //未读数量
        Route::post('notification/destroy/{id}', 'NotificationController@destroy')->name('client.notificationDestroy');    //删除通知
        Route::post('notification/read/{id}', 'NotificationController@read')->name('client.notificationRead');    //标记为已读
        Route::get('notification/detail/{id}', 'NotificationController@detail')->name('client.notificationDetail');    //通知详情
        Route::post('changeCellphone', 'AppController@changeCellphone')->name('client.changeCellphone');    //更换手机号
        Route::post('amendPassword', 'LoginController@amendPassword')->name('client.amendPassword');    //修改密码
    });
});
