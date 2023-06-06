<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateGoodSpecificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_specifications', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('good_id')->default(0)->index()->comment('商品ID');
            $table->bigInteger('specification_id')->default(0)->index()->comment('规格ID');
            $table->text('data')->nullable()->comment('值JSON');
            $table->timestamps();
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `good_specifications` COMMENT='商品规格表'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_specifications');
    }
}
