<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateBannersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('type')->default(0)->comment('0首页轮播1首页广告');
            $table->string('name', 30)->comment('轮播名称');
            $table->string('url', 255)->nullable()->comment('轮播地址');
            $table->integer('sort')->default(0)->comment('轮播排序');
            $table->tinyInteger('state')->default(0)->comment('是否显示0显示1隐藏');
            $table->timestamps();
            $table->unique('id');
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
        });
        DB::statement("ALTER TABLE `banners` COMMENT='轮播'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('banners');
    }
}
