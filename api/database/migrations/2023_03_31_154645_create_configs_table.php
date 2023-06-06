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
use Illuminate\Support\Facades\Schema;

class CreateConfigsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('configs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->default('0')->comment('父级用户id');
            $table->string('name',30)->comment('配置名称');
            $table->unsignedTinyInteger('maxlength')->nullable()->comment('配置长度');
            $table->unsignedTinyInteger('required')->default(0)->comment('是否必填:0=否-no,1=是-yes');
            $table->text('remark')->nullable()->comment('配置说明');
            $table->string('input_type',50)->nullable()->comment('配置表单类型');
            $table->json('input_option')->nullable()->comment('表单选项');
            $table->string('keys',100)->nullable()->comment('配置key');
            $table->text('value')->nullable()->comment('配置value');
            $table->json('style')->nullable()->comment('配置表单样式');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `configs` COMMENT='配置'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('configs');
    }
}
