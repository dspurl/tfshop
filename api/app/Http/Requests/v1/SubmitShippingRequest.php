<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitShippingRequest extends Request
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
                    'cellphone' => 'required',
                    'name' => 'required|string|max:30',
                    'address' => 'nullable|string|max:255',
                ];
            case 'PUT': //update
                return [
                    'cellphone' => 'required',
                    'name' => 'required|string|max:30',
                    'address' => 'nullable|string|max:255',
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
            'cellphone.required' =>'手机号必须',
            'name.required' =>'联系人必须',
            'location.required' =>'地址必须',
        ];
    }
}
