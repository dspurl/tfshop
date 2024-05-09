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

class CreateFreightsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('freights', function (Blueprint $table) {
            $table->id();
            $table->string('lang', 60)->default('zh')->comment('语言');
            $table->unsignedBigInteger('lang_parent_id')->default('0')->comment('翻译原始数据ID');
            $table->string('name', 60)->comment('模板名称');
            $table->text('location')->comment('宝贝地址json');
            $table->text('pinkage')->comment('包邮地区JSON');
            $table->tinyInteger('valuation')->comment('计价方式');
            $table->timestamps();
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `freights` COMMENT='运费模板'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('freights');
    }
}
