<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;


/**
 * @property int terminal
 * @property string path
 * @property string name
 * @property string entry_time
 * @property string leave_time
 * @property int apply_id
 */
class BrowseLog extends Model
{
    const BROWSE_LOG_TERMINAL= 1; //终端：小程序
    protected $appends = [];

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param  \DateTimeInterface  $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    /**
     * @param int $terminal
     * @return BrowseLog
     */
    public function setTerminal(int $terminal): BrowseLog
    {
        $this->terminal = $terminal;
        return $this;
    }
}
