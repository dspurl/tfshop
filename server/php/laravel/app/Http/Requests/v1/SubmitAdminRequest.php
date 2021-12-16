<?php

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
                        'name' => 'nullable|unique:admins,name,' . $request['id'] . '|string|max:30',
                        'real_name' => 'nullable|string|max:75',
                        'email' => 'nullable|email|max:255',
                        'cellphone' => 'nullable|mobile|max:11',
                        'portrait' => 'nullable|string|max:50',
                    ];
                } else {
                    return [
                        'name' => 'required|unique:admins|string|max:30',
                        'real_name' => 'nullable|string|max:75',
                        'email' => 'nullable|email|max:255',
                        'cellphone' => 'nullable|mobile|max:11',
                        'portrait' => 'nullable|string|max:50',
                        'password' => 'required|string|max:255',
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
            'name.required' => '管理员账号不能为空',
            'name.unique' => '管理员账号已存在',
            'name.max' => '管理员账号长度不能超过30位',
            'email.email' => '邮箱格式错误',
            'email.email' => '邮箱格式错误',
            'cellphone.mobile' => '手机格式错误',
            'cellphone.max' => '手机号长度不能超过11位',
            'portrait.max' => '头像长度不能超过50位',
            'password.required' => '管理员密码不能为空',
        ];
    }
}
