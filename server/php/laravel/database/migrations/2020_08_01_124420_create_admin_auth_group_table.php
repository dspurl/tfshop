<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminAuthGroupTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_auth_group', function (Blueprint $table) {
            $table->bigInteger('admin_id')->index()->comment(__('migrations.admin_auth_group.admin_id'));
            $table->bigInteger('auth_group_id')->index()->comment(__('migrations.admin_auth_group.auth_group_id'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admin_auth_group');
    }
}
