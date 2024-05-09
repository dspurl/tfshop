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
                    'type' => 'nullable|integer',
                    'address' => 'nullable|array',
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
            'type.integer' => __('hint.error.wrong_format', ['attribute' => __('good_indent.type')]),
            'address.array' => __('hint.error.wrong_format', ['attribute' => __('good_indent.address')]),
            'carriage.required' => __('hint.error.not_null', ['attribute' => __('good_indent.carriage')]),
            'carriage.numeric' => __('hint.error.wrong_format', ['attribute' => __('good_indent.carriage')]),
            'indentCommodity.required' => __('hint.error.not_null', ['attribute' => __('good_indent.indentCommodity')]),
            'indentCommodity.array' => __('hint.error.wrong_format', ['attribute' => __('good_indent.indentCommodity')]),
            'indentCommodity.*.price.required' => __('hint.error.not_null', ['attribute' => __('good_indent.indentCommodity.price')]),
            'indentCommodity.*.price.numeric' => __('hint.error.wrong_format', ['attribute' => __('good_indent.indentCommodity.price')]),
            'indentCommodity.*.number.required' => __('hint.error.not_null', ['attribute' => __('good_indent.indentCommodity.number')]),
            'indentCommodity.*.number.integer' => __('hint.error.wrong_format', ['attribute' => __('good_indent.indentCommodity.number')]),
            'indentCommodity.*.name.required' => __('hint.error.not_null', ['attribute' => __('good_indent.indentCommodity.name')]),
            'indentCommodity.*.name.string' => __('hint.error.wrong_format', ['attribute' => __('good_indent.indentCommodity.name')]),
            'indentCommodity.*.good_id.required' => __('hint.error.not_null', ['attribute' => __('good_indent.indentCommodity.good_id')]),
            'indentCommodity.*.good_id.integer' => __('hint.error.wrong_format', ['attribute' => __('good_indent.indentCommodity.good_id')]),
            'indentCommodity.*.good_sku_id.required' => __('hint.error.not_null', ['attribute' => __('good_indent.indentCommodity.good_sku_id')]),
            'indentCommodity.*.good_sku_id.integer' => __('hint.error.wrong_format', ['attribute' => __('good_indent.indentCommodity.good_sku_id')]),
            'indentCommodity.*.img.required' => __('hint.error.not_null', ['attribute' => __('good_indent.indentCommodity.img')]),
            'indentCommodity.*.img.string' => __('hint.error.wrong_format', ['attribute' => __('good_indent.indentCommodity.img')]),
            'remark.string' => __('hint.error.wrong_format', ['attribute' => __('good_indent.remark')]),
            'remark.max' => __('hint.error.max', ['attribute' => __('good_indent.remark'), 'place' => 200]),
        ];
    }
}
