<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateDistributionRulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('distribution_rules', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('distribution_id')->default('0')->comment('分销ID');
            $table->string('name',30)->comment('别名');
            $table->unsignedTinyInteger('type')->default('0')->comment('返佣方式:0=按固定值-fixed_value,1=按比例-proportion');
            $table->unsignedTinyInteger('level')->default('1')->comment('级别:1=一级-one_level,2=二级-second_level,3=三级-three_level');
            $table->integer('price')->default('0')->comment('返佣值');
            $table->softDeletes();
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `distribution_rules` COMMENT='分销规则'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('distribution_rules');
    }
}
