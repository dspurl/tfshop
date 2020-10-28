<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
/**
 * @property int user_id
 * @property int good_id
 */
class Browse extends Model
{
    public static $withoutAppends = true;
    protected $fillable = ['user_id','good_id'];
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
    // 商品
    public function Good()
    {
        return $this->hasOne(Good::class,'id','good_id');
    }
}
