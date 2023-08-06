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
namespace App\Traits;

use Illuminate\Support\Facades\App;

trait CommonTrait
{
    public function Language()
    {
        if (App::getLocale() === config('dsshop.defaultLanguage')) {
            return $this->hasMany(get_class($this), 'lang_parent_id');
        } else {
            return $this->hasMany(get_class($this), 'id', 'lang_parent_id');
        }
    }
}
