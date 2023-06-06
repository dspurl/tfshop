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

class CreateMoneyLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('money_logs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->default(0)->index()->comment('用户ID');
            $table->tinyInteger('type')->default(0)->comment('类型0:收入1：支出');
            $table->integer('money')->default(0)->comment('操作金额');
            $table->string('remark',300)->nullable()->comment('操作说明');
            $table->timestamps();
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `money_logs` COMMENT='资金记录'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('money_logs');
    }
}
