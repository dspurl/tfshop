<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateAuthRulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('auth_rules', function (Blueprint $table) {
            $table->id();
            $table->string('title', 50)->comment(__('migrations.auth_rule.title'));
            $table->string('api', 255)->comment(__('migrations.auth_rule.api'));
            $table->string('path', 255)->comment(__('migrations.auth_rule.path'));
            $table->string('active', 255)->comment(__('migrations.auth_rule.active'));
            $table->string('redirect_url', 255)->comment(__('migrations.auth_rule.redirect_url'));
            $table->string('view', 255)->comment(__('migrations.auth_rule.view'));
            $table->string('icon', 255)->comment(__('migrations.auth_rule.icon'));
            $table->char('color', 7)->comment(__('migrations.auth_rule.color'));
            $table->unsignedBigInteger('pid')->default('0')->comment(__('migrations.auth_rule.pid'));
            $table->unsignedTinyInteger('type')->default('1')->comment(__('migrations.auth_rule.type'));
            $table->unsignedTinyInteger('is_hidden')->default('0')->comment(__('migrations.auth_rule.is_hidden'));
            $table->unsignedTinyInteger('is_hidden_breadcrumb')->default('0')->comment(__('migrations.auth_rule.is_hidden_breadcrumb'));
            $table->unsignedTinyInteger('is_affix')->default('0')->comment(__('migrations.auth_rule.is_affix'));
            $table->unsignedTinyInteger('is_full_page')->default('0')->comment(__('migrations.auth_rule.is_full_page'));
            $table->unsignedTinyInteger('sort')->default('1')->comment(__('migrations.auth_rule.sort'));
            $table->unique('id');
        });
        DB::statement("ALTER TABLE `auth_rules` COMMENT='" . __('migrations.auth_rule.table_name') . "'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('auth_rules');
    }
}
