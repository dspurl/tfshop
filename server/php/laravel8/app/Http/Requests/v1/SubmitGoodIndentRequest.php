<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitGoodIndentRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        switch ($this->method()) {
            case 'POST':
                return true;
            case 'GET':
            default:
            {
                return false;
            }
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        switch ($this->method())
        {
            case 'POST':
                return [
                    'address' => 'required|array',
                    'carriage' => 'required|numeric',
                    'indentCommodity' => 'required|array',
                    'indentCommodity.*.price' => 'required|numeric',
                    'indentCommodity.*.number' => 'required|integer',
                    'indentCommodity.*.name' => 'required|string',
                    'indentCommodity.*.good_id' => 'required|integer',
                    'indentCommodity.*.good_sku_id' => 'nullable|integer',
                    'indentCommodity.*.img' => 'required|string',
                    'remark' => 'nullable|string|max:200',
                ];
            case 'PUT':
            case 'PATCH':
            case 'GET':
            case 'DELETE':
            default:
            {
                return [];
            }
        }
    }

    public function messages()
    {
        return [
            'address.required' => '收货地址必须',
            'address.array' => '收货地址格式有误',
            'carriage.required' => '运费必须',
            'carriage.numeric' => '运费只能是数字',
            'indentCommodity.required' => '订单商品必须',
            'indentCommodity.*.price.required' => '商品价格必须',
            'indentCommodity.*.price.numeric' => '商品价格格式有误',
            'indentCommodity.*.number.required' => '商品数量必须',
            'indentCommodity.*.number.integer' => '商品数量格式有误',
            'indentCommodity.*.name.required' => '商品名称必须',
            'indentCommodity.*.name.string' => '商品名称格式有误',
            'indentCommodity.*.good_id.required' => '商品ID必须',
            'indentCommodity.*.good_id.integer' => '商品ID格式有误',
            'indentCommodity.*.good_sku_id.required' => '商品SKU必须',
            'indentCommodity.*.good_sku_id.integer' => '商品SKU格式有误',
            'indentCommodity.*.img.required' => '商品主图必须',
            'indentCommodity.*.img.string' => '商品主图格式有误',
            'remark.string' => '备注有误',
            'remark.max' => '备注不能超过200个字符',
        ];
    }
}
