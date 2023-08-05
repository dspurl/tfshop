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

class CreateCategorysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categorys', function (Blueprint $table) {
            $table->id();
            $table->string('lang', 60)->default('zh')->comment('语言');
            $table->unsignedBigInteger('lang_parent_id')->default('0')->comment('翻译原始数据ID');
            $table->string('name', 30)->comment('类目名称');
            $table->integer('pid')->default(0)->comment('上级类目');
            $table->integer('sort')->default(0)->comment('排序');
            $table->tinyInteger('state')->default(0)->comment('是否显示0显示1不显示');
            $table->tinyInteger('is_recommend')->default(0)->comment('首页推荐0否1是');
            $table->softDeletes();
            $table->timestamps();
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `categorys` COMMENT='分类'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categorys');
    }
}
