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
namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitSpecificationRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        switch ($this->method())
        {
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
        switch ($this->method()) {
            case 'POST':    //create
                if (Request::has('id')) {   //更新
                    return [
                        'name' => 'required|string|max:30',
                        'type' => 'required|numeric',
                        'is_search' => 'required|numeric',
                        'specification_group_id' => 'nullable|numeric',
                        'location' => 'required|numeric',
                        'value' => 'nullable|string',
                        'sort' => 'required|numeric|max:11'
                    ];
                } else {
                    return [
                        'name' => 'required|string|max:30',
                        'type' => 'required|numeric',
                        'is_search' => 'required|numeric',
                        'specification_group_id' => 'nullable|numeric',
                        'location' => 'required|numeric',
                        'value' => 'nullable|string',
                        'sort' => 'required|numeric|max:11'
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
            'name.required' =>__('hint.error.not_null', ['attribute' => __('specification.name')]),
            'name.string' =>__('hint.error.wrong_format', ['attribute' => __('specification.name')]),
            'name.max' =>__('hint.error.max', ['attribute' => __('specification.name'), 'place' => 30]),
            'type.required' =>__('hint.error.not_null', ['attribute' => __('specification.type')]),
            'type.numeric' =>__('hint.error.wrong_format', ['attribute' => __('specification.type')]),
            'is_search.required' =>__('hint.error.not_null', ['attribute' => __('specification.is_search')]),
            'is_search.numeric' =>__('hint.error.wrong_format', ['attribute' => __('specification.is_search')]),
            'specification_group_id.required' =>__('hint.error.not_null', ['attribute' => __('specification.specification_group_id')]),
            'specification_group_id.numeric' =>__('hint.error.wrong_format', ['attribute' => __('specification.specification_group_id')]),
            'location.required' =>__('hint.error.not_null', ['attribute' => __('specification.location')]),
            'location.numeric' =>__('hint.error.wrong_format', ['attribute' => __('specification.location')]),
            'value.string' =>__('hint.error.wrong_format', ['attribute' => __('specification.value')]),
            'sort.required' =>__('hint.error.not_null', ['attribute' => __('common.sort')]),
            'sort.numeric' =>__('hint.error.wrong_format', ['attribute' => __('common.sort')]),
        ];
    }
}
