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

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 地区
 * @property int id
 * @property int parent_id
 * @property int value
 * @property string name
 *
 */
class CategoryResources extends JsonResource
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
            if (!$request->has('parent_id')) {
                // 获取全部
                if (isset($request->all)) {
                    $data = [
                        'id' => $this->id,
                        'name' => $this->name,
                        'value' => $this->id,
                        'children' => $this->when($this->children->count(), CategoryResources::collection($this->children)),
                    ];
                } else {
                    // 获取顶级
                    $data = [
                        'id' => $this->id,
                        'name' => $this->name,
                        'value' => $this->id,
                    ];
                }

            } else {
                $data = [
                    'id' => $this->id,
                    'name' => $this->name,
                    'img' => $this->img,
                    'value' => $this->id,
                    'parent_id' => $this->parent_id,
                    'parent' => $this->parent_id ? $this->parent->name : '顶级分类',
                    'hasChildren' => $this->child->count() ? true : false,
                    'sort' => $this->sort,
                    'state' => $this->state,
                    'is_recommend' => $this->is_recommend,
                ];
            }


        } else {
            // 客户端
            $data = [
                'id' => $this->id,
                'name' => $this->name,
                'img' => $this->img,
                'value' => $this->id,
                'parent_id' => $this->parent_id,
            ];
        }
        return $data;
    }
}
