<?php
/** +----------------------------------------------------------------------
 * | 生成数据
 * +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class GenerateSql extends Command
{
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
            throw new \Exception($fileName.__('console.generate_sql'));
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
