<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateUserRelationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_relations', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('children_id')->default('0')->comment('子级用户id');
            $table->unsignedInteger('parent_id')->default('0')->comment('父级用户id');
            $table->unsignedTinyInteger('level')->default('0')->comment('用户等级:1=一级-one_level,2=二级-second_level,3=三级-three_level');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE `user_relations` COMMENT='用户关系表'");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_relations');
    }
}
