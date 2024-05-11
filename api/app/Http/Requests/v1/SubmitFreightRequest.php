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

class SubmitFreightRequest extends Request
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
        $request = Request::all();
        switch ($this->method()) {
            case 'POST':    //create
                if (Request::has('id')) {   //更新
                    return [
                        'name' => 'required|unique:freights,name,' . $request['id'] . '|string|max:60',
                        'location' => 'required|array',
                        'pinkage' => 'nullable|array',
                        'valuation' => 'required|integer',
                        'freight_way'=> 'nullable|array',
                        'freight_way.*.add_cost'=> 'required|numeric',
                        'freight_way.*.add_piece'=> 'required|numeric',
                        'freight_way.*.first_cost'=> 'required|numeric',
                        'freight_way.*.first_piece'=> 'required|numeric',
                        'freight_way.*.location'=> 'required|array',
                    ];
                } else {
                    return [
                        'name' => 'required|unique:freights|string|max:60',
                        'location' => 'required|array',
                        'pinkage' => 'nullable|array',
                        'valuation' => 'required|integer',
                        'freight_way'=> 'nullable|array',
                        'freight_way.*.add_cost'=> 'required|numeric',
                        'freight_way.*.add_piece'=> 'required|numeric',
                        'freight_way.*.first_cost'=> 'required|numeric',
                        'freight_way.*.first_piece'=> 'required|numeric',
                        'freight_way.*.location'=> 'required|array',
                    ];
                }
            case 'GET':
            default:
            {
                return [];
            }
        }
    }

    public function messages()
    {
        return [
            'name.required' =>__('hint.error.not_null', ['attribute' => __('freight.name')]),
            'name.string' =>__('hint.error.wrong_format', ['attribute' => __('freight.name')]),
            'name.unique' =>__('hint.error.exist', ['attribute' => __('freight.name')]),
            'name.max' =>__('hint.error.max', ['attribute' => __('freight.name'), 'place' => 60]),
            'location.required' =>__('hint.error.not_null', ['attribute' => __('freight.location')]),
            'location.array' =>__('hint.error.wrong_format', ['attribute' => __('freight.location')]),
            'pinkage.array' =>__('hint.error.wrong_format', ['attribute' => __('freight.pinkage')]),
            'valuation.required' =>__('hint.error.not_null', ['attribute' => __('freight.valuation')]),
            'valuation.integer' =>__('hint.error.wrong_format', ['attribute' => __('freight.valuation')]),
            'freight_way.array' =>__('hint.error.wrong_format', ['attribute' => __('freight.freight_way')]),
            'freight_way.*.first_piece.required' =>__('hint.error.not_null', ['attribute' => __('freight.freight_way.first_piece')]),
            'freight_way.*.first_piece.integer' =>__('hint.error.wrong_format', ['attribute' => __('freight.freight_way.first_piece')]),
            'freight_way.*.first_cost.required' =>__('hint.error.not_null', ['attribute' => __('freight.freight_way.first_cost')]),
            'freight_way.*.first_cost.numeric' =>__('hint.error.wrong_format', ['attribute' => __('freight.freight_way.first_cost')]),
            'freight_way.*.add_piece.required' =>__('hint.error.not_null', ['attribute' => __('freight.freight_way.add_piece')]),
            'freight_way.*.add_piece.integer' =>__('hint.error.wrong_format', ['attribute' => __('freight.freight_way.add_piece')]),
            'freight_way.*.add_cost.required' =>__('hint.error.not_null', ['attribute' => __('freight.freight_way.add_cost')]),
            'freight_way.*.add_cost.numeric' =>__('hint.error.wrong_format', ['attribute' => __('freight.freight_way.add_cost')]),
            'freight_way.*.location.required' =>__('hint.error.not_null', ['attribute' => __('freight.location')]),
            'freight_way.location.array' =>__('hint.error.wrong_format', ['attribute' => __('freight.location')]),
        ];
    }
}
