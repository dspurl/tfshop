<?php
/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int id
 * @property int parent_id
 * @property string name
 * @property int maxlength
 * @property int required
 * @property string remark
 * @property string input_type
 * @property string input_option
 * @property string keys
 * @property string value
 * @property string style
 * @property string lang
 *
 * @method static count()
 * @method static where(string $string, string $string1, $null)
 * @method static find(mixed $id)
 */
class Config extends Model
{
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

    public function getInputOptionAttribute()
    {
        if (!self::$withoutAppends) {
            if (isset($this->attributes['input_option'])) {
                return json_decode($this->attributes['input_option'], true);
            }
        } else {
            return $this->attributes['input_option'];
        }
    }

    public function setInputOptionAttribute($value)
    {
        if (isset($value)) {
            $this->attributes['input_option'] = json_encode($value);
        }

    }

    public function getStyleAttribute()
    {
        if (!self::$withoutAppends) {
            if (isset($this->attributes['style'])) {
                return json_decode($this->attributes['style'], true);
            }
        } else {
            return $this->attributes['style'];
        }
    }

    public function setStyleAttribute($value)
    {
        if (isset($value)) {
            $this->attributes['style'] = json_encode($value);
        }

    }

    public function child()
    {
        return $this->hasMany(get_class($this), 'parent_id');
    }

    public function children()
    {
        return $this->child()->with('children');
    }
}
