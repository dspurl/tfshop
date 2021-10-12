<?php

namespace App\Console\Commands;

use App\Models\v1\Admin;
use App\Models\v1\GoodIndentCommodity;
use App\Models\v1\Resource;
use App\Models\v1\User;
use Illuminate\Console\Command;

class ResourceMigration extends Command
{
    /**
     * 本地资源一键迁移
     *
     * @var string
     */
    protected $signature = 'resource:migration';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Resource migration。';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 本地资源一键迁移
     *
     * @return void
     */
    public function handle()
    {
        // 只迁移本地资源
        $Resource = Resource::get();
        foreach ($Resource as $r) {
            $con = explode("/storage", $r->img);
            if (count($con) > 1) {
                $con[0] = request()->root();
                Resource::where('id', $r->id)->update(['img' => implode("/storage", $con)]);
            }
        }
        $Admin = Admin::get();
        foreach ($Admin as $a) {
            $con = explode("/storage", $a->portrait);
            if (count($con) > 1) {
                $con[0] = request()->root();
                Admin::where('id', $a->id)->update(['portrait' => implode("/storage", $con)]);
            }
        }
        $User = User::get();
        foreach ($User as $u) {
            $con = explode("/storage", $u->portrait);
            if (count($con) > 1) {
                $con[0] = request()->root();
                User::where('id', $u->id)->update(['portrait' => implode("/storage", $con)]);
            }
        }
        $GoodIndentCommodity = GoodIndentCommodity::get();
        foreach ($GoodIndentCommodity as $g) {
            $con = explode("/storage", $g->img);
            if (count($con) > 1) {
                $con[0] = request()->root();
                GoodIndentCommodity::where('id', $g->id)->update(['img' => implode("/storage", $con)]);
            }
        }
    }
}
