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

class CreateFreightWaysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('freight_ways', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('freight_id')->default(0)->index()->comment('运费模板ID');
            $table->integer('first_piece')->default(0)->comment('首件');
            $table->integer('first_cost')->default(0)->comment('首费');
            $table->integer('add_piece')->default(0)->comment('续件');
            $table->integer('add_cost')->default(0)->comment('续费');
            $table->text('location')->comment('送货到json');
            $table->timestamps();
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `freight_ways` COMMENT='运送方式'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('freight_ways');
    }
}
