<?php

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
            $table->string('name', 30)->comment('类目名称');
            $table->integer('pid')->default(0)->comment('上级类目');
            $table->integer('sort')->default(0)->comment('排序');
            $table->tinyInteger('state')->default(0)->comment('是否显示0显示1不显示');
            $table->tinyInteger('is_recommend')->default(0)->comment('首页推荐0否1是');
            $table->softDeletes();
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
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
