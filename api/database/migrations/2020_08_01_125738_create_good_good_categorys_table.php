<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateGoodGoodCategorysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_good_categorys', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('good_id')->index()->default(0)->comment('商品ID');
            $table->bigInteger('good_category_id')->index()->default(0)->comment('商品分类ID');
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `good_good_categorys` COMMENT='商品-商品分类中间表'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_good_categorys');
    }
}
