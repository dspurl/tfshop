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
use Illuminate\Support\Facades\Schema;

class CreateGoodCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_codes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('good_sku_id')->default('0')->comment('商品SKU ID');
            $table->string('name',255)->nullable()->comment('卡号/网盘地址');
            $table->string('code',255)->comment('卡密/提取码');
            $table->unsignedTinyInteger('state')->default('0')->comment('状态:0=未兑换-no,1=已兑换-yes');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `good_codes` COMMENT='商品卡密'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_codes');
    }
}
