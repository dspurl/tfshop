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

class SubmitBannerRequest extends Request
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
                        'name' => 'required|unique:banners,name,' . $request['id'] . '|string|max:30',
                        'type' => 'required|integer',
                        'img' => 'nullable|url',
                        'url' => 'nullable|string|max:255',
                        'sort' => 'required|integer',
                        'state' => 'required|integer',
                    ];
                } else {
                    return [
                        'name' => 'required|unique:banners|string|max:30',
                        'type' => 'required|integer',
                        'img' => 'nullable|url',
                        'url' => 'nullable|string|max:255',
                        'sort' => 'required|integer',
                        'state' => 'required|integer',
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
            'name.required' => __('hint.error.not_null', ['attribute' => __('banner.name')]),
            'name.string' => __('hint.error.wrong_format', ['attribute' => __('banner.name')]),
            'name.unique' => __('hint.error.exist', ['attribute' => __('banner.name')]),
            'name.max' => __('hint.error.max', ['attribute' => __('banner.name'), 'place' => 30]),
            'type.required' => __('hint.error.not_null', ['attribute' => __('banner.type')]),
            'type.integer' => __('hint.error.wrong_format', ['attribute' => __('banner.type')]),
            'img.url' => __('hint.error.wrong_format', ['attribute' => __('banner.img')]),
            'url.string' => __('hint.error.wrong_format', ['attribute' => __('banner.url')]),
            'state.integer' => __('hint.error.wrong_format', ['attribute' => __('common.state')]),
            'sort.integer' => __('hint.error.wrong_format', ['attribute' => __('common.sort')]),
        ];
    }
}
