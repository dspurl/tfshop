<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDistributionRulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('distribution_rules', function (Blueprint $table) {
            $table->id();
            $table->integer('distribution_id ')->nullable()->index()->comment('分销ID');
            $table->string('name',30)->nullable()->comment('别名');
            $table->tinyInteger('type')->default(0)->comment('返佣方式0固定金额1百分比');
            $table->integer('price')->nullable()->comment('返佣值');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `distribution_rules` COMMENT='分销规则表'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('distribution_rules');
    }
}
