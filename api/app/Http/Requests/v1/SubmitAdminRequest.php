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
use Illuminate\Support\Facades\Validator;

class SubmitAdminRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        Validator::extend('mobile', function ($attribute, $value, $parameters, $validator) {
            return preg_match('/^1[3456789][0-9]{9}$/', $value);
        });
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
                        'name' => 'required|unique:admins,name,' . $request['id'] . '|string|max:30|min:4',
                        'email' => 'required|email|max:255',
                        'cellphone' => 'required|unique:admins,cellphone,' . $request['id'] . '|mobile|max:11',
                        'portrait' => 'required|string|max:255',
                    ];
                } else {
                    return [
                        'name' => 'required|unique:admins|string|max:30|min:4',
                        'email' => 'required|email|max:255',
                        'cellphone' => 'required|unique:admins|mobile|max:11',
                        'portrait' => 'required|string|max:255',
                        'password' => 'required|string|max:255',
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
            'name.required' => __('hint.error.not_null', ['attribute' => __('admin.name')]),
            'name.unique' => __('hint.error.exist', ['attribute' => __('admin.name')]),
            'name.max' => __('hint.error.max', ['attribute' => __('admin.name'), 'place' => 30]),
            'name.min' => __('hint.error.min', ['attribute' => __('admin.name'), 'place' => 30]),
            'email.email' => __('hint.error.wrong_format', ['attribute' => __('admin.email')]),
            'cellphone.mobile' => __('hint.error.wrong_format', ['attribute' => __('admin.cellphone')]),
            'cellphone.unique' =>__('hint.error.exist', ['attribute' => __('admin.cellphone')]),
            'cellphone.max' => __('hint.error.max', ['attribute' => __('admin.cellphone'), 'place' => 11]),
            'portrait.max' => __('hint.error.max', ['attribute' => __('admin.portrait'), 'place' => 50]),
            'password.required' => __('hint.error.not_null', ['attribute' => __('admin.password')]),
        ];
    }


}
