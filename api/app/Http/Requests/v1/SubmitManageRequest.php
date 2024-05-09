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
class SubmitManageRequest extends Request
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
                        'roles' => 'bail|required|string|max:11',
                        'introduction' => 'required|string|max:80',
                        'rules' => 'required',
                    ];
                } else {
                    return [
                        'roles' => 'bail|required|string|max:11',
                        'introduction' => 'required|string|max:80',
                        'rules' => 'required',
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
            'roles.required' => __('hint.error.not_null',['specification'=>__('manage.roles')]),
            'roles.unique' => __('hint.error.exist',['specification'=>__('manage.roles')]),
            'roles.max' => __('hint.error.exceed',['specification'=>__('manage.roles'),'place'=>11]),
            'introduction.required' => __('hint.error.not_null',['specification'=>__('manage.introduction')]),
            'introduction.max' => __('hint.error.exceed',['specification'=>__('manage.introduction'),'place'=>80]),
            'rules.required' => __('hint.error.not_null',['specification'=>__('manage.rules')]),
        ];
    }
}
