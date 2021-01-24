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
        Route::post('login', 'LoginController@index')-> name('login');  //登录
        Route::post('gologin', 'LoginController@index')->middleware(['auth:api']);  //不需要token登录
    });
    Route::prefix('admin')->namespace('Admin')->middleware(['auth:api'])->group(function () {
        Route::post('uploadPictures', 'IndexController@uploadPictures');  //上传
        Route::get('userInfo', 'LoginController@userInfo');  //用户详情
        //首页
        Route::get('index', 'IndexController@index');  //首页
        //用户管理
        Route::get('admin', 'UserController@index')->middleware(['permissions:AdminList']);  //管理员列表
        Route::post('admin/create', 'UserController@createAdmin')->middleware(['permissions:CreateAdmin']);  //添加管理员
        Route::put('admin', 'UserController@updataAdmin')->middleware(['permissions:UpdataAdmin']);  //修改管理员/密码
        Route::delete('admin/{id}', 'UserController@destroyAdmin')->middleware(['permissions:DeleteAdmin']);  //删除管理员
        Route::get('user', 'UserController@user')->middleware(['permissions:MemberList']);  //用户列表
        Route::post('user', 'UserController@createUser')->middleware(['permissions:CreateUser']);  //添加用户
        Route::put('user', 'UserController@updataUser')->middleware(['permissions:UpdataUser']);  //修改用户
        Route::get('manage', 'UserController@manage')->middleware(['permissions:ManageList']);  //管理组管理
        Route::post('manage/create', 'UserController@createManage')->middleware(['permissions:CreateManage']);  //添加管理组
        Route::put('manage', 'UserController@updataManage')->middleware(['permissions:UpdataManage']);  //修改管理组
        Route::delete('manage/{id}', 'UserController@destroyManage')->middleware(['permissions:DeleteManage']);  //删除管理组
        Route::get('power', 'UserController@power')->middleware(['permissions:PowerList']);  //权限管理
        Route::post('power/create', 'UserController@createPower')->middleware(['permissions:CreatePower']);  //添加权限
        Route::put('power', 'UserController@updataPower')->middleware(['permissions:UpdataPower']);  //修改权限
        Route::delete('power/{id}', 'UserController@destroyPower')->middleware(['permissions:DeletePower']);  //删除权限
        //工具
        //--Redis管理
        Route::get('redis', 'RedisServiceController@index')->middleware(['permissions:RedisServicesList']);    //Redis列表
        Route::get('redis/{id}', 'RedisServiceController@show')->middleware(['permissions:RedisServicesList']);    //Redis详情
        Route::delete('redis/{id}', 'RedisServiceController@destroy')->middleware(['permissions:DeleteRedisServices']);    //删除Redis
        Route::get('redisPanel', 'RedisServiceController@panel')->middleware(['permissions:RedisPanel']);    //Redis面板
        //--品牌
        Route::get('brand', 'BrandController@index')->middleware(['permissions:BrandList']);    //品牌列表
        Route::post('brand', 'BrandController@store')->middleware(['permissions:CreateBrand']);    //品牌添加保存
        Route::put('brand/{id}', 'BrandController@update')->middleware(['permissions:EditBrand']);    //品牌编辑保存
        Route::delete('brand/{id}', 'BrandController@destroy')->middleware(['permissions:DeleteBrand']);    //品牌删除
        //--资源
        Route::get('resource', 'ResourceController@index')->middleware(['permissions:ResourceDataList']);    //资源列表
        Route::post('resource', 'ResourceController@store')->middleware(['permissions:CreateResourceData']);    //资源添加保存
        Route::put('resource/{id}', 'ResourceController@update')->middleware(['permissions:EditResourceData']);    //资源编辑保存
        Route::delete('resource/{id}', 'ResourceController@destroy')->middleware(['permissions:DeleteResourceData']);    //资源删除
        //--分类
        Route::get('category', 'CategoryController@index')->middleware(['permissions:CategoryList']);    //分类列表
        Route::post('category', 'CategoryController@store')->middleware(['permissions:CreateCategory']);    //分类添加保存
        Route::put('category/{id}', 'CategoryController@update')->middleware(['permissions:EditCategory']);    //分类编辑保存
        Route::delete('category/{id}', 'CategoryController@destroy')->middleware(['permissions:DeleteCategory']);    //分类删除
        //--规格
        Route::get('specification', 'SpecificationController@index')->middleware(['permissions:SpecificationList']);    //规格列表
        Route::post('specification', 'SpecificationController@store')->middleware(['permissions:CreateSpecification']);    //规格添加保存
        Route::put('specification/{id}', 'SpecificationController@update')->middleware(['permissions:EditSpecification']);    //规格编辑保存
        Route::delete('specification/{id}', 'SpecificationController@destroy')->middleware(['permissions:DeleteSpecification']);    //规格删除
        //--规格组
        Route::get('specificationGroup', 'SpecificationGroupController@index')->middleware(['permissions:SpecificationGroupList']);    //规格组列表
        Route::post('specificationGroup', 'SpecificationGroupController@store')->middleware(['permissions:CreateSpecificationGroup']);    //规格组添加保存
        Route::put('specificationGroup/{id}', 'SpecificationGroupController@update')->middleware(['permissions:EditSpecificationGroup']);    //规格组编辑保存
        Route::delete('specificationGroup/{id}', 'SpecificationGroupController@destroy')->middleware(['permissions:DeleteSpecificationGroup']);    //规格组删除
        //商品管理
        Route::get('Good', 'GoodController@index')->middleware(['permissions:ProductList']);    //列表
        Route::get('Good/{id}', 'GoodController@details')->middleware(['permissions:CreateProduct']);    //产品详情页
        Route::get('goodSpecification/{id}', 'GoodController@specification')->middleware(['permissions:CreateProduct']);    //获取产品规格
        Route::post('Good', 'GoodController@store')->middleware(['permissions:CreateProduct']);    //添加保存
        Route::put('Good/{id}', 'GoodController@update')->middleware(['permissions:EditProduct']);    //编辑保存
        Route::put('GoodState/{id}', 'GoodController@goodState')->middleware(['permissions:EditProduct']);    //变更商品状态
        Route::delete('Good/{id}', 'GoodController@destroy')->middleware(['permissions:DeleteProduct']);    //删除
        //运费模板
        Route::get('freight', 'FreightController@index')->middleware(['permissions:FreightList']);    //运费模板列表
        Route::get('freight/{id}', 'FreightController@show')->middleware(['permissions:EditFreight']);    //运费模板详情
        Route::post('freight', 'FreightController@store')->middleware(['permissions:CreateFreight']);    //运费模板添加保存
        Route::put('freight/{id}', 'FreightController@update')->middleware(['permissions:EditFreight']);    //运费模板编辑保存
        Route::delete('freight/{id}', 'FreightController@destroy')->middleware(['permissions:DeleteFreight']);    //运费模板删除
        //快递公司
        Route::get('dhl', 'DhlController@index')->middleware(['permissions:DhlList']);    //快递公司列表
        Route::get('dhl/{id}', 'DhlController@show')->middleware(['permissions:EditDhl']);    //快递公司详情
        Route::post('dhl', 'DhlController@store')->middleware(['permissions:CreateDhl']);    //快递公司添加保存
        Route::put('dhl/{id}', 'DhlController@update')->middleware(['permissions:EditDhl']);    //快递公司编辑保存
        Route::delete('dhl/{id}', 'DhlController@destroy')->middleware(['permissions:DeleteDhl']);    //快递公司删除
        Route::get('dhlList', 'DhlController@list')->middleware(['permissions:DhlList']);
        //订单管理
        Route::get('indent', 'IndentController@index')->middleware(['permissions:IndentList']);    //订单列表
        Route::get('indent/{id}', 'IndentController@show')->middleware(['permissions:EditIndent']);    //订单详情
        Route::post('indentShipments', 'IndentController@shipment')->middleware(['permissions:Shipment']); //发货
        Route::post('updateDhl', 'IndentController@updateDhl')->middleware(['permissions:EditIndent']); //修改配送信息
        Route::put('indentRefund/{id}', 'IndentController@refund')->middleware(['permissions:Refund']); //退款
        Route::get('query', 'IndentController@query')->middleware(['permissions:EditIndent']);    //查询订单
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
    Route::prefix('app')->namespace('Element')->group(function () {
        Route::any('/serve', 'WeChatController@serve');    //微信认证
        Route::any('paymentNotify', 'WeChatController@paymentNotify');    //微信支付回调
        Route::any('refundNotify', 'WeChatController@refundNotify');    //微信退款回调
    });
    Route::prefix('app')->namespace('Element')->middleware(['appverify'])->group(function () {
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
    Route::prefix('app')->namespace('Element')->middleware(['appverify','auth:web'])->group(function () {
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
    Route::prefix('app')->namespace('Plugin')->middleware(['appverify','auth:web'])->group(function () {
        //APP验证插件列表
    });
    Route::prefix('app')->namespace('Plugin')->middleware(['appverify'])->group(function () {
        //APP无需验证插件列表
    });
});
