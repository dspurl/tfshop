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

class SubmitResourceTypeRequest extends Request
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
                        'name' => 'required|unique:resource_types,name,' . $request['id'] . '|string|max:20',
                        'alias' => 'required|unique:resource_types,alias,' . $request['id'] . '|alpha|max:20',
                        'icon' => 'required|string|max:80',
                        'size' => 'nullable|integer',
                        'extension' => 'nullable|array',
                        'specification' => 'nullable|array',
                    ];
                } else {
                    return [
                        'name' => 'required|unique:resource_types|string|max:20',
                        'alias' => 'required|unique:resource_types|alpha|max:20',
                        'icon' => 'nullable|string|max:80',
                        'size' => 'nullable|integer',
                        'extension' => 'nullable|array',
                        'specification' => 'nullable|array',
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
            'name.required' => __('hint.error.not_null', ['attribute' => __('resource_type.name')]),
            'name.unique' => __('hint.error.exist', ['attribute' => __('resource_type.name')]),
            'name.max' => __('hint.error.max', ['attribute' => __('resource_group.name'), 'place' => 20]),
            'alias.required' => __('hint.error.not_null', ['attribute' => __('resource_type.alias')]),
            'alias.alpha' => __('hint.error.wrong_format', ['attribute' => __('resource_type.alias')]),
            'alias.unique' => __('hint.error.exist', ['attribute' => __('resource_type.alias')]),
            'alias.max' => __('hint.error.max', ['attribute' => __('resource_type.alias'), 'place' => 20]),
            'icon.unique' => __('hint.error.exist', ['attribute' => __('resource_type.icon')]),
            'icon.max' => __('hint.error.max', ['attribute' => __('resource_type.icon'), 'place' => 80]),
            'extension.array' => __('hint.error.wrong_format', ['attribute' => __('resource_type.extension')]),
            'specification.array' => __('hint.error.wrong_format', ['attribute' => __('resource_type.specification')]),
            'size.integer' => __('hint.error.wrong_format', ['attribute' => __('resource_type.size')]),
        ];
    }
}
