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
            $table->smallIncrements('id');
            $table->unsignedBigInteger('user_id')->default(0)->index()->comment(__('migrations.admin.user_id'));
            $table->string('name', 50)->comment(__('migrations.admin.name'));
            $table->string('real_name', 75)->comment(__('migrations.admin.real_name'));
            $table->string('email', 255)->comment(__('migrations.admin.email'));
            $table->char('cellphone', 11)->comment(__('migrations.admin.cellphone'));
            $table->string('password', 255)->comment(__('migrations.admin.password'));
            $table->string('portrait', 20)->nullable()->comment(__('migrations.admin.portrait'));
            $table->unsignedInteger('state')->default(1)->comment(__('migrations.admin.state'));
            $table->timestamps();
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `admins` COMMENT='".__('migrations.admin.table_name')."'");
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
