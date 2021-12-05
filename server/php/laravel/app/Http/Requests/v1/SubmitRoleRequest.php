<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;
class SubmitRoleRequest extends Request
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
                        'roles' => 'bail|required|unique:auth_groups,roles,' . $request['id'] . '|alpha|max:30',
                        'introduction' => 'required|unique:auth_groups,introduction,' . $request['id'] . '|string|max:80',
                    ];
                } else {
                    return [
                        'roles' => 'bail|required|unique:auth_groups|alpha|max:30',
                        'introduction' => 'required|unique:auth_groups|string|max:80',
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
            'roles.required' => '别名不能为空',
            'roles.alpha' => '别名只能是字母',
            'roles.unique' => '别名已存在',
            'roles.max' => '别名不能超过30个字符',
            'introduction.required' => '角色名称不能为空',
            'introduction.unique' => '角色名称已存在',
            'introduction.max' => '角色名称不能超过80个字符',
        ];
    }
}
