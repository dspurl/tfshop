<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed nickname
 * @property int admin_id
 * @property string path
 * @property string method
 * @property string ip
 * @property string input
 */
class Notification extends Model
{
    public static $withoutAppends = true;

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param \DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function getDataAttribute()
    {
        if (isset($this->attributes['data'])) {
            $return = $this->attributes['data'];
            if (self::$withoutAppends) {
            } else {
                $return = json_decode($this->attributes['data']);

            }
            return $return;
        }
    }
}
