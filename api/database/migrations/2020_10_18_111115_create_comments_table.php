<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->integer('model_id')->default(0)->index()->comment('评论关联模型ID');
            $table->string('model_type',200)->comment('评论关联的模型');
            $table->bigInteger('user_id')->default(0)->index()->comment('用户ID');
            $table->bigInteger('parent_id')->default(0)->comment('父节点ID');
            $table->string('title', 60)->comment('评论标题');
            $table->string('details',800)->comment('回复内容');
            $table->tinyInteger('state')->default(0)->comment('状态0待审核1通过2失败');
            $table->tinyInteger('anonymity')->default(0)->comment('是否匿名0否1是');
            $table->tinyInteger('score')->default(0)->comment('评分');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `comments` COMMENT='评论'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evaluates');
    }
}
