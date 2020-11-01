<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
/**
 * @property string name
 * @property string keyword
 * @property string describes
 * @property int show
 * @property int column_id
 * @property int sort
 * @property int pv
 */
class Article extends Model
{
    public static $withoutAppends = true;
    const ARTICLE_SHOW_YES= 1; //是否显示：是
    const ARTICLE_SHOW_NO= 2; //是否显示：否

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
     * 获取单张图片
     */
    public function resources(){
        return $this->morphOne('App\Models\v1\Resource', 'image');
    }

    /**
     * 栏目ID
     *
     * @param $row
     * @return array
     */
    protected function getColumnIdAttribute()
    {
        if(isset($this->attributes['column_id'])){
            if(self::$withoutAppends){
                return $this->attributes['column_id'];
            }else{
                return [$this->attributes['column_id']];
            }

        }
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
