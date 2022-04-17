<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateGoodIndentUserCouponsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_indent_user_coupons', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('good_indent_id')->default('0')->comment('订单ID');
            $table->unsignedInteger('user_coupon_id')->default('0')->comment('用户优惠券ID');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `good_indent_user_coupons` COMMENT='订单优惠券'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_indent_user_coupons');
    }
}
