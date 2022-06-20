<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGoodIndentGoodCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_indent_good_codes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('good_indent_id')->default('0')->comment('订单ID');
            $table->unsignedBigInteger('good_code_id')->default('0')->comment('商品卡密ID');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `good_indent_good_codes` COMMENT='订单商品卡密'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_indent_good_codes');
    }
}
