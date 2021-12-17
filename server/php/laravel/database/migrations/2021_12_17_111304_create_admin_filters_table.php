<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateAdminFiltersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_filters', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('admin_id')->default(0)->comment(__('migrations.admin_filter.admin_id'));
            $table->unsignedBigInteger('auth_rule_id')->default(0)->comment(__('migrations.admin_filter.auth_rule_id'));
            $table->string('title', 30)->comment(__('migrations.admin_filter.title'));
            $table->json('data')->comment(__('migrations.admin_filter.data'));
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `admin_filters` COMMENT='".__('migrations.admin_filter.table_name')."'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admin_filters');
    }
}
