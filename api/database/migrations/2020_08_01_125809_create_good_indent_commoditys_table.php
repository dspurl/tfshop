<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateGoodIndentCommoditysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_indent_commoditys', function (Blueprint $table) {
            $table->id();
            $table->integer('good_indent_id')->default(0)->index()->comment('订单ID');
            $table->integer('good_id')->default(0)->index()->comment('商品ID');
            $table->integer('good_sku_id')->default(0)->index()->comment('商品SKUID');
            $table->string('img',255)->comment('图片');
            $table->string('name',60)->comment('商品名称');
            $table->integer('price')->default(0)->comment('售价');
            $table->integer('number')->default(0)->comment('数量');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `good_indent_commoditys` COMMENT='订单商品'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_indent_commoditys');
    }
}
