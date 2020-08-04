<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitApplyGroupRequest extends Request
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
            case 'POST':    //create
                return true;
            case 'PUT': //update
                return true;
            case 'PATCH':
            case 'GET':
            case 'DELETE':
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
        switch ($this->method())
        {
            case 'POST':    //create
                return [
                    'introduction' => 'required|string|max:30',
                    'description' => 'required|string|max:255'
                ];
            case 'PUT': //update
                return [
                    'introduction' => 'required|string|max:30',
                    'description' => 'required|string|max:255'
                ];
            case 'PATCH':
            case 'GET':
            case 'DELETE':
            default:
            {
                return [];
            }
        }
    }

    public function messages()
    {
        return [
            'introduction.required' =>'角色名称不能为空',
            'description.required' =>'角色描述不能为空',
        ];
    }
}
