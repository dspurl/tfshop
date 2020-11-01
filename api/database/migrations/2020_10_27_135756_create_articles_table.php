<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->integer('column_id')->default(0)->index()->comment('栏目ID');
            $table->string('name',60)->comment('文章名称');
            $table->string('keyword',255)->nullable()->comment('关键字');
            $table->string('describes',255)->nullable()->comment('描述');
            $table->tinyInteger('show')->default(1)->comment('是否显示1是2否');
            $table->integer('sort')->default(5)->comment('排序');
            $table->integer('pv')->default(0)->comment('访问量');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `articles` COMMENT='文章'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('articles');
    }
}
