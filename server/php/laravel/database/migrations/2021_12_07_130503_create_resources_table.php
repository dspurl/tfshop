<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateResourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('resource_type_id')->default(0)->comment(__('migrations.resource.resource_type_id'));
            $table->unsignedTinyInteger('resource_group_id')->default(0)->comment(__('migrations.resource.resource_group_id'));
            $table->unsignedBigInteger('resource_id')->default(0)->comment(__('migrations.resource.resource_id'));
            $table->string('name', 30)->comment(__('migrations.resource.name'));
            $table->string('depict', 100)->comment(__('migrations.resource.depict'));
            $table->string('url', 255)->comment(__('migrations.resource.url'));
            $table->json('info')->comment(__('migrations.resource.info'));
            $table->timestamps();
            $table->unique('id');
            $table->softDeletes();
        });
        DB::statement("ALTER TABLE `resources` COMMENT='" . __('migrations.resource.table_name') . "'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('resources');
    }
}
