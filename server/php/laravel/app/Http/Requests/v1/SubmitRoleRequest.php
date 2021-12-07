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
            'roles.required' => __('hint.error.not_null',['attribute'=>__('requests.role.roles')]),
            'roles.alpha' => __('hint.error.alpha',['attribute'=>__('requests.role.roles')]),
            'roles.unique' => __('hint.error.exist',['attribute'=>__('requests.role.roles')]),
            'roles.max' => __('hint.error.exceed',['attribute'=>__('requests.role.roles'),'place'=>30]),
            'introduction.required' => __('hint.error.not_null',['attribute'=>__('requests.role.introduction')]),
            'introduction.unique' =>__('hint.error.exist',['attribute'=>__('requests.role.introduction')]),
            'introduction.max' => __('hint.error.exceed',['attribute'=>__('requests.role.introduction'),'place'=>30]),
        ];
    }
}
