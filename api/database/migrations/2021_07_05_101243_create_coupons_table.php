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
            $table->string('name',30)->comment('优惠券名称');
            $table->integer('cost')->default('0')->comment('优惠券价值');
            $table->unsignedTinyInteger('type')->default('1')->comment('优惠券类型:1=满减-full_reduction,2=随机-random,3=折扣-discount');
            $table->integer('amount')->default('0')->comment('数量');
            $table->integer('residue')->default('0')->comment('剩余数量');
            $table->integer('sill')->default('0')->comment('门槛');
            $table->timestamp('start_time')->comment('优惠券领取开始时间');
            $table->timestamp('end_time')->comment('优惠券领取结束时间');
            $table->unsignedInteger('limit_get')->default('0')->comment('每人限领数量');
            $table->unsignedTinyInteger('state')->default('0')->comment('状态:0=未开始-not_start,1=进行中-underway,2=已结束-finished');
            $table->softDeletes();
            $table->timestamps();
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
