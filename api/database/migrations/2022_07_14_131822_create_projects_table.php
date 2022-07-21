<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name',80)->comment('项目名称');
            $table->string('cover',255)->comment('封面');
            $table->json('pages')->nullable()->comment('页面');
            $table->json('config')->nullable()->comment('配置');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `projects` COMMENT='商城'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('projects');
    }
}
