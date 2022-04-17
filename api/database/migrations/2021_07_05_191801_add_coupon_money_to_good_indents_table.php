<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCouponMoneyToGoodIndentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('good_indents', function (Blueprint $table) {
            $table->integer('coupon_money')->default(0)->comment('优惠金额');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('good_indents', function (Blueprint $table) {
            $table->dropColumn('coupon_money');
        });
    }
}
