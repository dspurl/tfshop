<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateCategoryGoodParameterGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category_good_parameter_groups', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('category_id')->default('0')->comment('分类ID');
            $table->unsignedInteger('good_parameter_group_id')->default('0')->comment('产品参数组ID');
        });
        DB::statement("ALTER TABLE `category_good_parameter_groups` COMMENT='分类-产品参数组关联'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('category_good_parameter_groups');
    }
}
