<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitDhlRequest extends Request
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
                    'abbreviation' => 'required|string|max:80',
                    'sort' => 'required|integer',
                    'state' => 'required|integer',
                ];
            case 'PUT': //update
                return [
                    'name' => 'required|string|max:30',
                    'abbreviation' => 'required|string|max:80',
                    'sort' => 'required|integer',
                    'state' => 'required|integer',
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
            'name.required' =>'快递公司名称必须',
            'name.string' =>'快递公司名称格式有误',
            'name.max' =>'快递公司名称不能超过30个字符',
            'abbreviation.required' =>'快递公司缩写必须',
            'abbreviation.string' =>'快递公司缩写格式有误',
            'abbreviation.max' =>'快递公司缩写不能超过80个字符',
            'state.required' =>'状态必须',
            'state.integer' =>'状态格式有误',
            'sort.required' =>'排序必须',
            'sort.integer' =>'排序格式有误',
        ];
    }
}
