<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateIntegralLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('integral_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->default('0')->comment('用户id');
            $table->unsignedTinyInteger('type')->default('0')->comment('类型:0=收入-income,1=支出-expend');
            $table->unsignedInteger('operation')->default('0')->comment('操作积分');
            $table->string('remark',300)->comment('操作说明');
            $table->unsignedBigInteger('integralable_id')->default('0')->comment('关联ID');
            $table->string('integralable_type',200)->comment('关联模型');
            $table->unsignedTinyInteger('integralable_identification')->default('0')->comment('关联标识');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `integral_logs` COMMENT='积分记录'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('integral_logs');
    }
}
