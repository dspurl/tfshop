<?php

namespace App\Http\Resources;

use App\Models\v1\ServeClassify;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 配置
 * @property int id
 * @property string name
 * @property int maxlength
 * @property int required
 * @property string remark
 * @property string input_type
 * @property array input_option
 * @property string keys
 * @property string value
 * @property array style
 */
class ConfigResources extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'maxlength' => $this->maxlength,
            'required' => $this->required,
            'remark' => $this->remark,
            'input_type' => $this->input_type,
            'input_option' => $this->input_option,
            'keys' => $this->keys,
            'value' => $this->input_type == 'switch' ? $this->value ? true : false : $this->value,
            'style' => $this->style,
            'children' => $this->when($this->children->count(), ConfigResources::collection($this->children)),
        ];
    }
}
