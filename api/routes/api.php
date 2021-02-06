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
Route::prefix('v1')->namespace('v1')->group(function () {
    // 后台API
    Route::prefix('admin')->namespace('Admin')->group(function () {
        Route::post('login', 'LoginController@index')->name('login');  //登录
        Route::post('gologin', 'LoginController@index')->middleware(['auth:api']);  //不需要token登录
    });
    Route::prefix('admin')->namespace('Admin')->middleware(['auth:api'])->group(function () {
        Route::post('uploadPictures', 'IndexController@uploadPictures');  //上传
        Route::get('userInfo', 'LoginController@userInfo');  //用户详情
        Route::get('index', 'IndexController@index');  //首页
        Route::get('admin', 'AdminController@list')->middleware(['permissions:AdminList']);  //管理员列表
        Route::post('admin', 'AdminController@create')->middleware(['permissions:AdminCreate']);  //管理员添加
        Route::post('admin/{id}', 'AdminController@edit')->middleware(['permissions:AdminEdit']);  //管理员/密码修改
        Route::post('admin/destroy/{id}', 'AdminController@destroy')->middleware(['permissions:AdminDestroy']);  //管理员删除
        Route::get('member', 'MemberController@list')->middleware(['permissions:MemberList']);  //会员列表
        Route::post('member', 'MemberController@create')->middleware(['permissions:MemberCreate']);  //会员添加
        Route::post('member/{id}', 'MemberController@edit')->middleware(['permissions:MemberEdit']);  //会员修改
        Route::get('manage', 'ManageController@list')->middleware(['permissions:ManageList']);  //管理组管理
        Route::post('manage', 'ManageController@create')->middleware(['permissions:ManageCreate']);  //管理组添加
        Route::post('manage/{id}', 'ManageController@edit')->middleware(['permissions:ManageEdit']);  //管理组修改
        Route::post('manage/destroy/{id}', 'ManageController@destroy')->middleware(['permissions:ManageDestroy']);  //管理组删除
        Route::get('power', 'PowerController@list')->middleware(['permissions:PowerList']);  //权限管理
        Route::post('power', 'PowerController@create')->middleware(['permissions:PowerCreate']);  //权限添加
        Route::post('power/{id}', 'PowerController@edit')->middleware(['permissions:PowerEdit']);  //权限修改
        Route::post('power/destroy/{id}', 'PowerController@destroy')->middleware(['permissions:PowerDestroy']);  //权限删除
        Route::get('good', 'GoodController@list')->middleware(['permissions:GoodList']);    //商品列表
        Route::post('good', 'GoodController@create')->middleware(['permissions:GoodCreate']);    //商品添加
        Route::post('good/{id}', 'GoodController@edit')->middleware(['permissions:GoodEdit']);    //商品修改
        Route::post('good/destroy/{id}', 'GoodController@destroy')->middleware(['permissions:GoodDestroy']);    //商品删除
        Route::get('good/{id}', 'GoodController@detail')->middleware(['permissions:GoodDetail']);    //商品详情
        Route::get('good/specification/{id}', 'GoodController@specification')->middleware(['permissions:GoodEdit']);    //商品规格列表
        Route::post('good/state/{id}', 'GoodController@state')->middleware(['permissions:GoodEdit']);    //商品状态
        Route::get('brand', 'BrandController@list')->middleware(['permissions:BrandList']);    //品牌列表
        Route::post('brand', 'BrandController@create')->middleware(['permissions:BrandCreate']);    //品牌添加
        Route::post('brand/{id}', 'BrandController@edit')->middleware(['permissions:BrandEdit']);    //品牌修改
        Route::post('brand/destroy/{id}', 'BrandController@destroy')->middleware(['permissions:BrandDestroy']);    //品牌删除
        Route::get('specification', 'SpecificationController@list')->middleware(['permissions:SpecificationList']);    //规格列表
        Route::post('specification', 'SpecificationController@create')->middleware(['permissions:SpecificationCreate']);    //规格添加
        Route::post('specification/{id}', 'SpecificationController@edit')->middleware(['permissions:SpecificationEdit']);    //规格修改
        Route::post('specification/destroy/{id}', 'SpecificationController@destroy')->middleware(['permissions:SpecificationDestroy']);    //规格删除
        Route::get('specificationGroup', 'SpecificationGroupController@list')->middleware(['permissions:SpecificationGroupList']);    //规格组列表
        Route::post('specificationGroup', 'SpecificationGroupController@create')->middleware(['permissions:SpecificationGroupCreate']);    //规格组添加
        Route::post('specificationGroup/{id}', 'SpecificationGroupController@edit')->middleware(['permissions:SpecificationGroupEdit']);    //规格组编辑
        Route::post('specificationGroup/destroy/{id}', 'SpecificationGroupController@destroy')->middleware(['permissions:SpecificationGroupDestroy']);    //规格组删除
        Route::get('category', 'CategoryController@list')->middleware(['permissions:CategoryList']);    //分类列表
        Route::post('category', 'CategoryController@create')->middleware(['permissions:CategoryCreate']);    //分类添加
        Route::post('category/{id}', 'CategoryController@edit')->middleware(['permissions:CategoryEdit']);    //分类修改
        Route::post('category/destroy/{id}', 'CategoryController@destroy')->middleware(['permissions:CategoryDestroy']);    //分类删除
        Route::get('freight', 'FreightController@list')->middleware(['permissions:FreightList']);    //运费模板列表
        Route::get('freight/{id}', 'FreightController@detail')->middleware(['permissions:FreightEdit']);    //运费模板详情
        Route::post('freight', 'FreightController@create')->middleware(['permissions:FreightCreate']);    //运费模板添加
        Route::post('freight/{id}', 'FreightController@edit')->middleware(['permissions:FreightEdit']);    //运费模板修改
        Route::post('freight/destroy/{id}', 'FreightController@destroy')->middleware(['permissions:FreightDestroy']);    //运费模板删除
        Route::get('dhl', 'DhlController@list')->middleware(['permissions:DhlList']);    //快递公司列表
        Route::post('dhl', 'DhlController@create')->middleware(['permissions:DhlCreate']);    //快递公司添加
        Route::post('dhl/{id}', 'DhlController@edit')->middleware(['permissions:DhlEdit']);    //快递公司修改
        Route::post('dhl/destroy/{id}', 'DhlController@destroy')->middleware(['permissions:DhlDestroy']);    //快递公司删除
        Route::get('indent', 'IndentController@list')->middleware(['permissions:IndentList']);    //订单列表
        Route::get('indent/{id}', 'IndentController@detail')->middleware(['permissions:IndentDetail']);    //订单详情
        Route::post('indent/shipment', 'IndentController@shipment')->middleware(['permissions:IndentShipment']); //发货
        Route::post('indent/dhl', 'IndentController@dhl')->middleware(['permissions:IndentDhl']); //配送信息修改
        Route::post('indent/refund/{id}', 'IndentController@refund')->middleware(['permissions:IndentRefund']); //退款
        Route::get('indent/query/{id}', 'IndentController@query')->middleware(['permissions:IndentDetail']);  //查询订单状态
        Route::get('redis', 'RedisServiceController@list')->middleware(['permissions:RedisServiceList']);    //Redis列表
        Route::get('redis/{name}', 'RedisServiceController@detail')->middleware(['permissions:RedisServiceDetail']);    //Redis详情
        Route::post('redis/destroy/{id}', 'RedisServiceController@destroy')->middleware(['permissions:RedisServiceDestroy']);    //Redis删除
        Route::get('redisPanel', 'RedisServiceController@panel')->middleware(['permissions:RedisPanel']);    //Redis面板
        Route::get('resource', 'ResourceController@list')->middleware(['permissions:ResourceList']);    //资源列表
        Route::post('resource/destroy/{id}', 'ResourceController@destroy')->middleware(['permissions:ResourceDestroy']);    //资源删除
        Route::get('banner', 'BannerController@list')->middleware(['permissions:BannerList']);    //轮播列表
        Route::post('banner', 'BannerController@create')->middleware(['permissions:BannerCreate']);    //轮播添加
        Route::post('banner/{id}', 'BannerController@edit')->middleware(['permissions:BannerEdit']);    //轮播修改
        Route::post('banner/destroy/{id}', 'BannerController@destroy')->middleware(['permissions:BannerDestroy']);    //轮播删除
        Route::get('plugin', 'PluginController@list')->middleware(['permissions:PlugInList']);    //插件列表
        Route::get('plugin/{name}', 'PluginController@create')->middleware(['permissions:PlugInCreate']);    //插件安装
        Route::post('plugin/destroy/{name}', 'PluginController@destroy')->middleware(['permissions:PlugInDestroy']);    //插件卸载
        Route::get('statistic/behavior', 'StatisticsController@behavior')->middleware(['permissions:StatisticsVisit']);    //使用分析
        Route::get('statistic/keep', 'StatisticsController@keep')->middleware(['permissions:StatisticsVisit']);    //留存趋势
        Route::get('statistic/source', 'StatisticsController@source')->middleware(['permissions:StatisticsVisit']);    //来源分析
        Route::get('statistic/age_and_sex', 'StatisticsController@ageAndSex')->middleware(['permissions:StatisticsAgeAndSex']);    //来源分析
        Route::get('statistic/pay', 'StatisticsController@pay')->middleware(['permissions:StatisticsPay']);    //交易分析
    });
    //app
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
        Route::post('user', 'UserController@edit');    //用户信息修改
        Route::post('cancel', 'UserController@cancel');    //注销账号
        Route::get('moneyLog', 'MoneyLogController@list');    //收支列表
        Route::get('moneyLog/{id}', 'MoneyLogController@detail');    //收支详情
        Route::post('unifiedPayment', 'AppController@unifiedPayment');    //在线支付
        Route::post('balancePay', 'AppController@balancePay');    //余额支付
        Route::get('goodIndent', 'GoodIndentController@list');    //订单列表
        Route::post('goodIndent', 'GoodIndentController@create');    //订单添加
        Route::get('goodIndent/detail/{id}', 'GoodIndentController@detail');    //订单详情
        Route::post('goodIndent/synchronizationInventory', 'GoodIndentController@synchronizationInventory');    //同步线上商品库存
        Route::get('goodIndent/pay/{id}', 'GoodIndentController@pay');    //支付订单详情
        Route::post('goodIndent/receipt/{id}', 'GoodIndentController@receipt');    //确认收货
        Route::post('goodIndent/cancel/{id}', 'GoodIndentController@cancel');    //取消订单
        Route::post('goodIndent/destroy/{id}', 'GoodIndentController@destroy');    //删除订单
        Route::get('goodIndent/quantity', 'GoodIndentController@quantity');    //订单数量统计
        Route::get('shipping', 'ShippingController@list');    //收货地址列表
        Route::post('shipping', 'ShippingController@create');    //收货地址添加
        Route::post('shipping/{id}', 'ShippingController@edit');    //收货地址修改
        Route::get('shipping/default/get', 'ShippingController@defaultGet');    //获取默认收货地址
        Route::post('shipping/destroy/{id}', 'ShippingController@destroy');    //收货地址删除
        Route::post('shipping/default/set', 'ShippingController@defaultSet');    //设为默认
        Route::get('browse', 'BrowseController@list');    //浏览记录列表
        Route::post('browse', 'BrowseController@create');    //浏览记录添加
        Route::get('collect', 'CollectController@list');   //收藏列表
        Route::get('collect/{id}', 'CollectController@detail');   //收藏详情
        Route::post('collect', 'CollectController@create');  //收藏添加
        Route::post('collect/destroy/{id}', 'CollectController@destroy'); //收藏删除
        Route::get('notification', 'NotificationController@list');    //列表
        Route::get('notification/unread', 'NotificationController@unread');    //未读数量
        Route::post('notification/destroy/{id}', 'NotificationController@destroy');    //删除
    });
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
