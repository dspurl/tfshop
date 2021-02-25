<?php

namespace App\Console\Commands;

use App\Models\v1\GoodIndent;
use Illuminate\Console\Command;

class AutomaticReceiving extends Command
{
    /**
     * 自动收货
     *
     * @var string
     */
    protected $signature = 'automatic:receiving';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatic receiving。';

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
        $GoodIndentAll = GoodIndent::where('state', GoodIndent::GOOD_INDENT_STATE_TAKE)->where('receiving_time', '<=', date('Y-m-d H:i:s'))->get();
        if ($GoodIndentAll) {
            foreach ($GoodIndentAll as $g) {
                $GoodIndent = GoodIndent::with(['goodsList'])->find($g->id);
                $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH;
                $GoodIndent->is_automatic_receiving = GoodIndent::GOOD_INDENT_IS_AUTOMATIC_RECEIVING_YES;
                $GoodIndent->save();
            }
        }
    }
}
