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
use Illuminate\Support\Facades\Route;

Route::prefix('v' . config('tfshop.versions'))->namespace('v' . config('tfshop.versions'))->group(function () {
    // 后台API
    Route::prefix('admin')->namespace('Admin')->group(function () {
        Route::post('login', 'LoginController@index')->name('admin.login');  //登录
        Route::post('refreshToken', 'LoginController@refresh')->name('admin.refreshToken');  //刷新token
        Route::get('plugin/download/{name}', 'PluginController@download')->name('admin.plugInDownload');    //插件下载
        Route::post('verifyPlugin/{id}', 'PluginController@verify')->name('admin.verifyPlugin');   //验证插件是否安装
        Route::get('lang', 'LanguageController@list')->name('admin.languageList');    //语言列表

    });
    Route::prefix('admin')->namespace('Admin')->middleware(['auth:api'])->group(function () {
        Route::post('logout', 'LoginController@logout')->name('admin.logout');  //登出
        Route::post('resourceUpload', 'IndexController@resourceUpload')->name('admin.resourceUpload');  //上传
        Route::get('userInfo', 'LoginController@userInfo')->name('admin.userInfo');  //用户详情
        Route::get('version', 'LoginController@version')->name('admin.version');    // 获取最新版本
        Route::get('index', 'IndexController@index')->name('admin.index');  //首页
        Route::get('admin', 'AdminController@list')->name('admin.adminList')->middleware(['permissions:Admin']);  //管理员列表
        Route::get('admin/detail', 'AdminController@detail')->name('admin.adminDetail')->middleware(['permissions:AdminView']);  //管理员详情
        Route::post('admin', 'AdminController@create')->name('admin.adminCreate')->middleware(['permissions:AdminCreate']);  //创建管理员
        Route::post('admin/{id}', 'AdminController@edit')->name('admin.adminEdit')->middleware(['permissions:AdminEdit']);  //保存管理员
        Route::post('admin/password/{id}', 'AdminController@password')->name('admin.adminPassword')->middleware(['permissions:AdminPassword']);  //管理员重置密码
        Route::post('admin/destroy/{id}', 'AdminController@destroy')->name('admin.adminDestroy')->middleware(['permissions:AdminDestroy']); //删除管理员
        Route::get('adminFilter', 'AdminFilterController@list')->name('admin.adminFilterList')->middleware(['permissions:AdminFilter']);  //管理员过滤器列表
        Route::post('adminFilter', 'AdminFilterController@create')->name('admin.adminFilterCreate')->middleware(['permissions:AdminFilterCreate']);  //创建管理员过滤器
        Route::post('adminFilter/{id}', 'AdminFilterController@edit')->name('admin.adminFilterEdit')->middleware(['permissions:AdminFilterEdit']);  //保存管理员过滤器
        Route::post('adminFilter/destroy/{id}', 'AdminFilterController@destroy')->name('admin.adminFilterDestroy')->middleware(['permissions:AdminFilterDestroy']); //删除管理员过滤器
        Route::get('adminLog', 'AdminLogController@list')->name('admin.adminLog')->middleware(['permissions:AdminLog']);  //管理员日志列表
        Route::get('userLog', 'UserLogController@list')->name('admin.userLog')->middleware(['permissions:UserLog']);  //用戶日志列表
        Route::get('role', 'RoleController@list')->name('admin.role')->middleware(['permissions:Role']);  //角色管理
        Route::post('role', 'RoleController@create')->name('admin.roleCreate')->middleware(['permissions:RoleCreate']);  //创建角色
        Route::post('role/{id}', 'RoleController@edit')->name('admin.roleEdit')->middleware(['permissions:RoleEdit']);  //保存角色
        Route::post('role/destroy/{id}', 'RoleController@destroy')->name('admin.roleDestroy')->middleware(['permissions:RoleDestroy']);  //删除角色
        Route::post('permission/{id}', 'RoleController@permission')->name('admin.permissionEdit')->middleware(['permissions:PermissionEdit']);  //保存权限
        Route::get('power', 'PowerController@list')->name('admin.power')->middleware(['permissions:Power']);  //权限管理
        Route::post('power', 'PowerController@create')->name('admin.powerCreate')->middleware(['permissions:PowerCreate']);  //创建权限
        Route::post('power/{id}', 'PowerController@edit')->name('admin.powerEdit')->middleware(['permissions:PowerEdit']);  //保存权限
        Route::post('power/destroy/{id}', 'PowerController@destroy')->name('admin.powerDestroy')->middleware(['permissions:PowerDestroy']);  //删除权限
        Route::post('power/sort/all', 'PowerController@sort')->name('admin.powerSort')->middleware(['permissions:PowerSort']);  //权限排序        
        Route::get('member', 'MemberController@list')->name('admin.memberList')->middleware(['permissions:Member']);  //会员列表
        Route::post('member', 'MemberController@create')->name('admin.memberCreate')->middleware(['permissions:MemberCreate']);  //创建会员
        Route::post('member/{id}', 'MemberController@edit')->name('admin.memberEdit')->middleware(['permissions:MemberEdit']);  //保存会员
        Route::post('member/export/all', 'MemberController@export')->name('admin.memberExport')->middleware(['permissions:MemberExport']);    //会员导出
        Route::post('member/password/{id}', 'MemberController@password')->name('admin.memberPassword')->middleware(['permissions:MemberPassword']);  //管理员重置密码
        Route::get('resource', 'ResourceController@list')->name('admin.resourceList')->middleware(['permissions:Resource']);    //资源列表
        Route::post('resource', 'ResourceController@create')->name('admin.resourceCreate')->middleware(['permissions:ResourceCreate']);    //上传资源
        Route::post('resource/cover/{id}', 'ResourceController@cover')->name('admin.resourceCover')->middleware(['permissions:ResourceCover']);    //资源设置封面
        Route::post('resource/depict/{id}', 'ResourceController@depict')->name('admin.resourceDepict')->middleware(['permissions:ResourceDepict']);    //资源设置别名
        Route::post('resource/group', 'ResourceController@group')->name('admin.resourceGroups')->middleware(['permissions:ResourceGroups']);    //资源设置分组
        Route::post('resource/destroy/{id}', 'ResourceController@destroy')->name('admin.resourceDestroy')->middleware(['permissions:ResourceDestroy']);    //删除资源
        Route::get('resource_group', 'ResourceGroupController@list')->name('admin.resourceGroupList')->middleware(['permissions:ResourceGroup']);    //资源分组
        Route::post('resource_group', 'ResourceGroupController@create')->name('admin.resourceGroupCreate')->middleware(['permissions:ResourceGroupCreate']);    //创建资源分组
        Route::post('resource_group/{id}', 'ResourceGroupController@edit')->name('admin.resourceGroupEdit')->middleware(['permissions:ResourceGroupEdit']);    //保存资源分组
        Route::post('resource_group/sort/all', 'ResourceGroupController@sort')->name('admin.resourceGroupSort')->middleware(['permissions:ResourceGroupSort']);  //资源分组排序
        Route::post('resource_group/destroy/{id}', 'ResourceGroupController@destroy')->name('admin.resourceGroupDestroy')->middleware(['permissions:ResourceGroupDestroy']);    //删除资源分组
        Route::get('resource_type', 'ResourceTypeController@list')->name('admin.resourceType')->middleware(['permissions:ResourceType']);    //资源类型
        Route::get('resource_type/detail/{id}', 'ResourceTypeController@detail')->name('admin.resourceType')->middleware(['permissions:ResourceTypeDetail']);    //资源类型详情
        Route::post('resource_type', 'ResourceTypeController@create')->name('admin.resourceTypeCreate')->middleware(['permissions:ResourceTypeCreate']);    //创建资源类型
        Route::post('resource_type/{id}', 'ResourceTypeController@edit')->name('admin.resourceTypeEdit')->middleware(['permissions:ResourceTypeEdit']);    //保存资源类型
        Route::post('resource_type/destroy/{id}', 'ResourceTypeController@destroy')->name('admin.resourceTypeDestroy')->middleware(['permissions:ResourceTypeDestroy']);    //删除资源类型
        Route::get('product', 'GoodController@list')->name('admin.goodList')->middleware(['permissions:Product']);    //商品列表
        Route::post('product', 'GoodController@create')->name('admin.goodCreate')->middleware(['permissions:ProductCreate']);    //创建商品
        Route::post('product/{id}', 'GoodController@edit')->name('admin.goodEdit')->middleware(['permissions:ProductEdit']);    //保存商品
        Route::post('product/destroy/{id}', 'GoodController@destroy')->name('admin.goodDestroy')->middleware(['permissions:ProductDestroy']);    //删除商品
        Route::post('product/state/{id}', 'GoodController@state')->name('admin.goodState')->middleware(['permissions:ProductEdit']);    //商品状态
        Route::post('product/export/all', 'GoodController@export')->name('admin.goodExport')->middleware(['permissions:ProductExport']);    //商品导出
        Route::get('category', 'CategoryController@list')->name('admin.categoryList')->middleware(['permissions:Category']);    //分类列表
        Route::post('category', 'CategoryController@create')->name('admin.categoryCreate')->middleware(['permissions:CategoryCreate']);    //创建分类
        Route::post('category/{id}', 'CategoryController@edit')->name('admin.categoryEdit')->middleware(['permissions:CategoryEdit']);    //保存分类
        Route::post('category/destroy/{id}', 'CategoryController@destroy')->name('admin.categoryDestroy')->middleware(['permissions:CategoryDestroy']);    //删除分类
        Route::get('freight', 'FreightController@list')->name('admin.freightList')->middleware(['permissions:Freight']);    //运费模板列表
        Route::get('freight/{id}', 'FreightController@detail')->name('admin.freightDetail')->middleware(['permissions:FreightEdit']);    //运费模板详情
        Route::post('freight', 'FreightController@create')->name('admin.freightCreate')->middleware(['permissions:FreightCreate']);    //创建运费模板
        Route::post('freight/{id}', 'FreightController@edit')->name('admin.freightEdit')->middleware(['permissions:FreightEdit']);    //保存运费模板
        Route::post('freight/destroy/{id}', 'FreightController@destroy')->name('admin.freightDestroy')->middleware(['permissions:FreightDestroy']);    //删除运费模板
        Route::get('dhl', 'DhlController@list')->name('admin.dhlList')->middleware(['permissions:Dhl']);    //快递公司列表
        Route::post('dhl', 'DhlController@create')->name('admin.dhlCreate')->middleware(['permissions:DhlCreate']);    //创建快递公司
        Route::post('dhl/{id}', 'DhlController@edit')->name('admin.dhlEdit')->middleware(['permissions:DhlEdit']);    //保存快递公司
        Route::post('dhl/destroy/{id}', 'DhlController@destroy')->name('admin.dhlDestroy')->middleware(['permissions:DhlDestroy']);    //删除快递公司
        Route::get('order', 'IndentController@list')->name('admin.indentList')->middleware(['permissions:Order']);    //订单列表
        Route::get('order/{id}', 'IndentController@detail')->name('admin.indentDetail')->middleware(['permissions:IndentDetail']);    //订单详情
        Route::post('order/shipment', 'IndentController@shipment')->name('admin.indentShipment')->middleware(['permissions:IndentShipment']); //发货
        Route::post('order/dhl', 'IndentController@dhl')->name('admin.indentDhl')->middleware(['permissions:IndentDhl']); //保存配送信息
        Route::post('order/refund/{id}', 'IndentController@refund')->name('admin.indentRefund')->middleware(['permissions:IndentRefund']); //退款
        Route::get('order/query/{id}', 'IndentController@query')->name('admin.indentQuery')->middleware(['permissions:IndentDetail']);  //查询订单状态
        Route::post('order/receiving', 'IndentController@receiving')->name('admin.indentReceiving')->middleware(['permissions:IndentShipment']); //延长收货时间
        Route::get('redis', 'RedisServiceController@list')->name('admin.redisServiceList')->middleware(['permissions:RedisServiceList']);    //Redis列表
        Route::get('redis/{name}', 'RedisServiceController@detail')->name('admin.redisServiceDetail')->middleware(['permissions:RedisServiceDetail']);    //Redis详情
        Route::post('redis/destroy/{id}', 'RedisServiceController@destroy')->name('admin.redisServiceDestroy')->middleware(['permissions:RedisServiceDestroy']);    //删除Redis
        Route::get('redisPanel', 'RedisServiceController@panel')->name('admin.redisPanel')->middleware(['permissions:RedisPanel']);    //Redis面板
        Route::get('banner', 'BannerController@list')->name('admin.bannerList')->middleware(['permissions:Banner']);    //轮播列表
        Route::post('banner', 'BannerController@create')->name('admin.bannerCreate')->middleware(['permissions:BannerCreate']);    //创建轮播
        Route::post('banner/{id}', 'BannerController@edit')->name('admin.bannerEdit')->middleware(['permissions:BannerEdit']);    //保存轮播
        Route::post('banner/destroy/{id}', 'BannerController@destroy')->name('admin.bannerDestroy')->middleware(['permissions:BannerDestroy']);    //删除轮播
        Route::get('plugin', 'PluginController@list')->name('admin.plugInList')->middleware(['permissions:PlugIn']);    //插件列表
        Route::post('plugin', 'PluginController@create')->name('admin.plugInCreate')->middleware(['permissions:PlugInCreate']);    //创建插件
        Route::post('plugin/{name}', 'PluginController@edit')->name('admin.plugInEdit')->middleware(['permissions:PlugInEdit']);    //保存插件
        Route::get('plugin/{name}', 'PluginController@details')->name('admin.plugInDetails')->middleware(['permissions:PlugInEdit']);    //插件详情
        Route::get('plugin/install/{name}', 'PluginController@install')->name('admin.plugInInstall')->middleware(['permissions:PlugInInstall']);    //插件安装
        Route::post('plugin/destroy/{name}', 'PluginController@destroy')->name('admin.plugInDestroy')->middleware(['permissions:PlugInDestroy']);    //插件删除
        Route::post('plugin/publish/{name}', 'PluginController@publish')->name('admin.plugInPublish')->middleware(['permissions:PlugInPublish']);    //插件发行
        Route::post('plugin/updatePack/{code}', 'PluginController@updatePack')->name('admin.plugInUpdatePack')->middleware(['permissions:PlugInInstall']);    //插件在线下载/更新
        Route::get('plugin/routes/{type}', 'PluginController@routes')->name('admin.plugInRoutes')->middleware(['permissions:PlugInRoutes']);    //获取路由列表
        Route::get('plugin/models/all', 'PluginController@models')->name('admin.plugInModels')->middleware(['permissions:PlugInModels']);    //获取模型列表
        Route::post('plugin/jurisdiction/all', 'PluginController@jurisdiction')->name('admin.plugInJurisdiction')->middleware(['permissions:PlugInJurisdiction']);    //获取权限列表
        Route::get('plugin/template/{name}', 'PluginController@template')->name('admin.plugInTemplate')->middleware(['permissions:PlugInTemplate']);    //获取模板列表
        Route::post('plugin/uninstall/{name}', 'PluginController@uninstall')->name('admin.plugInUninstall')->middleware(['permissions:PlugInUninstall']);    //插件卸载
        Route::get('plugin/diff/{name}', 'PluginController@diff')->name('admin.plugInDiff')->middleware(['permissions:PlugInList']);    //获取冲突文件列表
        Route::post('plugin/conflictResolution/{name}', 'PluginController@conflictResolution')->name('admin.plugInConflictResolution')->middleware(['permissions:PlugInList']);    //冲突处理
        Route::get('plugin/installList/all', 'PluginController@installPluginList')->name('admin.installPlugInList')->middleware(['permissions:PlugInList']);    //获取安装的插件列表
        Route::get('statistic/behavior', 'StatisticsController@behavior')->name('admin.behavior')->middleware(['permissions:StatisticsVisitList']);    //使用分析
        Route::get('statistic/keep', 'StatisticsController@keep')->name('admin.keep')->middleware(['permissions:StatisticsVisitList']);    //留存趋势
        Route::get('statistic/source', 'StatisticsController@source')->name('admin.source')->middleware(['permissions:StatisticsVisitList']);    //来源分析
        Route::get('statistic/age_and_sex', 'StatisticsController@ageAndSex')->name('admin.StatisticsAgeAndSex')->middleware(['permissions:StatisticsAgeAndSexList']);    //年龄和性别
        Route::get('statistic/pay', 'StatisticsController@pay')->name('admin.statisticsPay')->middleware(['permissions:StatisticsPayList']);    //交易分析
        Route::get('config', 'ConfigController@list')->name('admin.configView')->middleware(['permissions:ConfigView']);    //配置详情
        Route::post('config/{id}', 'ConfigController@edit')->name('admin.configEdit')->middleware(['permissions:ConfigEdit']);    //保存配置
        Route::get('backup', 'BackupController@list')->name('admin.backupView')->middleware(['permissions:BackupView']);    //查看备份
        Route::post('backup', 'BackupController@create')->name('admin.backupCreate')->middleware(['permissions:BackupCreate']);    //备份
        Route::post('backup/{id}', 'BackupController@edit')->name('admin.backupEdit')->middleware(['permissions:BackupEdit']);    //还原
        Route::post('backup/destroy/{id}', 'BackupController@destroy')->name('admin.backupDestroy')->middleware(['permissions:BackupDestroy']);    //删除备份
        Route::get('region', 'RegionController@list')->name('admin.regionList')->middleware(['permissions:Region']);    //地区列表
        Route::post('region', 'RegionController@create')->name('admin.regionCreate')->middleware(['permissions:RegionCreate']);    //创建地区
        Route::post('region/{id}', 'RegionController@edit')->name('admin.regionEdit')->middleware(['permissions:RegionEdit']);    //保存地区
        Route::post('region/destroy/{id}', 'RegionController@destroy')->name('admin.regionDestroy')->middleware(['permissions:RegionDestroy']);    //删除地区
        Route::get('language', 'LanguageController@list')->name('admin.languageList')->middleware(['permissions:Language']);    //语言列表
        Route::post('language', 'LanguageController@create')->name('admin.languageCreate')->middleware(['permissions:LanguageCreate']);    //语言地区
        Route::post('language/{id}', 'LanguageController@edit')->name('admin.languageEdit')->middleware(['permissions:LanguageEdit']);    //保存语言
        Route::post('language/destroy/{id}', 'LanguageController@destroy')->name('admin.languageDestroy')->middleware(['permissions:LanguageDestroy']);    //删除语言
    });
});
