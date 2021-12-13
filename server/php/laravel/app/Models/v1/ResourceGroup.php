<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string name
 * @property int pid
 * @property int sort
 */
class ResourceGroup extends Model
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

    public function parent()
    {
        return $this->belongsTo(get_class($this), 'pid')->with('parent');
    }

    public function child()
    {
        return $this->hasMany(get_class($this), 'pid')->orderBy('sort', 'ASC');
    }

    public function children()
    {
        return $this->child()->with('children')->orderBy('sort', 'ASC');
    }

    /**
     * 获取所有子级权限
     * @param $id
     * @param array $arr
     * @return array
     */
    public function obtainAllChildPermissions($id, &$arr = [])
    {
        $data = get_class($this)::where('pid', $id)->get();
        $arr[] = $id;
        if ($data) {
            foreach ($data as $a) {
                $this->obtainAllChildPermissions($a->id, $arr);
            }
        }
        return $arr;
    }
}
