<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string name
 * @property int id
 * @property int sort
 * @property string resources
 */
class Brand extends Model
{
    const BRAND_DELETE_NO= 0; //删除：否
    const BRAND_DELETE_YES= 1; //删除：是
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
     * 获取品牌LOGO
     */
    public function resources(){
        return $this->morphOne('App\Models\v1\Resource', 'image');
    }
}
