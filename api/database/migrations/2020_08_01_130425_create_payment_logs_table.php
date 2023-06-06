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
