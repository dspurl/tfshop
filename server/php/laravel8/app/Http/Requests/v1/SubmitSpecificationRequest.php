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
        switch ($this->method()) {
            case 'POST':    //create
                if (Request::has('id')) {   //更新
                    return [
                        'name' => 'required|string|max:30',
                        'type' => 'required|numeric',
                        'is_search' => 'required|numeric',
                        'specification_group_id' => 'nullable|numeric',
                        'location' => 'required|numeric',
                        'value' => 'nullable|string',
                        'sort' => 'required|numeric|max:11'
                    ];
                } else {
                    return [
                        'name' => 'required|string|max:30',
                        'type' => 'required|numeric',
                        'is_search' => 'required|numeric',
                        'specification_group_id' => 'nullable|numeric',
                        'location' => 'required|numeric',
                        'value' => 'nullable|string',
                        'sort' => 'required|numeric|max:11'
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
            'name.required' =>'规格名称必须',
            'name.string' =>'规格格式有误',
            'name.max' =>'规格名不能超过30个字符',
            'type.required' =>'规格类型必须',
            'type.numeric' =>'规格类型格式有误',
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
