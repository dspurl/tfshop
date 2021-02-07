<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int good_id
 * @property int specification_id
 * @property string data
 *
 */
class GoodSpecification extends Model
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

    //规格值json转换
    public function getDataAttribute()
    {
        if (isset($this->attributes['data'])) {
            $data = json_decode($this->attributes['data']);
            if ($data) {
                return $data;
            } else {
                if ($this->attributes['data'] == 0) {
                    return 0;
                } else {
                    return $this->attributes['data'];
                }
            }
        }
    }

    /**
     * 规格值json转换
     *
     * @param string $value
     * @return void
     */
    public function setDataAttribute($value)
    {
        if (isset($value)) {
            if (is_array($value)) {
                $this->attributes['data'] = json_encode($value);
            } else {
                $this->attributes['data'] = $value;
            }
        }

    }
}
