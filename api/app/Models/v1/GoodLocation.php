<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int apply_id
 * @property int apply_user_id //店铺时为0
 * @property int good_indent_id
 * @property int cellphone
 * @property string name
 * @property string location
 * @property string address
 * @property string latitude
 * @property string longitude
 * @property string house
 */
class GoodLocation extends Model
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
}
