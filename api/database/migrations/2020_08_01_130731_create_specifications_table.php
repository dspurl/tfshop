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

class CreateSpecificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('specifications', function (Blueprint $table) {
            $table->id();
            $table->string('lang', 60)->default('zh')->comment('语言');
            $table->unsignedBigInteger('lang_parent_id')->default('0')->comment('翻译原始数据ID');
            $table->integer('specification_group_id')->default(0)->index()->comment('规格组ID');
            $table->string('name',30)->comment('规格名称');
            $table->tinyInteger('type')->comment('规格类型1文本2单选3多选');
            $table->tinyInteger('is_search')->default(0)->comment('是否可搜索1是');
            $table->tinyInteger('location')->default(0)->comment('显示位置0规格参数页1详情页2都显示');
            $table->text('value')->nullable()->comment('规格值');
            $table->string('label',20)->nullable()->comment('规格标注名称');
            $table->integer('sort')->default(0)->comment('排序');
            $table->softDeletes();
            $table->timestamps();
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `specifications` COMMENT='规格'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('specifications');
    }
}
