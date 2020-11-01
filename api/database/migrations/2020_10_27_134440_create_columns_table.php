<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateColumnsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('columns', function (Blueprint $table) {
            $table->id();
            $table->string('name',60)->comment('栏目名称');
            $table->integer('pid')->default(0)->comment('上级栏目ID');
            $table->string('keyword',255)->nullable()->comment('关键字');
            $table->string('describes',255)->nullable()->comment('描述');
            $table->tinyInteger('show')->default(1)->comment('是否显示1是2否');
            $table->tinyInteger('list')->default(0)->comment('是否列表1是0否');
            $table->integer('sort')->default(5)->comment('排序');
            $table->integer('pv')->default(0)->comment('访问量');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `columns` COMMENT='文章栏目'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('columns');
    }
}
