<?php

namespace App\Console\Commands;

use App\Models\v1\Coupon;
use Illuminate\Console\Command;

class CouponStartDispose extends Command
{
    /**
     * 优惠券自动开启
     *
     * @var string
     */
    protected $signature = 'coupon:start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Coupon start。';

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
     */
    public function handle()
    {
        Coupon::where('start_time', date('Y-m-d'))->where('state', Coupon::COUPON_STATE_NOT_START)->update(['state' => Coupon::COUPON_STATE_UNDERWAY]);
    }
}
