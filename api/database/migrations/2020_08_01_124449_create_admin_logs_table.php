<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateAdminLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_logs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('admin_id')->index()->comment('管理员ID');
            $table->string('path', 255)->comment('路径');
            $table->string('method', 10)->comment('请求方法');
            $table->ipAddress('ip')->comment('IP');
            $table->text('input')->comment('提交的数据');
            $table->timestamps();
            $table->unique('id');
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
        });
        DB::statement("ALTER TABLE `admin_logs` COMMENT='管理员记录'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admin_logs');
    }
}
