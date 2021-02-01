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
        //首页
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


        //工具
        //--Redis管理
        Route::get('redis', 'RedisServiceController@index')->middleware(['permissions:RedisServicesList']);    //Redis列表
        Route::get('redis/{id}', 'RedisServiceController@show')->middleware(['permissions:RedisServicesList']);    //Redis详情
        Route::delete('redis/{id}', 'RedisServiceController@destroy')->middleware(['permissions:DeleteRedisServices']);    //删除Redis
        Route::get('redisPanel', 'RedisServiceController@panel')->middleware(['permissions:RedisPanel']);    //Redis面板

        //--资源
        Route::get('resource', 'ResourceController@index')->middleware(['permissions:ResourceDataList']);    //资源列表
        Route::post('resource', 'ResourceController@store')->middleware(['permissions:CreateResourceData']);    //资源添加保存
        Route::put('resource/{id}', 'ResourceController@update')->middleware(['permissions:EditResourceData']);    //资源编辑保存
        Route::delete('resource/{id}', 'ResourceController@destroy')->middleware(['permissions:DeleteResourceData']);    //资源删除



        //轮播
        Route::get('banner', 'BannerController@index')->middleware(['permissions:BannerList']);    //轮播列表
        Route::post('banner', 'BannerController@store')->middleware(['permissions:CreateBanner']);    //轮播添加保存
        Route::put('banner/{id}', 'BannerController@update')->middleware(['permissions:EditBanner']);    //轮播编辑保存
        Route::delete('banner/{id}', 'BannerController@destroy')->middleware(['permissions:DeleteBanner']);    //轮播删除
        //统计
        Route::get('statistic/behavior', 'StatisticsController@behavior')->middleware(['permissions:StatisticsVisit']);    //使用分析
        Route::get('statistic/keep', 'StatisticsController@keep')->middleware(['permissions:StatisticsVisit']);    //留存趋势
        Route::get('statistic/source', 'StatisticsController@source')->middleware(['permissions:StatisticsVisit']);    //来源分析
        Route::get('statistic/age_and_sex', 'StatisticsController@ageAndSex')->middleware(['permissions:StatisticsAgeAndSex']);    //来源分析
        Route::get('statistic/pay', 'StatisticsController@pay')->middleware(['permissions:StatisticsPay']);    //交易分析
        //插件管理
        Route::get('plugin', 'PluginController@index')->middleware(['permissions:PlugInList']);    //插件列表
        Route::post('plugin/{name}', 'PluginController@store')->middleware(['permissions:PlugInUpdate']);    //更新插件
        Route::put('plugin/{name}', 'PluginController@update')->middleware(['permissions:PlugInInstall']);    //安装插件
        Route::delete('plugin/{name}', 'PluginController@destroy')->middleware(['permissions:PlugInDelete']);    //删除插件
    });
    // 插件后台
    Route::prefix('admin')->namespace('Plugin')->middleware(['auth:api'])->group(function () {
        //前台插件列表
    });
    //app
    Route::prefix('app')->namespace('Client')->group(function () {
        Route::any('/serve', 'WeChatController@serve');    //微信认证
        Route::any('paymentNotify', 'WeChatController@paymentNotify');    //微信支付回调
        Route::any('refundNotify', 'WeChatController@refundNotify');    //微信退款回调
    });
    Route::prefix('app')->namespace('Client')->middleware(['appverify'])->group(function () {
        Route::post('uploadPictures', 'WeChatController@uploadPictures');  //上传
        Route::post('register', 'WeChatController@register');    //注册
        Route::post('login', 'WeChatController@login');    //登录
        Route::post('miniLogin', 'WeChatController@miniLogin');    //小程序换取openid
        Route::post('findPassword', 'WeChatController@findPassword');    //找回密码
        Route::post('getRegisterCellphoneCode', 'WeChatController@getRegisterCellphoneCode');    //获取手机验证码
        Route::post('getRegisterEmailCode', 'WeChatController@getRegisterEmailCode');    //获取邮箱验证码
        Route::post('authorizedPhone', 'WeChatController@authorizedPhone');    //授权获取手机号
        Route::post('verifyEmail', 'WeChatController@verifyEmail');    //邮箱验证
        Route::post('userNotification', 'UserController@userNotification');    //更新接收通知状态
        // 商品
        Route::get('good', 'GoodAppController@index');    //商品列表
        Route::get('good/{id}', 'GoodAppController@show');    //商品详情
        Route::get('banner', 'BannerAppController@index');    //轮播列表
        Route::get('advertising', 'BannerAppController@advertising');    //单条广告
        Route::get('goodCategory', 'GoodAppController@goodCategory');    //商品分类展示
    });
    Route::prefix('app')->namespace('Client')->middleware(['appverify', 'auth:web'])->group(function () {
        Route::get('user', 'UserController@show');    //用户详情
        Route::post('user', 'UserController@update');    //设置用户信息
        Route::post('unsubscribe', 'UserController@unsubscribe');    //注销账号
        Route::get('finance', 'MoneyLogController@index');    //收支列表
        Route::get('finance/{id}', 'MoneyLogController@show');    //收支详情
        Route::post('logout', 'WeChatController@logout');    //登出
        Route::post('unifiedPayment', 'WeChatController@unifiedPayment');    //在线支付
        Route::post('balancePay', 'WeChatController@balancePay');    //余额支付
        //订单
        Route::get('GoodIndent', 'GoodIndentController@index');    //列表
        Route::get('GoodPay/{id}', 'GoodIndentController@pay');    //支付订单详情
        Route::post('GoodCount', 'GoodIndentController@gcount');    //更新商品库存
        Route::post('GoodIndent', 'GoodIndentController@store');    //添加保存
        Route::get('GoodIndent/{id}', 'GoodIndentController@show');    //详情
        Route::post('GoodIndentReceipt/{id}', 'GoodIndentController@receipt');    //确认收货
        Route::post('GoodIndentCancel/{id}', 'GoodIndentController@cancel');    //取消订单
        Route::post('GoodIndentDelete/{id}', 'GoodIndentController@destroy');    //删除订单
        Route::get('GoodIndentQuantity', 'GoodIndentController@quantity');    //订单数量统计
        //收货地址
        Route::get('shipping', 'ShippingController@index');    //列表
        Route::post('shippingOne', 'ShippingController@one');    //获取默认收货地址
        Route::get('shipping/{id}', 'ShippingController@show');    //详情
        Route::post('shipping', 'ShippingController@store');    //添加保存
        Route::post('shipping/{id}', 'ShippingController@update');    //编辑保存
        Route::post('shippingDelete/{id}', 'ShippingController@destroy');    //删除
        Route::post('shippingCheck', 'ShippingController@check');    //设为默认
        //浏览记录
        Route::get('browse', 'BrowseController@index');    //列表
        Route::post('browse', 'BrowseController@store');    //添加保存
        //收藏
        Route::get('collect', 'CollectController@index');    //列表
        Route::get('collect/{id}', 'CollectController@show');    //详情
        Route::post('collect', 'CollectController@store');    //添加保存
        Route::post('collectDelete/{id}', 'CollectController@destroy');    //删除
        //通知
        Route::get('notice', 'NoticeController@index');    //列表
        Route::get('noticeConut', 'NoticeController@count');    //未读数量
        Route::post('notice/{id}', 'NoticeController@destroy');    //删除
    });
    // 插件前台
    Route::prefix('app')->namespace('Plugin')->middleware(['appverify', 'auth:web'])->group(function () {
        //APP验证插件列表
    });
    Route::prefix('app')->namespace('Plugin')->middleware(['appverify'])->group(function () {
        //APP无需验证插件列表
    });
});
