<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEvaluateTimeToGoodIndentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('good_indents', function (Blueprint $table) {
            $table->timestamp('evaluate_time')->nullable()->comment('评价时间');
            $table->tinyInteger('is_automatic_evaluate')->default(0)->comment('自动好评1是0否');
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
            $table->dropColumn('evaluate_time');
            $table->dropColumn('is_automatic_evaluate');
        });
    }
}
