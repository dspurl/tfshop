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

use App\Traits\CommonTrait;
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
 * @property string lang
 * @property int lang_parent_id
 * @method static orderBy(string $string, string $string1)
 */
class Specification extends Model
{
    use SoftDeletes;
    use CommonTrait;
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
                return __('specification.type.text');
            } else if ($this->attributes['type'] == static::SPECIFICATION_TYPE_RADIO) {
                return __('specification.type.radio');
            } else if ($this->attributes['type'] == static::SPECIFICATION_TYPE_CHECK) {
                return __('specification.type.check');
            }
        }
    }

    public function getLocationShowAttribute()
    {
        if (isset($this->attributes['location'])) {
            if ($this->attributes['location'] == static::SPECIFICATION_LOCATION_SPEC) {
                return __('specification.location.spec');
            } else if ($this->attributes['location'] == static::SPECIFICATION_LOCATION_DETAILS) {
                return __('specification.location.details');
            } else if ($this->attributes['location'] == static::SPECIFICATION_LOCATION_ALL) {
                return __('specification.location.all');
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
