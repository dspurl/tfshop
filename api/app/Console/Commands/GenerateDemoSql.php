<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class GenerateDemoSql extends Command
{
    /**
     * 生成demo数据
     *
     * @var string
     */
    protected $signature = 'generate:demo';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate demo data。';

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
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $sqls = Storage::get('./dsshop-demo.sql');
        $sqls = str_replace("\r", "\n", $sqls);
        $sqls = explode(";\n", $sqls);
        $sqls = array_filter($sqls);
        foreach ($sqls as $sql) {
            $value = trim($sql);
            DB::insert($value);
        }
    }
}
