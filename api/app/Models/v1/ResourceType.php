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
 * @property string name
 * @property string uuid
 * @property string icon
 * @property int size
 * @property array extension
 * @property array specification
 */
class ResourceType extends Model
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

    public function getExtensionAttribute()
    {
        if (isset($this->attributes['extension'])) {
            return json_decode($this->attributes['extension']);
        }else{
            return [];
        }
    }

    public function getSpecificationAttribute()
    {
        if (isset($this->attributes['specification'])) {
            return json_decode($this->attributes['specification']);
        }else{
            return [];
        }
    }

    public function setExtensionAttribute($value)
    {
        $this->attributes['extension'] = json_encode($value);
    }

    public function setSpecificationAttribute($value)
    {
        $this->attributes['specification'] = json_encode($value);
    }
}
