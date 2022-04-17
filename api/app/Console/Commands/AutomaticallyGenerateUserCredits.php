<?php

namespace App\Console\Commands;

use App\Models\v1\Integral;
use App\Models\v1\User;
use Illuminate\Console\Command;

class AutomaticallyGenerateUserCredits extends Command
{
    /**
     * 自动创建用户积分
     *
     * @var string
     */
    protected $signature = 'automatic:userCredits';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically generate user credits。';

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
     *
     * @return void
     */
    public function handle()
    {
        $User = User::get();
        foreach ($User as $u) {
            $Integral = Integral::find($u->id);
            if (!$Integral) {
                $Integral = new Integral();
                $Integral->user_id = $u->id;
                $Integral->save();
            }
        }
    }
}
