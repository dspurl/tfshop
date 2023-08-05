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

namespace App\Http\Resources;

use App\Code;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 地区
 * @property int id
 * @property int parent_id
 * @property int value
 * @property string name
 *
 */
class RegionResources extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {

        if (!$request->header('apply-secret')) {
            // 后台
            if (!$request->parent_id) {
                // 获取全部
                if (isset($request->all)) {
                    $data = [
                        'id' => $this->id,
                        'name' => $this->name,
                        'value' => $this->value,
                        'children' => $this->when($this->children->count(), RegionResources::collection($this->children)),
                    ];
                } else {
                    // 获取顶级
                    $data = [
                        'id' => $this->id,
                        'name' => $this->name,
                        'value' => $this->value,
                    ];
                }

            } else {
                $data = [
                    'id' => $this->id,
                    'name' => $this->name,
                    'value' => $this->value,
                    'parent_id' => $this->parent_id,
                    'parent' => $this->parent_id ? $this->parent->name : '',
                    'hasChildren' => $this->child->count() ? true : false,
                ];
            }


        } else {
            // 客户端
            $data = [
                'id' => $this->id,
                'name' => $this->name,
                'value' => $this->value,
                'children' => $this->when($this->children->count(), RegionResources::collection($this->children)),
            ];
        }
        return $data;
    }
}
