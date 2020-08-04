<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitBrandTemplateRequest extends Request
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
                    'logo' => 'nullable|string',
                    'sort' => 'required|numeric|max:6'
                ];
            case 'PUT': //update
                return [
                    'name' => 'required|string|max:30',
                    'logo' => 'nullable|string',
                    'sort' => 'required|numeric|max:6'
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
            'name.required' =>'品牌名称必须',
            'name.string' =>'品牌名称格式有误',
            'name.max' =>'品牌名称不能超过30个字符',
            'sort.required' =>'排序必须',
            'sort.numeric' =>'排序格式有误',
            'sort.max' =>'排序不能超过6个字符',
        ];
    }
}
