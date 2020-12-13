<?php

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
            $table->char('uuid',36)->index()->comment('uuid');
            $table->string('api_token',80)->comment('token');
            $table->tinyInteger('state')->default(1)->comment('状态1正常2禁止访问');
            $table->tinyInteger('unsubscribe')->default(0)->comment('是否注销1是0否');
            $table->string('name',30)->comment('账号');
            $table->string('nickname',60)->nullable()->comment('昵称');
            $table->tinyInteger('gender')->default(0)->comment('性别0未知1男2女');
            $table->integer('money')->default(0)->comment('金额');
            $table->string('email',255)->nullable()->comment('邮箱');
            $table->string('cellphone',11)->comment('手机');
            $table->string('password',255)->comment('密码');
            $table->string('portrait',255)->nullable()->comment('头像');
            $table->string('wechat',255)->nullable()->comment('微信公众平台openid');
            $table->string('miniweixin',255)->nullable()->comment('微信小程序openid');
            $table->string('minialipay',255)->nullable()->comment('支付宝小程序openid');
            $table->string('minitoutiao',255)->nullable()->comment('字节跳动小程序openid');
            $table->json('notification')->nullable()->comment('用户通知接收状态');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
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
