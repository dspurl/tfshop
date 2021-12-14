<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateResourceTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('resource_types', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->uuid('uuid');
            $table->string('name', 20)->comment(__('migrations.resource_type.name'));
            $table->string('alias', 20)->comment(__('migrations.resource_type.alias'));
            $table->string('icon', 80)->comment(__('migrations.resource_type.icon'));
            $table->unsignedInteger('size')->default(0)->comment(__('migrations.resource_type.size'));
            $table->json('extension')->comment(__('migrations.resource_type.extension'));
            $table->json('specification')->comment(__('migrations.resource_type.specification'));
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `resource_types` COMMENT='" . __('migrations.resource_type.table_name') . "'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('resource_types');
    }
}
