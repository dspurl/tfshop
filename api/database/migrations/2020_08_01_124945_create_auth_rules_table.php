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

class CreateAuthRulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('auth_rules', function (Blueprint $table) {
            $table->id();
            $table->string('lang', 60)->default('zh')->comment('语言');
            $table->unsignedBigInteger('lang_parent_id')->default('0')->comment('翻译原始数据ID');
            $table->string('title', 50)->comment("权限名称");
            $table->string('api', 255)->comment("对应前端的模板名");
            $table->string('path', 255)->comment("路由");
            $table->string('active', 255)->comment("菜单高亮");
            $table->string('redirect_url', 255)->comment("重定向");
            $table->string('view', 255)->comment("视图");
            $table->string('icon', 20)->comment("菜单小图标");
            $table->char('color', 7)->comment("颜色值");
            $table->unsignedBigInteger('pid')->default('0')->comment("父ID");
            $table->unsignedTinyInteger('type')->default('1')->comment("类型:1=菜单-menu,2=iframe-iframe,3=外链-link");
            $table->unsignedTinyInteger('is_hidden')->default('0')->comment("是否在菜单隐藏:1=是-yes,0=否-no");
            $table->unsignedTinyInteger('is_hidden_breadcrumb')->default('0')->comment("是否隐藏面包屑:1=是-yes,0=否-no");
            $table->unsignedTinyInteger('is_affix')->default('0')->comment("是否固定:1=是-yes,0=否-no");
            $table->unsignedTinyInteger('is_full_page')->default('0')->comment("是否整页打开路由:1=是-yes,0=否-no");
            $table->unsignedTinyInteger('sort')->default('1')->comment("排序：同级有效");
            $table->unique('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('auth_rules');
    }
}
