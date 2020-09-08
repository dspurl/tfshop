<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserCouponsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_coupons', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->default(0)->index()->comment('用户ID');
            $table->bigInteger('coupon_id')->default(0)->index()->comment('优惠券ID');
            $table->string('ticket', 30)->nullable()->comment('券号');
            $table->tinyInteger('state')->default(0)->comment('状态0未使用1已使用2已失效');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `coupons` COMMENT='用户优惠券'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_coupons');
    }
}
