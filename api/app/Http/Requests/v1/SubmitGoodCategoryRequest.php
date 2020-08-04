<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitGoodCategoryRequest extends Request
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
                    'pid' => 'required|numeric',
                    'sort' => 'required|numeric|max:5',
                    'state' => 'nullable|numeric'
                ];
            case 'PUT': //update
                return [
                    'name' => 'required|string|max:30',
                    'pid' => 'required|numeric',
                    'sort' => 'required|numeric|max:5',
                    'state' => 'nullable|numeric'
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
            'name.required' =>'类目名称必须',
            'name.string' =>'类目格式有误',
            'name.max' =>'类目不能超过30个字符',
            'pid.required' =>'上级类目必须',
            'pid.numeric' =>'上级类目格式有误',
            'pid.max' =>'上级类目不能超过11个字符',
            'sort.required' =>'排序必须',
            'sort.numeric' =>'排序格式有误',
            'sort.max' =>'排序不能超过5个字符',
            'state.required' =>'状态必须',
            'state.numeric' =>'状态格式有误',
        ];
    }
}
