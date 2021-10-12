<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int type   //资源类型1图片
 * @property string depict  //资源描述
 * @property  string img    //资源地址
 * @property int image_id
 * @property string image_type
 */
class Resource extends Model
{
    const RESOURCE_TYPE_IMG = 1; //类型：图片
    const RESOURCE_TYPE_VIDEO = 2; //类型：视频

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
     * 获取所有佣有image模型
     */
    public function image()
    {
        return $this->morphTo();
    }
}
