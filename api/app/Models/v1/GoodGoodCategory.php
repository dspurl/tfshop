<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int good_id
 * @property int good_category_id
 * */
class GoodGoodCategory extends Model
{
    const UPDATED_AT = null;
    const CREATED_AT = null;
    protected $table = 'good_good_categorys';

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
