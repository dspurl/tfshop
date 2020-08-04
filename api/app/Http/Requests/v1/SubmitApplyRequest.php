<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitApplyRequest extends Request
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
                    'name' => 'required|string|max:30',
                    'img' => 'required|string|max:255',
                    'describes' => 'required|string|max:255'
                ];
            case 'PUT': //update
                return [
                    'name' => 'required|string|max:30',
                    'img' => 'required|string|max:255',
                    'describes' => 'required|string|max:255'
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
            'name.required' =>'应用名称不能为空',
            'name.unique' =>'应用已存在',
            'img.required' =>'应用图标必须上传',
            'describe.required' =>'应用描述不能为空',
        ];
    }
}
