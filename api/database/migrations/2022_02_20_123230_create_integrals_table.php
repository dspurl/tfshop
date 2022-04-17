<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateIntegralsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('integrals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->default('0')->comment('用户ID');
            $table->unsignedInteger('total')->default('0')->comment('总积分');
            $table->unsignedInteger('available')->default('0')->comment('可用积分');
            $table->softDeletes();
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `integrals` COMMENT='积分'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('integrals');
    }
}
