<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
/**
 * @property int apply_id
 * @property string name
 * @property string keyword
 * @property string describes
 * @property int shows
 * @property int column_id
 * @property int sort
 */
class Article extends Model
{
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
    //栏目
    public function Column()
    {
        return $this->hasOne(Column::class,'id','column_id');
    }

    // 文章附加
    public function ArticleProperty()
    {
        return $this->hasOne(ArticleProperty::class);
    }
}
