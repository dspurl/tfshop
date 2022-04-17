<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateGoodParametersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_parameters', function (Blueprint $table) {
            $table->id();
            $table->string('value',60)->comment('参数名');
            $table->unsignedTinyInteger('is_hide')->default('0')->comment('是否隐藏:0=否-no,1=是-yes');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `good_parameters` COMMENT='产品参数'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_parameters');
    }
}
