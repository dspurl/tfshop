<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateShippingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shippings', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->default(0)->index()->comment('用户ID');
            $table->string('cellphone',11)->comment('手机');
            $table->string('name',50)->comment('姓名');
            $table->string('location',255)->comment('地址');
            $table->string('address',255)->comment('详情地址');
            $table->string('latitude',50)->comment('纬度');
            $table->string('longitude',50)->comment('经度');
            $table->string('house',100)->comment('门牌号');
            $table->tinyInteger('defaults')->default(0)->comment('是否默认1是0否');
            $table->timestamps();
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `shippings` COMMENT='收货人地址(和good_locations是1:N关系)'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shippings');
    }
}
