<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateGoodLocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('good_locations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('good_indent_id')->default(0)->index()->comment('订单ID');
            $table->string('cellphone',11)->comment('手机');
            $table->string('name',50)->comment('姓名');
            $table->string('location',255)->comment('地址');
            $table->string('address',255)->comment('详情地址');
            $table->string('latitude',50)->comment('纬度');
            $table->string('longitude',50)->comment('经度');
            $table->string('house',100)->comment('门牌号');
            $table->timestamps();
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `good_locations` COMMENT='订单配送地址'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_locations');
    }
}
