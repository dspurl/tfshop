<?php

namespace App\Http\Requests\v1;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\Request;

class SubmitStaffingSystemRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        Validator::extend('mobile', function($attribute, $value, $parameters, $validator) {
            return preg_match('/^1[34578][0-9]{9}$/', $value);
        });
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
                    'cellphone' => 'required|mobile|max:11',
                    'name' => 'required|string|max:20',
                    'apply_group_id' => 'required|numeric'
                ];
            case 'PUT': //update
                return [
                    'cellphone' => 'required|mobile|max:11',
                    'name' => 'required|string|max:20',
                    'apply_group_id' => 'required|numeric'
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
            'cellphone.required' =>'手机号不能为空',
            'name.required' =>'员工名字不能为空',
            'apply_group_id.required' =>'所属角色不能为空',
        ];
    }
}
