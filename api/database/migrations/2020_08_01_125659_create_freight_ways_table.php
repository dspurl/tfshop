<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateFreightWaysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('freight_ways', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('freight_id')->default(0)->index()->comment('运费模板ID');
            $table->integer('first_piece')->default(0)->comment('首件');
            $table->integer('first_cost')->default(0)->comment('首费');
            $table->integer('add_piece')->default(0)->comment('续件');
            $table->integer('add_cost')->default(0)->comment('续费');
            $table->text('location')->comment('送货到json');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `freight_ways` COMMENT='运送方式'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('freight_ways');
    }
}
