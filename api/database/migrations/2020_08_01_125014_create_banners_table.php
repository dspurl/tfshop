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
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateBannersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('type')->default(0)->comment('0首页轮播1首页广告2登录页广告3友情链接');
            $table->string('name', 30)->comment('轮播名称');
            $table->string('url', 255)->nullable()->comment('轮播地址');
            $table->integer('sort')->default(0)->comment('轮播排序');
            $table->tinyInteger('state')->default(0)->comment('是否显示0显示1隐藏');
            $table->timestamps();
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `banners` COMMENT='轮播'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('banners');
    }
}
