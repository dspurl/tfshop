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
            $table->unsignedInteger('column_id')->default('0')->comment('栏目ID');
            $table->string('name',60)->comment('文章名称');
            $table->string('keyword',255)->nullable()->comment('关键字');
            $table->string('describes',255)->nullable()->comment('描述');
            $table->string('template',60)->default('defaultArticle')->comment('模板');
            $table->unsignedTinyInteger('is_show')->default('1')->comment('是否显示:1=是-yes,2=否-no');
            $table->unsignedInteger('sort')->default('5')->comment('排序');
            $table->unsignedInteger('pv')->default('0')->comment('访问量');
            $table->timestamps();
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
