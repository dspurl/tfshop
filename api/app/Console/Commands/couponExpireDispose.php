<?php

namespace App\Console\Commands;

use App\Models\v1\Coupon;
use App\Models\v1\UserCoupon;
use Illuminate\Console\Command;

class couponExpireDispose extends Command
{
    /**
     * 优惠券到期结束
     *
     * @var string
     */
    protected $signature = 'coupon:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Coupon expires。';

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
        $Coupon=Coupon::where('endtime',date('Y-m-d'))->where('state',Coupon::COUPON_STATE_SHOW)->get();
        foreach ($Coupon as $c){
            UserCoupon::where('coupon_id',$c->id)->where('state',UserCoupon::USER_COUPON_STATE_UNUSED)->update(['state' => UserCoupon::USER_COUPON_STATE_XSE]);
        }
        Coupon::where('endtime',date('Y-m-d'))->where('state',Coupon::COUPON_STATE_SHOW)->update(['state' => Coupon::COUPON_STATE_HIDE]);
    }
}
