<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string name
 * @property int pid
 * @property string keyword
 * @property string describes
 * @property int show
 * @property int list
 * @property int sort
 * @property int pv
 */
class Column extends Model
{
    public static $withoutAppends = true;
    const COLUMN_LIST_YES= 1; //是否列表：是
    const COLUMN_LIST_NO= 0; //是否列表：否
    const COLUMN_SHOW_YES= 1; //是否显示：是
    const COLUMN_SHOW_NO= 2; //是否显示：否
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
    public function scopeQuerySort($query,$sort)
    {
        if($sort){
            switch($sort){
                case '+id':
                    return $query->orderBy('id','DESC');
                    break;
                case '-id':
                    return $query->orderBy('id','ASC');
                    break;
                case '+time':
                    return $query->orderBy('created_at','DESC');
                    break;
                case '-time':
                    return $query->orderBy('created_at','ASC');
                    break;
            }
        }
    }

    /**
     * 获取单张图片
     */
    public function resources(){
        return $this->morphOne('App\Models\v1\Resource', 'image');
    }

    // 父栏目
    public function Column()
    {
        return $this->hasOne(Column::class,'id','pid');
    }

    // 栏目附加
    public function ColumnProperty()
    {
        return $this->hasOne(ColumnProperty::class);
    }
}
