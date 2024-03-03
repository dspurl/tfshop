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

class CreateUserPlatformsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_platforms', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->default('0')->comment('关联账号ID');
            $table->string('lang', 60)->default('zh')->comment('语言');
            $table->string('platform',150)->nullable()->comment('平台标识');
            $table->string('openid',255)->nullable()->comment('openid');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `user_platforms` COMMENT='用户第三方平台账号'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_platforms');
    }
}
