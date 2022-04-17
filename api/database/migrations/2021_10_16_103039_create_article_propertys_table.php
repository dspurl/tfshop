<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateArticlePropertysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('article_propertys', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('article_id')->default('0')->comment('文章ID');
            $table->text('details')->nullable()->comment('详情');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `article_propertys` COMMENT='文章属性'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('article_propertys');
    }
}
