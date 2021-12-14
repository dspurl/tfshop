<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateResourceGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('resource_groups', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->unsignedSmallInteger('pid')->default('0')->comment(__('migrations.resource_group.pid'));
            $table->string('name', 20)->comment(__('migrations.resource_group.name'));
            $table->unsignedTinyInteger('sort')->default('1')->comment(__('migrations.resource_group.sort'));
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `resource_groups` COMMENT='" . __('migrations.resource_group.table_name') . "'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('resource_groups');
    }
}
