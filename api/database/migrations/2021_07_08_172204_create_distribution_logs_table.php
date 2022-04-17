<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateDistributionLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('distribution_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id')->default('0')->comment('用户ID');
            $table->unsignedInteger('children_id')->default('0')->comment('返佣触发人ID');
            $table->string('name',30)->comment('分销名称');
            $table->unsignedTinyInteger('type')->default('0')->comment('返佣方式:0=按固定值-fixed_value,1=按比例-proportion');
            $table->unsignedTinyInteger('level')->default('1')->comment('级别:1=一级-one_level,2=二级-second_level,3=三级-three_level');
            $table->integer('price')->default('0')->comment('返佣金额');
            $table->unsignedTinyInteger('state')->default('0')->comment('分销状态:0=触发-trigger,1=成功-succeed');
            $table->softDeletes();
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `distribution_logs` COMMENT='分销记录'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('distribution_logs');
    }
}
