<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateDistributionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('distributions', function (Blueprint $table) {
            $table->id();
            $table->string('name',)->default('30')->comment('分销名称');
            $table->string('identification',)->default('50')->comment('分销标识');
            $table->unsignedTinyInteger('level')->default('1')->comment('分销级别:1=一级-one_level,2=二级-second_level,3=三级-three_level');
            $table->unsignedTinyInteger('state')->default('0')->comment('状态:0=打开-open,1=关闭-close');
            $table->softDeletes();
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `distributions` COMMENT='分销'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('distributions');
    }
}
