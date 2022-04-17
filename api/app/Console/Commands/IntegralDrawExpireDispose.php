<?php

namespace App\Console\Commands;

use App\Models\v1\IntegralDraw;
use Illuminate\Console\Command;

class IntegralDrawExpireDispose extends Command
{
    /**
     * 积分抽奖到期结束
     *
     * @var string
     */
    protected $signature = 'integralDraw:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Integral Draw Expire Dispose。';

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
        IntegralDraw::where('end_time', date('Y-m-d'))->where('is_hidden', IntegralDraw::INTEGRAL_DRAW_IS_HIDDEN_YES)->update(['is_hidden' => IntegralDraw::INTEGRAL_DRAW_IS_HIDDEN_NO]);
    }
}
