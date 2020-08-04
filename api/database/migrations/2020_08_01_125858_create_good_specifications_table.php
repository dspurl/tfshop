<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateGoodSpecificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_specifications', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('good_id')->default(0)->index()->comment('商品ID');
            $table->bigInteger('specification_id')->default(0)->index()->comment('规格ID');
            $table->text('data')->nullable()->comment('值JSON');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `good_specifications` COMMENT='商品规格表'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_specifications');
    }
}
