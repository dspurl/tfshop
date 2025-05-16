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

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateAdminFiltersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_filters', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('admin_id')->default(0)->comment("管理员ID");
            $table->unsignedBigInteger('auth_rule_id')->default(0)->comment("过滤器对应权限");
            $table->string('title', 30)->comment("过滤器名称");
            $table->json('data')->comment("过滤器条件");
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `admin_filters` COMMENT='过滤器'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admin_filters');
    }
}
