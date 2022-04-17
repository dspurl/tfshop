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
            $table->unsignedInteger('user_id')->default('0')->comment('用户ID');
            $table->unsignedInteger('coupon_id')->default('0')->comment('优惠券ID');
            $table->string('ticket',)->default('30')->nullable()->comment('券号');
            $table->unsignedTinyInteger('state')->default('0')->comment('状态:0=未使用-unused,1=已使用-used,2=已失效-invalid');
            $table->timestamp('failure_time')->nullable()->comment('失效时间');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `user_coupons` COMMENT='用户优惠券'");
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
