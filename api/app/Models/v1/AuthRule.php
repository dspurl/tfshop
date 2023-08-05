<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Models\v1;

use App\Traits\CommonTrait;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed title
 * @property mixed api
 * @property mixed pid
 * @property int state
 * @property string lang
 * @property int lang_parent_id
 * @property mixed|string url
 * @property mixed|string icon
 * @property mixed|string sort
 */
class AuthRule extends Model
{
    use CommonTrait;
    const UPDATED_AT = null;
    const CREATED_AT = null;
    const AUTH_RULE_STATE_ON = 1;
    const AUTH_RULE_STATE_OFF = 0;
    protected $appends = ['state_show'];
    protected $fillable = ['api', 'url', 'icon', 'title', 'pid', 'state', 'sort'];

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
     * 数组中的属性会被展示。
     *
     * @var array
     */
//    protected $visible = ['api'];
    /**
     * 数组中的属性会被隐藏。
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     * @var array
     */
//    protected $hidden = ['password'];
    public function AuthGroup()
    {
        return $this->belongsToMany(AuthGroup::class, 'auth_group_auth_rules');
    }

    //是否显示在菜单栏state_show
    public function getStateShowAttribute()
    {
        if (isset($this->attributes['state'])) {
            if ($this->attributes['state'] == AuthRule::AUTH_RULE_STATE_ON) {
                return __('common.is_show');
            } else {
                return __('common.is_hide');
            }
        }

    }

    /**
     * 获取所有子级权限
     * @param $id
     * @param array $arr
     * @return array
     */
    public function obtainAllChildPermissions($id, &$arr= []){
        $authRule = AuthRule::where('pid', $id)->get();
        $arr[]=$id;
        if($authRule){
            foreach ($authRule as $a){
                $this->obtainAllChildPermissions($a->id, $arr);
            }
        }
        return $arr;
    }

    public function child()
    {
        return $this->hasMany(get_class($this), 'pid');
    }

    public function children()
    {
        return $this->child()->with('children');
    }
}
