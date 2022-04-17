<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateIntegralCommoditysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('integral_commoditys', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('good_id')->default('0')->comment('商品ID');
            $table->unsignedTinyInteger('type')->default(1)->comment('积分抵扣方式:0=固定值-fixed,1=百分比-percentage');
            $table->unsignedInteger('value')->default(100)->comment('积分可抵扣值');
            $table->unsignedTinyInteger('is_hidden')->default(1)->comment('是否隐藏:0=否-no,1=是-yes');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `integral_commoditys` COMMENT='积分商品'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('integral_commoditys');
    }
}
