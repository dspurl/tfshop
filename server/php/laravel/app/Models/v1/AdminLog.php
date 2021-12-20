<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int admin_id
 * @property array header
 * @property string name
 * @property string path
 * @property string url
 * @property string method
 * @property string ip
 * @property array param
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

    public function getHeaderAttribute()
    {
        if (isset($this->attributes['header'])) {
            return json_decode($this->attributes['header']);
        } else {
            return [];
        }
    }

    public function setHeaderAttribute($value)
    {
        $this->attributes['header'] = json_encode($value);
    }

    public function getParamAttribute()
    {
        if (isset($this->attributes['param'])) {
            return json_decode($this->attributes['param']);
        } else {
            return [];
        }
    }

    public function setParamAttribute($value)
    {
        $this->attributes['param'] = json_encode($value);
    }

    public function getResponseAttribute()
    {
        if (isset($this->attributes['response'])) {
            return json_decode($this->attributes['response']);
        } else {
            return [];
        }
    }

    public function getNameAttribute()
    {
        if (isset($this->attributes['name'])) {
            return __("route." . $this->attributes['name']);
        }
    }

    public function Admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
