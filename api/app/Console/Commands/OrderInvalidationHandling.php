<?php
/** +----------------------------------------------------------------------
 * | 订单失效处理
 * +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Console\Commands;

use App\Models\v1\GoodIndent;
use Illuminate\Console\Command;

class OrderInvalidationHandling extends Command
{
    protected $signature = 'order:invalidation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Order invalidation handling。';

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
        $GoodIndentAll=GoodIndent::where('state', GoodIndent::GOOD_INDENT_STATE_PAY)->where('overtime', '<=', date('Y-m-d H:i:s'))->get();
        if($GoodIndentAll){
            foreach ($GoodIndentAll as $g){
                $GoodIndent = GoodIndent::with(['goodsList'])->find($g->id);
                $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_FAILURE;
                $GoodIndent->save();
            }
        }
    }
}
