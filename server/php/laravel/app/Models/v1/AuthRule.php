<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string title
 * @property string api
 * @property string path
 * @property string active
 * @property string redirect_url
 * @property string view
 * @property string icon
 * @property string color
 * @property int pid
 * @property int type
 * @property int is_hidden
 * @property int is_hidden_breadcrumb
 * @property int is_affix
 * @property int is_full_page
 * @property int sort
 */
class AuthRule extends Model
{
    const UPDATED_AT = null;
    const CREATED_AT = null;
    const AUTH_RULE_TYPE_MENU = 1;  // 类型:菜单
    const AUTH_RULE_TYPE_IFRAME = 2;  // 类型:iframe
    const AUTH_RULE_TYPE_LINK = 3;  // 类型:外链
    const AUTH_RULE_TYPE_BUTTON = 4;  // 类型:按钮
    const AUTH_RULE_IS_HIDDEN_YES = 1;  // 是否在菜单隐藏:是
    const AUTH_RULE_IS_HIDDEN_NO = 0;  // 是否在菜单隐藏:否
    const AUTH_RULE_IS_HIDDEN_BREADCRUMB_YES = 1;  // 是否隐藏面包屑:是
    const AUTH_RULE_IS_HIDDEN_BREADCRUMB_NO = 0;  // 是否在菜单隐藏:否
    const AUTH_RULE_IS_AFFIX_YES = 1;  // 是否固定:是
    const AUTH_RULE_IS_AFFIX_NO = 0;  // 是否固定:否
    const AUTH_RULE_IS_FULL_PAGE_YES = 1;  // 是否整页打开路由:是
    const AUTH_RULE_IS_FULL_PAGE_NO = 0;  // 是否整页打开路由:否

    public function getIsHiddenAttribute(){
        return $this->attributes['is_hidden'] ? true : false;
    }
    public function getIsHiddenBreadcrumbAttribute(){
        return $this->attributes['is_hidden_breadcrumb'] ? true : false;
    }
    public function getIsAffixAttribute(){
        return $this->attributes['is_affix'] ? true : false;
    }
    public function getIsFullPageAttribute(){
        return $this->attributes['is_full_page'] ? true : false;
    }

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
}
