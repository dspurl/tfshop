<?php

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
            $table->string('title', 50)->comment('权限名称');
            $table->string('api', 255)->comment('别名');
            $table->string('path', 255)->comment('路由');
            $table->string('active', 255)->comment('菜单高亮');
            $table->string('redirect_url', 255)->comment('重定向');
            $table->string('view', 255)->comment('视图');
            $table->string('icon', 255)->comment('图标');
            $table->char('color', 7)->comment('颜色值');
            $table->unsignedBigInteger('pid')->default('0')->comment('父ID');
            $table->unsignedTinyInteger('type')->default('1')->comment('类型:1=菜单-menu,2=iframe-iframe,3=外链-link,4=按钮-button');
            $table->unsignedTinyInteger('is_hidden')->default('0')->comment('是否在菜单隐藏:1=是-yes,0=否-no');
            $table->unsignedTinyInteger('is_hidden_breadcrumb')->default('0')->comment('是否隐藏面包屑:1=是-yes,0=否-no');
            $table->unsignedTinyInteger('is_affix')->default('0')->comment('是否固定:1=是-yes,0=否-no');
            $table->unsignedTinyInteger('is_full_page')->default('0')->comment('是否整页打开路由:1=是-yes,0=否-no');
            $table->integer('sort')->default('5')->comment('排序：同级有效');
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `auth_rules` COMMENT='权限'");
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
