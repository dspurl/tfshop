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
            $table->unsignedSmallInteger('pid')->default('0')->comment('父ID');
            $table->string('name', 20)->comment('资源分组名称');
            $table->unsignedTinyInteger('sort')->default('1')->comment('排序');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `resource_groups` COMMENT='资源分组'");
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
