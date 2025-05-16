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

use App\Models\v1\ServeClassify;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 商品
 */
class GoodResources extends JsonResource
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
            $data = [
                'id' => $this->id,
                'name' => $this->name,
                'img' => $this->img,
                'video' => $this->video,
                'video_img' => $this->video_img,
                'identification' => $this->identification,
                'type' => $this->type,
                'category' => $this->Category,
                'category_id' => $this->category_id,
                'freight_id' => $this->freight_id,
                'freight' => $this->freight,
                'number' => $this->number,
                'freight_type' => $this->freight_type,
                'state' => $this->state,
                'inventory' => $this->inventory,
                'market_price' => $this->GoodSku->count() ? $this->GoodSku->min('market_price') : $this->market_price,
                'cost_price' => $this->GoodSku->count() ? $this->GoodSku->min('cost_price') : $this->cost_price,
                'price' => $this->GoodSku->count() ? $this->GoodSku->min('price') : $this->price,
                'sales' => $this->sales,
                'is_show' => $this->is_show,
                'is_recommend' => $this->is_recommend,
                'is_inventory' => $this->is_inventory,
                'sort' => $this->sort,
                'time' => $this->time,
                'good_sku' => $this->GoodSku,
                'timing' => $this->timing,
                'created_at' => $this->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            ];
        } else {
            // 客户端
            if ($request->has('is_list')) {
                // 如果是列表
                $data = [
                    'id' => $this->id,
                    'name' => $this->name,
                    'img' => $this->img[0],
                    'type' => $this->type,
                    'inventory' => $this->inventory,
                    'market_price' => $this->GoodSku->count() ? $this->GoodSku->min('market_price') : $this->market_price,
                    'cost_price' => $this->GoodSku->count() ? $this->GoodSku->min('cost_price') : $this->cost_price,
                    'price' => $this->GoodSku->count() ? $this->GoodSku->min('price') : $this->price,
                    'sales' => $this->sales,
                    'good_sku' => $this->GoodSku,
                    'is_show' => $this->is_show
                ];
            }else{
                // 详情
                $data = [
                    'id' => $this->id,
                    'name' => $this->name,
                    'img' => $this->img,
                    'video_img' => $this->video_img,
                    'video' => $this->video,
                    'type' => $this->type,
                    'inventory' => $this->inventory,
                    'market_price' => $this->GoodSku->count() ? [$this->GoodSku->min('market_price'), $this->GoodSku->max('market_price')] : [$this->market_price],
                    'price' => $this->GoodSku->count() ? [$this->GoodSku->min('price'), $this->GoodSku->max('price')] : [$this->price],
                    'sales' => $this->sales,
                    'good_sku' => $this->GoodSku,
                    'is_show' => $this->is_show,
                    'is_delete' => $this->deleted_at ? true : false,
                ];
            }
        }
        return $data;
    }
}
