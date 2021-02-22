<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateGoodSkusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_skus', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('good_id')->default(0)->index()->comment('商品ID');
            $table->integer('market_price')->default(0)->comment('市场价');
            $table->integer('cost_price')->default(0)->comment('成本价');
            $table->integer('price')->default(0)->comment('销售价');
            $table->integer('inventory')->default(0)->comment('库存');
            $table->text('product_sku')->comment('json商品规格');
            $table->softDeletes();
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `good_skus` COMMENT='商品SKU'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_skus');
    }
}
