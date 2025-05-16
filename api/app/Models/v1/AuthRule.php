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
    const AUTH_RULE_TYPE_MENU = 1;  // 类型:菜单
    const AUTH_RULE_TYPE_IFRAME = 2;  // 类型:iframe
    const AUTH_RULE_TYPE_LINK = 3;  // 类型:外链
    const AUTH_RULE_TYPE_BUTTON = 4;  // 类型:按钮
    const AUTH_RULE_TYPE_PAGE = 5;  // 类型:页面
    const AUTH_RULE_IS_HIDDEN_YES = 1;  // 是否在菜单隐藏:是
    const AUTH_RULE_IS_HIDDEN_NO = 0;  // 是否在菜单隐藏:否
    const AUTH_RULE_IS_HIDDEN_BREADCRUMB_YES = 1;  // 是否隐藏面包屑:是
    const AUTH_RULE_IS_HIDDEN_BREADCRUMB_NO = 0;  // 是否在菜单隐藏:否
    const AUTH_RULE_IS_AFFIX_YES = 1;  // 是否固定:是
    const AUTH_RULE_IS_AFFIX_NO = 0;  // 是否固定:否
    const AUTH_RULE_IS_FULL_PAGE_YES = 1;  // 是否整页打开路由:是
    const AUTH_RULE_IS_FULL_PAGE_NO = 0;  // 是否整页打开路由:否
    protected $fillable = ['api', 'path', 'active', 'redirect_url', 'view', 'icon', 'color', 'type', 'is_hidden', 'is_hidden_breadcrumb', 'is_affix', 'is_full_page', 'title', 'pid', 'sort'];

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

    public function getIsHiddenAttribute()
    {
        return $this->attributes['is_hidden'] ? true : false;
    }

    public function getIsHiddenBreadcrumbAttribute()
    {
        return $this->attributes['is_hidden_breadcrumb'] ? true : false;
    }

    public function getIsAffixAttribute()
    {
        return $this->attributes['is_affix'] ? true : false;
    }

    public function getIsFullPageAttribute()
    {
        return $this->attributes['is_full_page'] ? true : false;
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
        $authRule = AuthRule::where('pid', $id)->get();
        $arr[] = $id;
        if ($authRule) {
            foreach ($authRule as $a) {
                $this->obtainAllChildPermissions($a->id, $arr);
            }
        }
        return $arr;
    }
}
