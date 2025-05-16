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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateResourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('resource_type_id')->default(0)->comment("资源类型id");
            $table->unsignedTinyInteger('resource_group_id')->default(0)->comment("资源分组ID");
            $table->unsignedBigInteger('resource_id')->default(0)->comment("关联资源ID");
            $table->string('name', 30)->comment("资源名称");
            $table->string('depict', 100)->comment("资源别名");
            $table->string('url', 255)->comment("资源地址");
            $table->json('info')->comment("上传信息");
            $table->timestamps();
            $table->unique('id');
            $table->softDeletes();
        });
        DB::statement("ALTER TABLE `resources` COMMENT='资源'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('resources');
    }
}
