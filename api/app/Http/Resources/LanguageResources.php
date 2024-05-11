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

use App\Code;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

/**
 * 语言
 * @property int id
 * @property string code
 * @property string name
 *
 */
class LanguageResources extends JsonResource
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
            if (Auth::check()) {
                $data = [
                    'id' => $this->id,
                    'name' => $this->name,
                    'code' => $this->code,
                ];
            } else {
                $data = [
                    'name' => $this->name,
                    'code' => $this->code,
                ];
            }

        } else {
            // 客户端
            $data = [
                'name' => $this->name,
                'code' => $this->code,
            ];
        }
        return $data;
    }
}
