<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string name
 * @property array pages
 * @property array config
 * @property string cover
 */
class Project extends Model
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

    public function getPagesAttribute()
    {
        if (!self::$withoutAppends) {
            if (isset($this->attributes['pages'])) {
                return json_decode($this->attributes['pages'], true);
            }
        } else {
            return $this->attributes['pages'];
        }
    }

    public function getConfigAttribute()
    {
        if (!self::$withoutAppends) {
            if (isset($this->attributes['config'])) {
                return json_decode($this->attributes['config'], true);
            }
        } else {
            return $this->attributes['config'];
        }
    }
}
