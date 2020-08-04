<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateDhlsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dhls', function (Blueprint $table) {
            $table->id();
            $table->string('name', 30)->comment('类目名称');
            $table->string('abbreviation', 80)->comment('类目名称');
            $table->tinyInteger('state')->default(0)->comment('状态0显示1隐藏');
            $table->integer('sort')->default(5)->comment('排序');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `dhls` COMMENT='物流公司'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dhls');
    }
}
