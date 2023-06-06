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
Route::get('/sitemap.xml', 'SitemapController@index');
Route::get('/sitemap/{id}.xml', 'SitemapController@detail');
Route::get('/', function () {
//    echo __('validation.custom.specification-name.rule-name');
//    echo json_encode(__('validation'));
});
//Auth::routes();
