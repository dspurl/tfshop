<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateGoodParameterGroupGoodParametersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_parameter_group_good_parameters', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('good_parameter_group_id')->default('0')->comment('产品参数组ID');
            $table->unsignedInteger('good_parameter_id')->default('0')->comment('产品参数ID');
        });
        DB::statement("ALTER TABLE `good_parameter_group_good_parameters` COMMENT='产品参数组-产品参数关联'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_parameter_group_good_parameters');
    }
}
