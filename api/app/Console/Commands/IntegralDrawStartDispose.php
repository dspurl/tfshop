<?php

namespace App\Console\Commands;

use App\Models\v1\IntegralDraw;
use Illuminate\Console\Command;

class IntegralDrawStartDispose extends Command
{
    /**
     * 积分抽奖自动开启
     *
     * @var string
     */
    protected $signature = 'integralDraw:start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Integral Draw Start Dispose。';

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
        IntegralDraw::where('start_time', date('Y-m-d'))->where('is_hidden', IntegralDraw::INTEGRAL_DRAW_IS_HIDDEN_NO)->update(['is_hidden' => IntegralDraw::INTEGRAL_DRAW_IS_HIDDEN_YES]);
    }
}
