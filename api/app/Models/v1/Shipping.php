<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int user_id
 * @property int good_indent_id
 * @property int cellphone
 * @property int defaults
 * @property string name
 * @property string location
 * @property string address
 * @property string latitude
 * @property string longitude
 * @property string house
 */
class Shipping extends Model
{
    const SHIPPING_DEFAULTS_YES = 1; //默认：是
    const SHIPPING_DEFAULTS_NO = 0; //默认：否

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
}
