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
 * @property int sort
 * @property int pid
 * @property int state
 * @property string resources
 * @property int is_recommend
 * @property string lang
 * @property int lang_parent_id
 * @method static get()
 * @method static orderBy(string $string, string $string1)
 */
class Category extends Model
{
    use SoftDeletes;
    use CommonTrait;
    public static $withoutAppends = false;
    const CATEGORY_STATE_YES = 0; //状态：正常
    const CATEGORY_STATE_NO = 1; //状态：隐藏
    const CATEGORY_IS_RECONMEND_NO = 0; //首页推荐：否
    const CATEGORY_IS_RECONMEND_YES = 1; //首页推荐：是
    protected $table = 'categorys';

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

    public function getStateAttribute()
    {
        if (isset($this->attributes['state'])) {
            if (self::$withoutAppends) {
                return $this->attributes['state'];
            } else {
                if ($this->attributes['state'] == static::CATEGORY_STATE_YES) {
                    return __('common.is_show');
                } else if ($this->attributes['state'] == static::CATEGORY_STATE_NO) {
                    return __('common.is_hide');
                }
            }
        }
    }

    public function getIsRecommendAttribute()
    {
        if (isset($this->attributes['is_recommend'])) {
            if (self::$withoutAppends) {
                return $this->attributes['is_recommend'];
            } else {
                if ($this->attributes['is_recommend'] == static::CATEGORY_IS_RECONMEND_YES) {
                    return '推荐';
                } else if ($this->attributes['is_recommend'] == static::CATEGORY_IS_RECONMEND_NO) {
                    return '不推荐';
                }
            }
        }
    }

    public function parent(){
        return $this->hasOne(Category::class,'id','parent_id');
    }

    public function fathers()
    {
        return $this->belongsTo(get_class($this), 'parent_id')->with('fathers');
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
