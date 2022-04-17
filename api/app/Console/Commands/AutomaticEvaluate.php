<?php

namespace App\Console\Commands;

use App\Models\v1\GoodIndent;
use Illuminate\Console\Command;

class AutomaticEvaluate extends Command
{
    /**
     * 自动评价
     *
     * @var string
     */
    protected $signature = 'automatic:evaluate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatic evaluate。';

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
        $GoodIndentAll = GoodIndent::where('state', GoodIndent::GOOD_INDENT_STATE_EVALUATE)->where('evaluate_time', '<=', date('Y-m-d H:i:s'))->get();
        if ($GoodIndentAll) {
            foreach ($GoodIndentAll as $g) {
                $GoodIndent = GoodIndent::with(['goodsList'])->find($g->id);
                $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_HAVE_EVALUATION;
                $GoodIndent->is_automatic_evaluate = GoodIndent::GOOD_INDENT_IS_AUTOMATIC_EVALUATE_YES;
                $GoodIndent->save();
            }
        }
    }
}
