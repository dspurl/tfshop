<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitGoodsCategoryRequest extends Request
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
                    'pid' => 'required',
                    'state' => 'required|boolean',
                    'sort' => 'required|integer|max:11'
                ];
            case 'PUT': //update
                return [
                    'name' => 'required|string|max:30',
                    'pid' => 'required',
                    'state' => 'required|boolean',
                    'sort' => 'required|integer|max:11'
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
            'name.required' =>'类目名称不能为空',
            'name.string' =>'类目名称格式有误',
            'name.max' =>'类目名称不能超过30',
            'pid.required' =>'上级类目不能为空',
            'state.required' =>'类目状态有误',
            'state.boolean' =>'类目状态格式有误',
            'sort.required' =>'类目排序不能为空',
            'sort.integer' =>'类目排序格式有误',
            'sort.max' =>'类目排序长度有误',
        ];
    }
}
