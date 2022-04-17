<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateIntegralDrawsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('integral_draws', function (Blueprint $table) {
            $table->id();
            $table->string('name',20)->comment('名称');
            $table->unsignedTinyInteger('type')->default('1')->comment('抽奖类型:1=大转盘-turntable,2=九宫格-sudoku,3=老虎机-slot_machine');
            $table->unsignedTinyInteger('is_hidden')->default('0')->comment('是否隐藏:0=否-no,1=是-yes');
            $table->text('explain')->nullable()->comment('说明');
            $table->text('style')->nullable()->comment('自定义样式');
            $table->unsignedInteger('integral')->default('0')->comment('所需积分');
            $table->unsignedInteger('tries')->default('0')->comment('	限制次数');
            $table->date('start_time')->nullable()->comment('开始时间');
            $table->date('end_time')->nullable()->comment('结束时间');
            $table->softDeletes();
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `integral_draws` COMMENT='积分抽奖'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('integral_draws');
    }
}
