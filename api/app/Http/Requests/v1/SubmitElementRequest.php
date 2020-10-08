<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitElementRequest extends Request
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
                    'name' => 'required|unique:elements|string|max:30',
                    'identify' => 'required|unique:elements|string|max:30',
                    'type' => 'required|numeric',
                    'description' => 'required|string|max:200',
                    'shows' => 'required|numeric',
                ];
            case 'PUT': //update
                $request = Request::all();
                return [
                    'name' => 'required|unique:elements,name,'.$request['id'].'|string|max:30',
                    'identify' => 'required|unique:elements,identify,'.$request['id'].'|string|max:30',
                    'type' => 'required|numeric',
                    'description' => 'required|string|max:200',
                    'shows' => 'required|numeric',
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
            'name.required' => '组件名称不能为空',
            'name.unique' => '组件名称已存在',
            'name.max' => '组件名称长度不能超过30位',
            'identify.required' => '组件标识不能为空',
            'identify.unique' => '组件标识已存在',
            'identify.max' => '组件标识长度不能超过30位',
            'type.required' => '组件类型不能为空',
            'description.required' => '组件描述不能为空',
        ];
    }


}
