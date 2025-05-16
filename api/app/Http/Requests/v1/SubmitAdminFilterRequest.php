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

class SubmitAdminFilterRequest extends Request
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
            default: {
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
                        'title' => 'required|string|max:30',
                        'data' => 'required',
                    ];
                } else {
                    return [
                        'title' => 'required|string|max:30',
                        'data' => 'required',
                    ];
                }
            case 'GET':
            default: {
                    return [];
                }
        }
    }

    public function messages()
    {
        return [
            'title.required' => __('hint.error.not_null', ['attribute' => __('admin_filter.title')]),
            'title.max' => __('hint.error.max', ['attribute' => __('admin_filter.title'), 'place' => 30]),
            'data.required' => __('hint.error.not_null', ['attribute' => __('admin_filter.data')]),
        ];
    }
}
