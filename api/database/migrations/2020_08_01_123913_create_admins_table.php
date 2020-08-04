<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateAdminsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('state')->default(1);
            $table->string('name', 30)->index();
            $table->string('email', 255);
            $table->string('cellphone', 11);
            $table->string('password', 255);
            $table->string('portrait', 255);
            $table->timestamp('time')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->timestamps();
            $table->unique('id');
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
        });
        DB::statement("ALTER TABLE `admins` COMMENT='管理员表'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admins');
    }
}
