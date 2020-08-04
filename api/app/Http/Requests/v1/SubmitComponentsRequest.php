<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitComponentsRequest extends Request
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
                    'name' => 'required|string|unique:components|max:30',
                    'describe' => 'required|string|max:2000'
                ];
            case 'PUT': //update
                return [
                    'name' => 'required|string|max:30',
                    'describe' => 'required|string|max:2000'
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
            'name.required' =>'模组名称不能为空',
            'name.unique' =>'模组已存在',
            'describe.required' =>'模组描述不能为空',

        ];
    }
}
