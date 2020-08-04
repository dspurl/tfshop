<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string name
 * @property int pid
 * @property int apply_id
 * @property string keyword
 * @property string describes
 * @property int shows
 * @property int list
 * @property int sort
 */
class Column extends Model
{
    const ARTICLE_LIST_YES= 1; //是否列表：是
    const ARTICLE_LIST_NO= 0; //是否列表：否

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
    // 栏目附加
    public function ColumnProperty()
    {
        return $this->hasOne(ColumnProperty::class);
    }
}
