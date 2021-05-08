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
class AdminLog extends Model
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

    /**
     * 提交的数据
     * @return void
     */
    public function getInputAttribute()
    {
        if (!self::$withoutAppends) {
            return json_decode($this->attributes['input']);
        } else {
            return $this->attributes['input'];
        }

    }
}
