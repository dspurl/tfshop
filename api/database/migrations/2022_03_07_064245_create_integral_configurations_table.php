<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateIntegralConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('integral_configurations', function (Blueprint $table) {
            $table->id();
            $table->string('name',20)->comment('配置名称');
            $table->string('system',30)->comment('系统变量：用于系统内部调用，一般以sys_开头');
            $table->string('value',30)->comment('配置值');
            $table->string('explain',200)->comment('配置说明');
            $table->unsignedTinyInteger('is_hidden')->default('0')->comment('是否隐藏:0=否-no,1=是-yes');
            $table->softDeletes();
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `integral_configurations` COMMENT='积分配置'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('integral_configurations');
    }
}
