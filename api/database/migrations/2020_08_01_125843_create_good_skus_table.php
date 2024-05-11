<?php
/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
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
            $table->unsignedTinyInteger('code_type')->default(0)->comment('卡密类型:0=卡密-cdkey,1=网盘-net_disk');
            $table->unsignedTinyInteger('is_fixed')->default(1)->comment('是否固定卡密:0=否-no,1=是-yes');
            $table->text('product_sku')->comment('json商品规格');
            $table->softDeletes();
            $table->timestamps();
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
