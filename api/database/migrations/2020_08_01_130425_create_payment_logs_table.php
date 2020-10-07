<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreatePaymentLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payment_logs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->index()->comment('用户ID');
            $table->string('name',128)->nullable()->comment('订单描述');
            $table->string('number',50)->comment('订单号');
            $table->string('transaction_id',50)->nullable()->comment('支付订单号');
            $table->integer('money')->default(0)->comment('金额');
            $table->text('data')->nullable()->comment('订单详情json');
            $table->tinyInteger('state')->default(0)->comment('状态0生成1完成2失败');
            $table->bigInteger('pay_id')->default(0)->comment('支付对应的ID');
            $table->string('pay_type',200)->nullable()->comment('支付对应的模型');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `payment_logs` COMMENT='支付记录'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payment_logs');
    }
}
