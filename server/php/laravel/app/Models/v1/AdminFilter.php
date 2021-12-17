<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int admin_id
 * @property int auth_rule_id
 * @property string title
 * @property string data
 */
class AdminFilter extends Model
{

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
            return json_decode($this->attributes['data']);
        } else {
            return [];
        }
    }

    public function setDataAttribute($value)
    {
        $this->attributes['data'] = json_encode($value);
    }
}
