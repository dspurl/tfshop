<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateNotificationLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notification_logs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->index()->comment('用户ID');
            $table->string('type', 100)->nullable()->comment('通知类型标识');
            $table->json('msg')->nullable()->comment('发送的内容');
            $table->json('feedback')->nullable()->comment('反馈的信息');
            $table->tinyInteger('state')->default(1)->comment('状态1发送成功2失败');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `notification_logs` COMMENT='通知记录'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notification_logs');
    }
}
