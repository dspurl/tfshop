<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCouponsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('name', 30)->comment('优惠券名称');
            $table->integer('cost')->nullable()->comment('优惠券价值');
            $table->tinyInteger('type')->default(1)->comment('优惠券类型:1满减2随机3折扣');
            $table->integer('amount')->nullable()->comment('数量');
            $table->integer('residue')->default(0)->comment('剩余数量');
            $table->integer('sill')->nullable()->comment('门槛');
            $table->timestamp('starttime')->nullable()->comment('优惠券领取开始时间');
            $table->timestamp('endtime')->nullable()->comment('优惠券领取结束时间');
            $table->integer('limit_get')->default(0)->comment('每人限领数量');
            $table->tinyInteger('state')->default(1)->comment('0未开始1发放中2已结束');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `coupons` COMMENT='优惠券'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coupons');
    }
}
