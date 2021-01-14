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
            $table->string('name',128)->nullable()->comment('订单描述');
            $table->string('number',50)->comment('商户订单号(注意, 这不是商品订单号,不要用这个查询订单,请用pay_id)');
            $table->string('transaction_id',50)->nullable()->comment('支付订单号');
            $table->integer('money')->default(0)->comment('金额');
            $table->text('data')->nullable()->comment('订单详情json');
            $table->tinyInteger('state')->default(0)->comment('状态0生成1完成2失败');
            $table->bigInteger('pay_id')->default(0)->comment('支付对应的订单ID');
            $table->string('pay_type',200)->nullable()->comment('支付对应的模型');
            $table->string('type',80)->nullable()->comment('支付类型标识');
            $table->string('platform',50)->nullable()->comment('支付平台');
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
