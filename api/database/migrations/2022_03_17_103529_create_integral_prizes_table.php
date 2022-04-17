<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateIntegralPrizesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('integral_prizes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('integral_draw_id')->default('0')->comment('积分抽奖ID');
            $table->unsignedBigInteger('model_id')->default('0')->comment('关联ID');
            $table->string('model_type',200)->nullable()->comment('关联模型');
            $table->string('name',60)->comment('奖品名称');
            $table->string('value',15)->default('0')->comment('奖品价值');
            $table->unsignedInteger('recycle')->default('0')->comment('回收价值');
            $table->integer('quantity')->default('0')->comment('奖品数量');
            $table->integer('residue')->default('0')->comment('奖品剩余数量');
            $table->unsignedInteger('probability')->default('0')->comment('中奖概率');
            $table->unsignedBigInteger('sort')->default('5')->nullable()->comment('排序');
            $table->unsignedTinyInteger('is_hidden')->default('0')->comment('是否隐藏:0=否-no,1=是-yes');
            $table->softDeletes();
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `integral_prizes` COMMENT='积分抽奖奖品'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('integral_prizes');
    }
}
