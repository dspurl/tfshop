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
            $table->unsignedInteger('model_id')->default('0')->comment('评论关联模型ID');
            $table->string('model_type',200)->comment('评论关联的模型');
            $table->unsignedInteger('user_id')->default('0')->comment('用户ID');
            $table->unsignedInteger('parent_id')->default('0')->comment('父节点ID');
            $table->string('title',60)->comment('评论标题');
            $table->string('details',800)->nullable()->comment('回复内容');
            $table->unsignedTinyInteger('state')->default('0')->comment('状态:0=待审核-audit,1=通过-pass,2=失败-fail');
            $table->unsignedTinyInteger('anonymity')->default('0')->comment('是否匿名:0=否-no,1=是-yes');
            $table->unsignedTinyInteger('score')->default('0')->comment('评分');
            $table->timestamps();
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
        Schema::dropIfExists('comments');
    }
}
