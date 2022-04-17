<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateIntegralDrawLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('integral_draw_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('integral_draw_id')->default('0')->comment('积分抽奖ID');
            $table->unsignedBigInteger('user_id')->default('0')->comment('用户ID');
            $table->unsignedBigInteger('model_id')->default('0')->comment('关联ID');
            $table->string('model_type',200)->nullable()->comment('关联模型');
            $table->unsignedBigInteger('integral_prize_id')->default('0')->comment('奖品ID');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `integral_draw_logs` COMMENT='积分抽奖记录'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('integral_draw_logs');
    }
}
