<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateUserLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index()->comment('用户ID');
            $table->json('header')->comment('请求头');
            $table->string('name', 255)->comment('路由别名');
            $table->string('path', 255)->comment('路径');
            $table->string('url', 255)->comment('请求url');
            $table->string('method', 10)->comment('请求方法');
            $table->ipAddress('ip')->comment('客户端IP');
            $table->json('param')->comment('请求参数');
            $table->timestamps();
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `user_logs` COMMENT='用户记录'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_logs');
    }
}
