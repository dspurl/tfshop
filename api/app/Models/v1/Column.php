<?php
namespace App\Models\v1;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
/**
 * @property int id
 * @property string name
 * @property int pid
 * @property string keyword
 * @property string describes
 * @property string template
 * @property int is_show
 * @property int is_list
 * @property int sort
 * @property int pv
 */
class Column extends Model
{
    const COLUMN_IS_SHOW_YES = 1; //是否显示:是
    const COLUMN_IS_SHOW_NO = 2; //是否显示:否
    const COLUMN_IS_LIST_NO = 0; //是否列表:否
    const COLUMN_IS_LIST_YES = 1; //是否列表:是
    public static $withoutAppends = true;
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

    /**
     * 获取单张图片
     */
    public function resources()
    {
        return $this->morphOne('App\Models\v1\Resource', 'image');
    }

    // 父栏目
    public function Column()
    {
        return $this->hasOne(Column::class, 'id', 'pid');
    }

    // 栏目附加
    public function columnProperty()
    {
        return $this->hasOne(ColumnProperty::class);
    }
}
