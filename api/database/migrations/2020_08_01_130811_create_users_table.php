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

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('lang', 60)->default('zh')->comment('语言');
            $table->char('uuid',36)->index()->comment('uuid');
            $table->string('name',36)->comment('账号');
            $table->string('password',255)->comment('密码');
            $table->tinyInteger('state')->default(1)->comment('状态1正常2禁止访问');
            $table->tinyInteger('unsubscribe')->default(0)->comment('是否注销1是0否');
            $table->string('nickname',60)->nullable()->comment('昵称');
            $table->tinyInteger('gender')->default(0)->comment('性别0未知1男2女');
            $table->integer('money')->default(0)->comment('金额');
            $table->string('email',255)->nullable()->comment('邮箱');
            $table->string('cellphone',11)->nullable()->comment('手机');
            $table->string('portrait',255)->nullable()->comment('头像');
            $table->string('platform',150)->nullable()->comment('平台标识');
            $table->string('openid',255)->nullable()->comment('openid');
            $table->json('notification')->nullable()->comment('用户通知接收状态');
            $table->timestamps();
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `users` COMMENT='用户'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
