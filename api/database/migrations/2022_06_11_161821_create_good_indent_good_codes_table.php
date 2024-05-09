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

class CreateGoodIndentGoodCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_indent_good_codes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('good_indent_id')->default('0')->comment('订单ID');
            $table->unsignedBigInteger('good_code_id')->default('0')->comment('商品卡密ID');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `good_indent_good_codes` COMMENT='订单商品卡密'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_indent_good_codes');
    }
}
