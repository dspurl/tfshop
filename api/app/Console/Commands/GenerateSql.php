<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class GenerateSql extends Command
{
    /**
     * 生成数据
     *
     * @var string
     */
    protected $signature = 'generate:sql {name?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate sql data。';

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
     * @return void
     * @throws \Exception
     */
    public function handle()
    {
        $name = $this->argument('name') ? $this->argument('name') : 'demo';
        $fileName = "./$name.sql";
        if(!Storage::exists($fileName)){
            throw new \Exception($fileName.'文件不存在');
        }
        $data = Storage::get($fileName);
        $data = str_replace("\r", "\n", $data);
        $data = explode(";\n", $data);
        $data = array_filter($data);
        foreach ($data as $sql) {
            $value = trim($sql);
            DB::insert($value);
        }
    }
}
