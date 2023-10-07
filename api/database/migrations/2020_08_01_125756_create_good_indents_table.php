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

class CreateGoodIndentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_indents', function (Blueprint $table) {
            $table->id();
            $table->string('lang', 60)->default('zh')->comment('语言');
            $table->bigInteger('user_id')->default(0)->index()->comment('用户ID');
            $table->string('consignee', 30)->nullable()->comment('收货人名称');
            $table->unsignedTinyInteger('type')->default(0)->comment('类型:0=普通订单-common,1=秒杀订单-seckill,2=拼团订单-group_purchase');
            $table->tinyInteger('state')->default(1)->comment('状态:1待付款2待发货3待收货4已失效5已完成6已取消7已退款8退款处理中9退款失败10待评价11已评价12待成团');
            $table->integer('total')->default(0)->comment('订单总金额');
            $table->string('identification', 50)->comment('订单标识');
            $table->integer('carriage')->default(0)->comment('运费');
            $table->bigInteger('dhl_id')->default(0)->index()->comment('快递公司ID');
            $table->string('odd', 255)->nullable()->comment('运单号');
            $table->string('remark', 200)->nullable()->comment('备注');
            $table->integer('refund_money')->default(0)->comment('退款金额');
            $table->tinyInteger('refund_way')->default(0)->comment('退款方式0余额1原路退回');
            $table->tinyInteger('pay_way')->default(0)->comment('支付方式0余额1在线支付');
            $table->softDeletes();
            $table->string('refund_reason', 500)->nullable()->comment('退款原因');
            $table->timestamp('overtime')->nullable()->comment('超时时间');
            $table->timestamp('pay_time')->nullable()->comment('付款时间');
            $table->timestamp('shipping_time')->nullable()->comment('发货时间');
            $table->timestamp('confirm_time')->nullable()->comment('订单完成时间');
            $table->timestamp('refund_time')->nullable()->comment('退款时间');
            $table->tinyInteger('is_automatic_receiving')->default(0)->comment('自动确认收货1是0否');
            $table->timestamp('receiving_time')->nullable()->comment('收货时间');
            $table->timestamps();
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `good_indents` COMMENT='订单'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_indents');
    }
}
