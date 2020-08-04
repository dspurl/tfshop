<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitSpecificationRequest extends Request
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
                    'type' => 'required|numeric',
                    'is_search' => 'required|numeric',
                    'specification_group_id' => 'nullable|numeric',
                    'location' => 'required|numeric',
                    'value' => 'nullable|string',
                    'sort' => 'required|numeric|max:11'
                ];
            case 'PUT': //update
                return [
                    'name' => 'required|string|max:30',
                    'type' => 'required|numeric',
                    'is_search' => 'required|numeric',
                    'specification_group_id' => 'nullable|numeric',
                    'location' => 'required|numeric',
                    'value' => 'nullable|string',
                    'sort' => 'required|numeric|max:11'
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
            'type.required' =>'属性类型必须',
            'type.numeric' =>'属性类型格式有误',
            'is_search.required' =>'是否可搜索必须',
            'is_search.numeric' =>'是否可搜索格式有误',
            'specification_group_id.required' =>'规格组必须',
            'specification_group_id.numeric' =>'规格组格式有误',
            'location.required' =>'显示位置必须',
            'location.numeric' =>'显示位置格式有误',
            'value.string' =>'属性值格式有误',
            'sort.required' =>'排序必须',
            'sort.numeric' =>'排序格式有误',
            'sort.max' =>'排序不能超过11个字符',
        ];
    }
}
