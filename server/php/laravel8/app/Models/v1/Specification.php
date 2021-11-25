<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string name
 * @property int type
 * @property int is_search
 * @property int location
 * @property string value
 * @property int specification_group_id
 * @property string label
 * @property string sort
 */
class Specification extends Model
{
    use SoftDeletes;
    const SPECIFICATION_TYPE_TEXT = 1; //规格类型：文本
    const SPECIFICATION_TYPE_RADIO = 2; //规格类型：单选
    const SPECIFICATION_TYPE_CHECK = 3; //规格类型：多选
    const SPECIFICATION_LOCATION_SPEC = 0; //显示位置：规格
    const SPECIFICATION_LOCATION_DETAILS = 1; //显示位置：详情
    const SPECIFICATION_LOCATION_ALL = 2; //显示位置：全部
    public static $withoutAppends = true;
    protected $appends = ['type_show', 'location_show'];

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

    public function getTypeShowAttribute()
    {
        if (isset($this->attributes['type'])) {
            if ($this->attributes['type'] == static::SPECIFICATION_TYPE_TEXT) {
                return '文本';
            } else if ($this->attributes['type'] == static::SPECIFICATION_TYPE_RADIO) {
                return '单选';
            } else if ($this->attributes['type'] == static::SPECIFICATION_TYPE_CHECK) {
                return '多选';
            }
        }
    }

    public function getLocationShowAttribute()
    {
        if (isset($this->attributes['location'])) {
            if ($this->attributes['location'] == static::SPECIFICATION_LOCATION_SPEC) {
                return '规格参数页';
            } else if ($this->attributes['location'] == static::SPECIFICATION_LOCATION_DETAILS) {
                return '详情页';
            } else if ($this->attributes['location'] == static::SPECIFICATION_LOCATION_ALL) {
                return '都显示';
            }
        }
    }

    //值分割，默认不输出
    public function getValueAttribute()
    {
        if (self::$withoutAppends) {
            return $this->attributes['value'];
        } else {
            if (isset($this->attributes['value'])) {
                return explode("\n", $this->attributes['value']);
            }
        }
    }

    /**
     * 规格组
     */
    public function SpecificationGroup()
    {
        return $this->belongsTo(SpecificationGroup::class);
    }

}
