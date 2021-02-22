<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitSpecificationGroupRequest extends Request
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
        $request = Request::all();
        switch ($this->method()) {
            case 'POST':    //create
                if (Request::has('id')) {   //更新
                    return [
                        'name' => 'required|string|max:30',
                    ];
                } else {
                    return [
                        'name' => 'required|string|max:30',
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
            'name.required' =>'规格组名称必须',
            'name.string' =>'规格组格式有误',
            'name.max' =>'规格组不能超过30个字符',
        ];
    }
}
