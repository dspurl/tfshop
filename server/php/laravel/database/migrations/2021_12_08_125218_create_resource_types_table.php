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
            $table->string('name', 20)->comment('资源类型名称');
            $table->string('alias', 20)->comment('资源类型别名');
            $table->string('icon', 80)->comment('资源类型图标');
            $table->unsignedInteger('size')->default(0)->comment('资源类型大小');
            $table->json('extension')->comment('资源类型后缀');
            $table->json('specification')->comment('资源类型规格');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `resource_types` COMMENT='资源类型'");
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
