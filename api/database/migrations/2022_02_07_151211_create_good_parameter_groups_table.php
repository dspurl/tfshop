<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateGoodParameterGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_parameter_groups', function (Blueprint $table) {
            $table->id();
            $table->string('value',60)->comment('参数名');
            $table->unsignedTinyInteger('is_hide')->default('0')->comment('是否隐藏:0=否-no,1=是-yes');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `good_parameter_groups` COMMENT='产品参数组'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_parameter_groups');
    }
}
